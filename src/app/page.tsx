'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { FlashSaleBanner } from '@/components/FlashSaleBanner';
import { CategoryList } from '@/components/CategoryList';
import { ProductCard } from '@/components/ProductCard';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, getDocs, writeBatch, doc } from 'firebase/firestore';
import type { Product, Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { products as dummyProducts, categories as dummyCategories } from '@/lib/dummyData';
import { Button } from '@/components/ui/button';

function ProductGrid() {
  const firestore = useFirestore();
  const searchParams = useSearchParams();
  const router = useRouter();

  const searchTerm = searchParams.get('q') || '';
  const categoryFilter = searchParams.get('category') || '';

  const productsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'products'), orderBy('title')) : null),
    [firestore]
  );
  
  const categoriesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'categories')) : null),
    [firestore]
  );

  const { data: products, isLoading: isLoadingProducts } = useCollection<Product>(productsQuery);
  const { data: categories, isLoading: isLoadingCategories } = useCollection<Category>(categoriesQuery);

  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);

  useEffect(() => {
    if (products && categories) {
      let tempProducts = products;

      if (categoryFilter) {
        tempProducts = tempProducts.filter(p => p.categoryId === categoryFilter);
      }

      if (searchTerm) {
        const lowerCaseSearchTerm = searchTerm.toLowerCase();
        const categoryMap = new Map(categories.map(c => [c.id, c.name.toLowerCase()]));

        tempProducts = tempProducts.filter(p => 
          p.title.toLowerCase().includes(lowerCaseSearchTerm) ||
          (p.categoryId && (categoryMap.get(p.categoryId) || '').includes(lowerCaseSearchTerm))
        );
      }
      
      setFilteredProducts(tempProducts);
    }
  }, [searchTerm, categoryFilter, products, categories]);

  const isLoading = isLoadingProducts || isLoadingCategories;

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
        {[...Array(10)].map((_, i) => (
          <Skeleton key={i} className="h-64 w-full" />
        ))}
      </div>
    );
  }

  if (!isLoading && (!products || products.length === 0)) {
      return (
          <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No Products Available</h3>
              <p className="text-muted-foreground">Please check back later or contact support if you believe this is an error.</p>
          </div>
      );
  }

  if (filteredProducts.length === 0 && (searchTerm || categoryFilter)) {
    return (
      <div className="text-center py-12">
        <h3 className="text-xl font-semibold mb-2">No Products Found</h3>
        <p className="text-muted-foreground mb-4">Try adjusting your search or filter.</p>
        <Button onClick={() => router.push('/')}>Clear Filters</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
      {filteredProducts.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}


export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <FlashSaleBanner />
      <Suspense fallback={<Skeleton className="h-20 w-full" />}>
        <CategoryList />
      </Suspense>

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-headline">Featured Products</h2>
        <Suspense fallback={<div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">{[...Array(10)].map((_, i) => (<Skeleton key={i} className="h-64 w-full" />))}</div>}>
           <ProductGrid />
        </Suspense>
      </div>
    </div>
  );
}
