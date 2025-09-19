'use client';

import { ReactNode } from 'react';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import styles from './DashboardLayout.module.css';

interface DashboardLayoutProps {
  children: ReactNode;
  onCategorySelect?: (categoryId: string) => void;
  onSearch?: (query: string) => void;
}

export function DashboardLayout({ children, onCategorySelect, onSearch }: DashboardLayoutProps) {
  return (
    <div className={styles.dashboardLayout}>
      <Header onSearch={onSearch} />
      <div className={styles.dashboardContent}>
        <Sidebar onCategorySelect={onCategorySelect} />
        <main className={styles.mainContent}>
          {children}
        </main>
      </div>
    </div>
  );
}