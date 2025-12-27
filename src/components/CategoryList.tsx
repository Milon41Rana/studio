'use client';

import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useCollection, useFirestore, useMemoFirebase } from '@/firebase';
import { collection, orderBy, query } from 'firebase/firestore';
import type { Category } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

export function CategoryList() {
  const firestore = useFirestore();
  const categoriesQuery = useMemoFirebase(
    () => (firestore ? query(collection(firestore, 'categories'), orderBy('name')) : null),
    [firestore]
  );
  const { data: categories, isLoading } = useCollection<Category>(categoriesQuery);

  return (
    <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-headline">Categories</h2>
        <div className="flex space-x-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {isLoading && [...Array(6)].map((_, i) => <Skeleton key={i} className="h-10 w-24 rounded-md" />)}
            {categories?.map((category) => (
                <Button key={category.id} variant="secondary" className="shrink-0 shadow-sm" asChild>
                    <Link href={`/category/${category.id}`}>{category.name}</Link>
                </Button>
            ))}
        </div>
    </div>
  );
}
