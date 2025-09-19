'use client';

import { useState } from 'react';
import { SearchBar } from '../search/SearchBar';
import { CartSidebar } from '../cart/CartSidebar';
import { UserMenu } from '../user/UserMenu';
import styles from './Header.module.css';

interface HeaderProps {
  onSearch?: (query: string) => void;
}

export function Header({ onSearch }: HeaderProps) {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <div className={styles.logoSection}>
          <h1 className={styles.logo}>Popcorn</h1>
          <span className={styles.tagline}>Your AI Shopping Assistant</span>
        </div>
        
        <div className={styles.searchSection}>
          <SearchBar onSearch={onSearch} />
        </div>
        
        <div className={styles.headerActions}>
          <button 
            className={styles.cartButton}
            onClick={() => setIsCartOpen(true)}
          >
            <svg className={styles.cartIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5M7 13l2.5 5m6-5v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6m8 0V9a2 2 0 00-2-2H9a2 2 0 00-2 2v4.01" />
            </svg>
            <span className={styles.cartCount}>0</span>
          </button>
          
          <UserMenu />
        </div>
      </div>
      
      <CartSidebar isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </header>
  );
}