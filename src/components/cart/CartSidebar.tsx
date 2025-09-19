'use client';

import { useState } from 'react';
import styles from './CartSidebar.module.css';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CartSidebar({ isOpen, onClose }: CartSidebarProps) {
  const [cartItems] = useState<CartItem[]>([]);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <>
      {isOpen && (
        <div className={styles.overlay} onClick={onClose} />
      )}
      <div className={`${styles.cartSidebar} ${isOpen ? styles.cartSidebarOpen : ''}`}>
        <div className={styles.cartHeader}>
          <h2 className={styles.cartTitle}>Shopping Cart</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <svg className={styles.closeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className={styles.cartContent}>
          {cartItems.length === 0 ? (
            <div className={styles.emptyCart}>
              <div className={styles.emptyCartIcon}>🛒</div>
              <h3 className={styles.emptyCartTitle}>Your cart is empty</h3>
              <p className={styles.emptyCartText}>
                Start shopping to add items to your cart
              </p>
            </div>
          ) : (
            <div className={styles.cartItems}>
              {cartItems.map((item) => (
                <div key={item.id} className={styles.cartItem}>
                  <img src={item.image} alt={item.name} className={styles.cartItemImage} />
                  <div className={styles.cartItemDetails}>
                    <h4 className={styles.cartItemName}>{item.name}</h4>
                    <p className={styles.cartItemPrice}>${item.price.toFixed(2)}</p>
                    <div className={styles.cartItemQuantity}>
                      <button className={styles.quantityButton}>-</button>
                      <span className={styles.quantityValue}>{item.quantity}</span>
                      <button className={styles.quantityButton}>+</button>
                    </div>
                  </div>
                  <button className={styles.removeButton}>
                    <svg className={styles.removeIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
        
        {cartItems.length > 0 && (
          <div className={styles.cartFooter}>
            <div className={styles.cartTotal}>
              <span className={styles.totalLabel}>Total:</span>
              <span className={styles.totalAmount}>${total.toFixed(2)}</span>
            </div>
            <button className={styles.checkoutButton}>
              Proceed to Checkout
            </button>
          </div>
        )}
      </div>
    </>
  );
}