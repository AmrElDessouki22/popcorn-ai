import { DataSource } from 'typeorm';
import { BaseRepository } from './BaseRepository';
import { Product } from '@/models/Product';

export class ProductRepository extends BaseRepository<Product> {
  constructor(dataSource: DataSource) {
    super(dataSource, Product);
  }

  public async findByCategory(category: string, includeDeleted: boolean = false): Promise<Product[]> {
    return await this.findMany({ category } as Partial<Product>, includeDeleted);
  }

  public async findInStock(includeDeleted: boolean = false): Promise<Product[]> {
    return await this.findMany({ inStock: true } as Partial<Product>, includeDeleted);
  }

  public async findBySeller(sellerId: number, includeDeleted: boolean = false): Promise<Product[]> {
    return await this.findMany({ sellerId } as Partial<Product>, includeDeleted);
  }

  public async findOutOfStock(includeDeleted: boolean = false): Promise<Product[]> {
    return await this.findMany({ inStock: false } as Partial<Product>, includeDeleted);
  }

  public async softDeleteProduct(id: number): Promise<boolean> {
    return await this.softDelete(id);
  }

  public async restoreProduct(id: number): Promise<boolean> {
    return await this.restore(id);
  }

  public async findDeletedProducts(): Promise<Product[]> {
    return await this.findDeleted();
  }

  public async searchProducts(ids: string[]): Promise<Product[]> {
    try {
      return await this.repository
        .createQueryBuilder('product')
        .where('product.id IN (:...ids)', { ids })
        .andWhere('product.deletedAt IS NULL')
        .andWhere('product.inStock = :inStock', { inStock: true })
        .orderBy('product.name', 'ASC')
        .getMany();
    } catch (error) {
      console.error('Error searching products:', error);
      throw error;
    }
  }

  public async searchProductsByQuery(query: string): Promise<Product[]> {
    try {
      const searchTerm = `%${query.toLowerCase()}%`;
      return await this.repository
        .createQueryBuilder('product')
        .where('product.deletedAt IS NULL')
        .andWhere('product.inStock = :inStock', { inStock: true })
        .andWhere(
          '(LOWER(product.name) LIKE :searchTerm OR ' +
          'LOWER(product.description) LIKE :searchTerm OR ' +
          'LOWER(product.category) LIKE :searchTerm OR ' +
          'LOWER(product.tags) LIKE :searchTerm)',
          { searchTerm }
        )
        .orderBy('product.name', 'ASC')
        .getMany();
    } catch (error) {
      console.error('Error searching products by query:', error);
      throw error;
    }
  }
}