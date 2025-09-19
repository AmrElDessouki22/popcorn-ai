import OpenAI from 'openai';
import { ProductService } from './ProductService';
import { MessageService } from './MessageService';
import { Product } from '@/models/Product';

export class AIService {
  private openai: OpenAI;
  private productService: ProductService;
  private messageService: MessageService;

  constructor() {
    this.openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });
    this.productService = null as any;
    this.messageService = null as any;
  }

  async generateResponse(
    userMessage: string, 
    conversationId: number, 
    userId: number
  ): Promise<{ message: string; richContent?: any; type?: string }> {
    try {
      this.productService = new ProductService();
      this.messageService = new MessageService();
      
      const conversationHistory = await this.getConversationHistory(conversationId);
      
      const systemMessage = await this.getSystemMessage();
      
      const messages = [
        { role: 'system' as const, content: systemMessage },
        ...conversationHistory,
        { role: 'user' as const, content: userMessage }
      ];

      const functions = [
        {
          name: 'search_products',
          description: 'Fetch detailed product information by IDs and return them directly to the user',
          parameters: {
            type: 'object',
            properties: {
              ids: {
                type: 'array',
                items: { type: 'string' },
                description: 'List of product IDs to fetch details for'
              }
            },
            required: ['ids']
          }
        }
      ];
      

      const completion = await this.openai.chat.completions.create({
        model: 'gpt-4',
        messages,
        functions,
        function_call: 'auto',
        temperature: 0.7,
        max_tokens: 1000,
      });

      const response = completion.choices[0].message;
      console.log('OpenAI Response:', response);

      if (response.function_call) {
        return await this.handleFunctionCall(response.function_call, userMessage, conversationId, userId);
      }

      return {
        message: response.content || 'I apologize, but I couldn\'t generate a response.',
      };

    } catch (error) {
      console.error('Error generating AI response:', error);
      return {
        message: 'I apologize, but I encountered an error. Please try again.',
      };
    }
  }

  /**
   * Handle OpenAI function calls
   */
  private async handleFunctionCall(
    functionCall: any, 
    userMessage: string, 
    conversationId: number, 
    userId: number
  ): Promise<{ message: string; richContent?: any; type?: string }> {
    const { name, arguments: args } = functionCall;
    const parsedArgs = JSON.parse(args);

    switch (name) {
      case 'search_products':
        return await this.searchProducts(parsedArgs.ids, userMessage, conversationId, userId);

      default:
        return {
          message: 'I apologize, but I couldn\'t process your request.',
        };
    }
  }

  /**
   * Search products based on user query and return them directly
   */
  private async searchProducts(
    ids: string[],
    userMessage: string, 
    conversationId: number, 
    userId: number
  ): Promise<{ message: string; richContent?: any; type?: string }> {
    try {
      const products = await this.productService.searchProducts(ids);
      
      if (products.length === 0) {
        return {
          message: `I couldn't find any products . Please try a different search or let me know what specific features you're looking for.`,
        };
      }

      const productIds = products.map(p => p.id.toString());
      
      const displayProducts = await this.productService.searchProducts(productIds);
      
      if (displayProducts.length === 0) {
        return {
          message: `I found products  but couldn't retrieve their details. Please try again.`,
        };
      }

      const limitedProducts = displayProducts.slice(0, 6);

      const carouselContent = {
        type: 'product_carousel',
        products: limitedProducts.map(product => ({
          id: product.id,
          name: product.name,
          description: product.description,
          price: product.price,
          imageUrl: product.imageUrl,
          category: product.category,
          inStock: product.inStock,
          tags: product.tags
        }))
      };

      const productNames = limitedProducts.map(p => p.name).join(', ');
      const message = `I found ${products.length} products. Here are the best options: ${productNames}. You can click on any product to learn more or add it to your cart.`;


      return {
        message,
        richContent: carouselContent,
        type: 'carousel'
      };

    } catch (error) {
      console.error('Error searching products:', error);
      return {
        message: 'I apologize, but I couldn\'t search for products right now. Please try again.',
      };
    }
  }

  /**
   * Get conversation history for context
   */
  private async getConversationHistory(conversationId: number): Promise<any[]> {
    try {
      const messages = await this.messageService.findByConversationId(conversationId);
      
      const recentMessages = messages.slice(-10).map(msg => ({
        role: msg.senderType === 'user' ? 'user' as const : 'assistant' as const,
        content: msg.content
      }));

      return recentMessages;
    } catch (error) {
      console.error('Error getting conversation history:', error);
      return [];
    }
  }


private async getSystemMessage(): Promise<string> {
  const products: Product[] = await this.productService.findAll();

  const productData = products.map(p => ({
    id: p.id,
    name: p.name,
    description: p.description,
    category: p.category,
    tags: p.tags,
    price: p.price,
    inStock: p.inStock
  }));

  return `
You are Popcorn AI, the official AI assistant for Popcorn - a prestigious local brand founded in Egypt over 100 years ago. Popcorn specializes in:

1. **Clothing & Fashion**: High-quality apparel including shirts, jeans, jackets, dresses, and shoes
2. **Premium Coffee**: Artisanal coffee beans, tea, and beverages from around the world  
3. **Technology**: Laptops, computers, and tech accessories from top brands

**COMPLETE PRODUCT CATALOG:**
${JSON.stringify(productData, null, 2)}

**IMPORTANT GUIDELINES:**
- ONLY discuss Popcorn products and services. Do not talk about other brands or topics
- You are based in Egypt and serve customers locally and internationally
- Always be helpful, friendly, and professional
- Focus on helping customers find the perfect products for their needs

**DELIVERY & POLICIES:**
- **Delivery Time**: 3 days for local delivery in Egypt
- **Return Policy**: 30-day return policy for unused items with original packaging
- **International Shipping**: Available with extended delivery times
- **Customer Service**: Available 24/7 for support

**FUNCTION USAGE:**
- When user asks about products, use the product catalog above to find matching products
- Call \`search_products(ids)\` with the exact product IDs from the catalog
- The function will return full product details with images for those IDs
- Always provide helpful product recommendations based on the catalog
- If no products match, suggest alternatives or ask clarifying questions

**EXAMPLES:**
- User: "Show me laptops" → Call search_products with laptop product IDs
- User: "I need coffee" → Call search_products with coffee product IDs  
- User: "What clothes do you have?" → Call search_products with clothing product IDs

Remember: You are Popcorn AI, representing a century-old Egyptian brand with pride and excellence.
  `;
}

}