'use client';

import { useState, useEffect } from 'react';
import { ProductCard } from './ProductCard';
import styles from './ProductGrid.module.css';

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  tags: string[];
  inStock: boolean;
}

interface ProductGridProps {
  category?: string;
  searchQuery?: string;
}

export function ProductGrid({ category, searchQuery }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'price' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    fetchProducts();
  }, [category, searchQuery]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const mockProducts: Product[] = [
        {
          id: 1,
          name: 'Classic White T-Shirt',
          description: 'Comfortable cotton t-shirt perfect for everyday wear',
          price: 19.99,
          category: 'clothes',
          imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400',
          tags: ['cotton', 'comfortable', 'casual'],
          inStock: true
        },
        {
          id: 2,
          name: 'MacBook Pro 16"',
          description: 'Powerful laptop with M2 chip for professionals',
          price: 2499.99,
          category: 'laptop',
          imageUrl: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400',
          tags: ['macbook', 'professional', 'powerful'],
          inStock: true
        },
        {
          id: 3,
          name: 'Premium Coffee Beans',
          description: 'High-quality arabica coffee beans from Colombia',
          price: 24.99,
          category: 'drinks',
          imageUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=400',
          tags: ['coffee', 'arabica', 'premium'],
          inStock: true
        }
      ];

      let filteredProducts = mockProducts;

      if (category && category !== 'all') {
        filteredProducts = filteredProducts.filter(p => p.category === category);
      }

      if (searchQuery) {
        filteredProducts = filteredProducts.filter(p => 
          p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
        );
      }

      filteredProducts.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortBy) {
          case 'name':
            aValue = a.name;
            bValue = b.name;
            break;
          case 'price':
            aValue = a.price;
            bValue = b.price;
            break;
          case 'category':
            aValue = a.category;
            bValue = b.category;
            break;
          default:
            aValue = a.name;
            bValue = b.name;
        }

        if (sortOrder === 'asc') {
          return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
          return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
        }
      });

      setProducts(filteredProducts);
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSortChange = (newSortBy: 'name' | 'price' | 'category') => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.loadingSpinner}></div>
        <p className={styles.loadingText}>Loading products...</p>
      </div>
    );
  }

  return (
    <div className={styles.productGrid}>
      <div className={styles.gridHeader}>
        <h2 className={styles.gridTitle}>
          {category === 'all' || !category ? 'All Products' : 
           category === 'clothes' ? 'Clothing' :
           category === 'laptop' ? 'Laptops' :
           category === 'drinks' ? 'Beverages' : category}
        </h2>
        <div className={styles.gridControls}>
          <div className={styles.sortControls}>
            <span className={styles.sortLabel}>Sort by:</span>
            <button 
              className={`${styles.sortButton} ${sortBy === 'name' ? styles.sortButtonActive : ''}`}
              onClick={() => handleSortChange('name')}
            >
              Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={`${styles.sortButton} ${sortBy === 'price' ? styles.sortButtonActive : ''}`}
              onClick={() => handleSortChange('price')}
            >
              Price {sortBy === 'price' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
            <button 
              className={`${styles.sortButton} ${sortBy === 'category' ? styles.sortButtonActive : ''}`}
              onClick={() => handleSortChange('category')}
            >
              Category {sortBy === 'category' && (sortOrder === 'asc' ? '↑' : '↓')}
            </button>
          </div>
        </div>
      </div>

      {products.length === 0 ? (
        <div className={styles.emptyState}>
          <div className={styles.emptyIcon}>🔍</div>
          <h3 className={styles.emptyTitle}>No products found</h3>
          <p className={styles.emptyText}>
            Try adjusting your search or filter criteria
          </p>
        </div>
      ) : (
        <div className={styles.grid}>
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}