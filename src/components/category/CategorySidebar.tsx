'use client';

import { useState } from 'react';
import styles from './CategorySidebar.module.css';

interface Category {
  id: string;
  name: string;
  count: number;
  icon: string;
}

const categories: Category[] = [
  { id: 'all', name: 'All Products', count: 15, icon: '🛍️' },
  { id: 'clothes', name: 'Clothing', count: 5, icon: '👕' },
  { id: 'laptop', name: 'Laptops', count: 5, icon: '💻' },
  { id: 'drinks', name: 'Beverages', count: 5, icon: '🥤' },
];

interface CategorySidebarProps {
  onCategorySelect?: (categoryId: string) => void;
}

export function CategorySidebar({ onCategorySelect }: CategorySidebarProps) {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const handleCategoryClick = (categoryId: string) => {
    setSelectedCategory(categoryId);
    onCategorySelect?.(categoryId);
  };

  return (
    <div className={styles.categorySidebar}>
      <h2 className={styles.sidebarTitle}>Categories</h2>
      <nav className={styles.categoryNav}>
        {categories.map((category) => (
          <button
            key={category.id}
            className={`${styles.categoryItem} ${
              selectedCategory === category.id ? styles.categoryItemActive : ''
            }`}
            onClick={() => handleCategoryClick(category.id)}
          >
            <span className={styles.categoryIcon}>{category.icon}</span>
            <span className={styles.categoryName}>{category.name}</span>
            <span className={styles.categoryCount}>({category.count})</span>
          </button>
        ))}
      </nav>
      
      <div className={styles.sidebarSection}>
        <h3 className={styles.sectionTitle}>Filters</h3>
        <div className={styles.filterGroup}>
          <label className={styles.filterLabel}>
            <input type="checkbox" className={styles.filterCheckbox} />
            <span className={styles.filterText}>In Stock Only</span>
          </label>
          <label className={styles.filterLabel}>
            <input type="checkbox" className={styles.filterCheckbox} />
            <span className={styles.filterText}>On Sale</span>
          </label>
        </div>
      </div>
    </div>
  );
}