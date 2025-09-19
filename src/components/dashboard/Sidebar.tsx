'use client';

import { CategorySidebar } from '../category/CategorySidebar';
import styles from './Sidebar.module.css';

interface SidebarProps {
  onCategorySelect?: (categoryId: string) => void;
}

export function Sidebar({ onCategorySelect }: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarContent}>
        <CategorySidebar onCategorySelect={onCategorySelect} />
      </div>
    </aside>
  );
}