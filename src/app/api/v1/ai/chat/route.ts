import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { dbConnection } from '@/lib/database';
import { ConversationService } from '@/services/ConversationService';
import { MessageService } from '@/services/MessageService';
import { AIService } from '@/services/AIService';
import { ApiResponseBuilder } from '@/helpers/utils/api';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json(
        ApiResponseBuilder.error('Unauthorized'),
        { status: 401 }
      );
    }

    await dbConnection.connect();
    
    const body = await request.json();
    const { message, conversationId } = body;

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        ApiResponseBuilder.error('Message is required'),
        { status: 400 }
      );
    }

    const conversationService = new ConversationService();
    const messageService = new MessageService();
    const aiService = new AIService();

    let conversation;
    
    if (!conversationId) {
      conversation = await conversationService.create({
        title: message.length > 50 ? message.substring(0, 50) + '...' : message,
        userId: parseInt(session.user.id),
        type: 'assistant',
      });
    } else {
      conversation = await conversationService.findById(conversationId);
      if (!conversation) {
        return NextResponse.json(
          ApiResponseBuilder.error('Conversation not found'),
          { status: 404 }
        );
      }
    }

    const userMessage = await messageService.create({
      content: message,
      senderType: 'user',
      senderName: `${session.user.firstName} ${session.user.lastName}`,
      userId: parseInt(session.user.id),
      conversationId: conversation.id,
      type: 'text',
    });

    console.log('Generating AI response for message:', message);
    const aiResponse = await aiService.generateResponse(message, conversation.id, parseInt(session.user.id));
    console.log('AI Response received:', aiResponse);

    console.log('Saving AI message with richContent:', aiResponse.richContent);
    const aiMessage = await messageService.create({
      content: aiResponse.message,
      senderType: 'ai',
      senderName: 'AI',
      conversationId: conversation.id,
      type: aiResponse.type || 'text',
      richContent: aiResponse.richContent,
    });
    console.log('AI message saved with ID:', aiMessage.id);

    await conversationService.update(conversation.id, {
      lastMessageAt: new Date(),
    });

    return NextResponse.json({
      success: true,
      data: {
        message: aiResponse.message,
        conversationId: conversation.id,
        userMessageId: userMessage.id,
        aiMessageId: aiMessage.id,
        richContent: aiResponse.richContent,
        type: aiResponse.type,
      }
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'An error occurred',
    }, { status: 500 });
  }
}
