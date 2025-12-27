'use client';

import { FlashSaleBanner } from '@/components/FlashSaleBanner';
import { CategoryList } from '@/components/CategoryList';
import { ProductCard } from '@/components/ProductCard';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, query, orderBy, getDocs, writeBatch, doc } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { products as dummyProducts, categories as dummyCategories } from '@/lib/dummyData';
import { Button } from '@/components/ui/button';

export default function Home() {
  const firestore = useFirestore();

  // Seed database if it's empty
  const seedDatabase = async () => {
    if (!firestore) return;
    try {
      const productsCollection = collection(firestore, 'products');
      const productsSnapshot = await getDocs(query(productsCollection));
      if (productsSnapshot.empty) {
        const batch = writeBatch(firestore);
        dummyProducts.forEach((product) => {
          const { id, name, ...rest } = product;
          const docRef = doc(productsCollection, id);
          batch.set(docRef, { title: name, description: `Description for ${name}`, ...rest });
        });
        await batch.commit();
        console.log('Products seeded!');
      }

      const categoriesCollection = collection(firestore, 'categories');
      const categoriesSnapshot = await getDocs(query(categoriesCollection));
      if (categoriesSnapshot.empty) {
        const batch = writeBatch(firestore);
        dummyCategories.forEach((category) => {
            const { id, ...rest } = category;
            const docRef = doc(categoriesCollection, id);
            batch.set(docRef, rest);
        });
        await batch.commit();
        console.log('Categories seeded!');
      }
      
      // Reload to see the data
      window.location.reload();

    } catch (error) {
      console.error("Error seeding database: ", error);
    }
  };

  const productsQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'products'), orderBy('title')) : null),
    [firestore]
  );
  
  const { data: products, isLoading } = useCollection<Product>(productsQuery);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <FlashSaleBanner />
      <CategoryList />

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-headline">Featured Products</h2>
        {isLoading && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {[...Array(10)].map((_, i) => (
              <Skeleton key={i} className="h-64 w-full" />
            ))}
          </div>
        )}
        {!isLoading && (!products || products.length === 0) && (
            <div className="text-center py-12">
                <p className="mb-4">Your database is currently empty.</p>
                <Button onClick={seedDatabase}>Seed Initial Data</Button>
            </div>
        )}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products?.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
