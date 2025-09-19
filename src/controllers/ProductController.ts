import { NextRequest, NextResponse } from 'next/server';
import { ProductService } from '@/services/ProductService';
import { ApiResponseBuilder, handleApiError } from '@/helpers/utils/api';

export class ProductController {
  private productService: ProductService;

  constructor() {
    this.productService = new ProductService();
  }

  public async getProducts(): Promise<NextResponse> {
    try {
      const products = await this.productService.findAll();
      return NextResponse.json(
        ApiResponseBuilder.success(products, 'Products retrieved successfully')
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

  public async getProductById(id: string): Promise<NextResponse> {
    try {
      const productId = parseInt(id);
      
      if (isNaN(productId)) {
        return NextResponse.json(
          ApiResponseBuilder.error('Invalid product ID', 'Product ID must be a number'),
          { status: 400 }
        );
      }

      const product = await this.productService.findById(productId);

      if (!product) {
        return NextResponse.json(
          ApiResponseBuilder.error('Product not found', 'No product found with the provided ID'),
          { status: 404 }
        );
      }

      return NextResponse.json(
        ApiResponseBuilder.success(product, 'Product retrieved successfully')
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

  public async createProduct(request: NextRequest): Promise<NextResponse> {
    try {
      const body = await request.json();
      const product = await this.productService.create(body);

      return NextResponse.json(
        ApiResponseBuilder.success(product, 'Product created successfully'),
        { status: 201 }
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

  public async updateProduct(id: string, request: NextRequest): Promise<NextResponse> {
    try {
      const productId = parseInt(id);
      const body = await request.json();
      
      if (isNaN(productId)) {
        return NextResponse.json(
          ApiResponseBuilder.error('Invalid product ID', 'Product ID must be a number'),
          { status: 400 }
        );
      }

      const product = await this.productService.update(productId, body);

      if (!product) {
        return NextResponse.json(
          ApiResponseBuilder.error('Product not found', 'No product found with the provided ID'),
          { status: 404 }
        );
      }

      return NextResponse.json(
        ApiResponseBuilder.success(product, 'Product updated successfully')
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

  public async deleteProduct(id: string): Promise<NextResponse> {
    try {
      const productId = parseInt(id);
      
      if (isNaN(productId)) {
        return NextResponse.json(
          ApiResponseBuilder.error('Invalid product ID', 'Product ID must be a number'),
          { status: 400 }
        );
      }

      const deleted = await this.productService.delete(productId);

      if (!deleted) {
        return NextResponse.json(
          ApiResponseBuilder.error('Product not found', 'No product found with the provided ID'),
          { status: 404 }
        );
      }

      return NextResponse.json(
        ApiResponseBuilder.success(null, 'Product soft deleted successfully')
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

  public async restoreProduct(id: string): Promise<NextResponse> {
    try {
      const productId = parseInt(id);
      
      if (isNaN(productId)) {
        return NextResponse.json(
          ApiResponseBuilder.error('Invalid product ID', 'Product ID must be a number'),
          { status: 400 }
        );
      }

      const restored = await this.productService.restore(productId);

      if (!restored) {
        return NextResponse.json(
          ApiResponseBuilder.error('Product not found or not deleted', 'No deleted product found with the provided ID'),
          { status: 404 }
        );
      }

      return NextResponse.json(
        ApiResponseBuilder.success(null, 'Product restored successfully')
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

  public async getDeletedProducts(): Promise<NextResponse> {
    try {
      const products = await this.productService.findDeleted();
      return NextResponse.json(
        ApiResponseBuilder.success(products, 'Deleted products retrieved successfully')
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

  public async hardDeleteProduct(id: string): Promise<NextResponse> {
    try {
      const productId = parseInt(id);
      
      if (isNaN(productId)) {
        return NextResponse.json(
          ApiResponseBuilder.error('Invalid product ID', 'Product ID must be a number'),
          { status: 400 }
        );
      }

      const deleted = await this.productService.hardDelete(productId);

      if (!deleted) {
        return NextResponse.json(
          ApiResponseBuilder.error('Product not found', 'No product found with the provided ID'),
          { status: 404 }
        );
      }

      return NextResponse.json(
        ApiResponseBuilder.success(null, 'Product permanently deleted successfully')
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

  public async getProductsByCategory(category: string): Promise<NextResponse> {
    try {
      const products = await this.productService.findByCategory(category);
      return NextResponse.json(
        ApiResponseBuilder.success(products, `Products in category '${category}' retrieved successfully`)
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

  public async getProductsInStock(): Promise<NextResponse> {
    try {
      const products = await this.productService.findInStock();
      return NextResponse.json(
        ApiResponseBuilder.success(products, 'Products in stock retrieved successfully')
      );
    } catch (error) {
      return NextResponse.json(
        handleApiError(error),
        { status: 500 }
      );
    }
  }

}