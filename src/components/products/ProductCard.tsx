'use client';

import { useState } from 'react';
import styles from './ProductCard.module.css';

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

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'clothes': return '👕';
      case 'laptop': return '💻';
      case 'drinks': return '🥤';
      default: return '📦';
    }
  };

  return (
    <div 
      className={`${styles.productCard} ${isHovered ? styles.productCardHovered : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={styles.cardImageContainer}>
        <div className={styles.imagePlaceholder}>
          {!imageLoaded && (
            <div className={styles.imageSkeleton}>
              <span className={styles.categoryIcon}>{getCategoryIcon(product.category)}</span>
            </div>
          )}
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`${styles.cardImage} ${imageLoaded ? styles.cardImageLoaded : ''}`}
            onLoad={handleImageLoad}
            onError={() => setImageLoaded(false)}
          />
        </div>
        
        <div className={styles.cardOverlay}>
          <button className={styles.quickViewButton}>
            <svg className={styles.quickViewIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
            </svg>
            Quick View
          </button>
        </div>
        
        {!product.inStock && (
          <div className={styles.outOfStockBadge}>
            Out of Stock
          </div>
        )}
      </div>

      <div className={styles.cardContent}>
        <div className={styles.cardHeader}>
          <span className={styles.cardCategory}>
            {getCategoryIcon(product.category)} {product.category}
          </span>
          <div className={styles.cardRating}>
            <div className={styles.stars}>
              {[...Array(5)].map((_, i) => (
                <svg key={i} className={styles.star} fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              ))}
            </div>
            <span className={styles.ratingText}>(4.5)</span>
          </div>
        </div>

        <h3 className={styles.cardTitle}>{product.name}</h3>
        <p className={styles.cardDescription}>{product.description}</p>

        <div className={styles.cardTags}>
          {product.tags.slice(0, 3).map((tag, index) => (
            <span key={index} className={styles.cardTag}>
              {tag}
            </span>
          ))}
        </div>

        <div className={styles.cardFooter}>
          <div className={styles.cardPrice}>
            <span className={styles.priceSymbol}>$</span>
            <span className={styles.priceAmount}>{product.price.toFixed(2)}</span>
          </div>
          
          <button 
            className={`${styles.addToCartButton} ${!product.inStock ? styles.addToCartButtonDisabled : ''}`}
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            <svg className={styles.cartIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
          </button>
        </div>
      </div>
    </div>
  );
}