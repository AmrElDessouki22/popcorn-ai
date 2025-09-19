import { IService } from '../types/interfaces/IService';
import { dbConnection } from '@/lib/database';
import { ProductRepository } from '@/repositories/ProductRepository';
import { Product } from '@/models/Product';

export class ProductService implements IService<Product> {
  private productRepository: ProductRepository;

  constructor() {
    this.productRepository = new ProductRepository(dbConnection.getDataSource());
  }

  public async findById(id: number): Promise<Product | null> {
    try {
      return await this.productRepository.findById(id);
    } catch (error) {
      console.error('Error finding product by ID:', error);
      throw error;
    }
  }

  public async findAll(): Promise<Product[]> {
    try {
      return await this.productRepository.findAll();
    } catch (error) {
      console.error('Error finding all products:', error);
      throw error;
    }
  }

  public async searchProducts(ids: string[]): Promise<Product[]> {
    try {
      return await this.productRepository.searchProducts(ids);
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  public async searchProductsByQuery(query: string): Promise<Product[]> {
    try {
      return await this.productRepository.searchProductsByQuery(query);
    } catch (error) {
      console.error('Error searching products by query:', error);
      throw error;
    }
  }

  public async create(productData: Partial<Product>): Promise<Product> {
    try {
      if (!productData.name || !productData.description || !productData.price) {
        throw new Error('Name, description, and price are required');
      }

      if (productData.price! < 0) {
        throw new Error('Price must be non-negative');
      }

      return await this.productRepository.create(productData);
    } catch (error) {
      console.error('Error creating product:', error);
      throw error;
    }
  }

  public async update(id: number, productData: Partial<Product>): Promise<Product | null> {
    try {
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      return await this.productRepository.update(id, productData);
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  }

  public async delete(id: number): Promise<boolean> {
    try {
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      return await this.productRepository.softDeleteProduct(id);
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  }

  public async restore(id: number): Promise<boolean> {
    try {
      const existingProduct = await this.productRepository.findByIdWithDeleted(id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      if (!existingProduct.isDeleted()) {
        throw new Error('Product is not deleted');
      }

      return await this.productRepository.restoreProduct(id);
    } catch (error) {
      console.error('Error restoring product:', error);
      throw error;
    }
  }

  public async findDeleted(): Promise<Product[]> {
    try {
      return await this.productRepository.findDeletedProducts();
    } catch (error) {
      console.error('Error finding deleted products:', error);
      throw error;
    }
  }

  public async hardDelete(id: number): Promise<boolean> {
    try {
      const existingProduct = await this.productRepository.findById(id);
      if (!existingProduct) {
        throw new Error('Product not found');
      }

      return await this.productRepository.hardDelete(id);
    } catch (error) {
      console.error('Error hard deleting product:', error);
      throw error;
    }
  }

  public async findOne(filter: Partial<Product>): Promise<Product | null> {
    try {
      return await this.productRepository.findOne(filter);
    } catch (error) {
      console.error('Error finding product:', error);
      throw error;
    }
  }

  public async findMany(filter: Partial<Product>): Promise<Product[]> {
    try {
      return await this.productRepository.findMany(filter);
    } catch (error) {
      console.error('Error finding products:', error);
      throw error;
    }
  }

  public async findByCategory(category: string): Promise<Product[]> {
    try {
      return await this.productRepository.findByCategory(category);
    } catch (error) {
      console.error('Error finding products by category:', error);
      throw error;
    }
  }

  public async findInStock(): Promise<Product[]> {
    try {
      return await this.productRepository.findInStock();
    } catch (error) {
      console.error('Error finding products in stock:', error);
      throw error;
    }
  }

  public async findBySeller(sellerId: number): Promise<Product[]> {
    try {
      return await this.productRepository.findBySeller(sellerId);
    } catch (error) {
      console.error('Error finding products by seller:', error);
      throw error;
    }
  }
}