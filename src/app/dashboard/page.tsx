'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { HeroBanner } from '@/components/banner/HeroBanner';
import { ProductGrid } from '@/components/products/ProductGrid';
import { ChatButton } from '@/components/chat/ChatButton';

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (status === 'loading') return;
    if (!session) router.replace('/auth/signin');
  }, [session, status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  return (
    <>
      <DashboardLayout 
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
      >
        <div className="space-y-8">
          <HeroBanner />
          
          <div className="flex flex-col lg:flex-row gap-8">
            <div className="lg:w-1/4">
              {/* Category sidebar is already included in DashboardLayout */}
            </div>
            
            <div className="lg:w-3/4">
              <ProductGrid 
                category={selectedCategory} 
                searchQuery={searchQuery}
              />
            </div>
          </div>
        </div>
      </DashboardLayout>
      
      <ChatButton />
    </>
  );
}