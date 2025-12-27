'use client';

import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Star } from 'lucide-react';
import { doc } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const FALLBACK_IMAGE_URL = 'https://picsum.photos/seed/placeholder/600/600';

export default function ProductDetailPage({ params: { id } }: { params: { id: string } }) {
  const firestore = useFirestore();

  const productRef = useMemoFirebase(
    () => (firestore && id ? doc(firestore, 'products', id) : null),
    [firestore, id]
  );

  const { data: product, isLoading } = useDoc<Product>(productRef);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-square rounded-lg" />
          <div className="flex flex-col justify-center space-y-4">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-6 w-1/2" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-12 w-48" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    notFound();
  }

  const imageUrl = product.imageUrl || FALLBACK_IMAGE_URL;

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div className="relative aspect-square rounded-lg overflow-hidden shadow-lg">
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 50vw"
            onError={(e) => {
              e.currentTarget.srcset = FALLBACK_IMAGE_URL;
              e.currentTarget.src = FALLBACK_IMAGE_URL;
            }}
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.title}</h1>
          <p className="text-2xl font-semibold text-primary mb-4">৳{product.price}</p>
          <div className="flex items-center gap-1 mb-4">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-muted-foreground ml-2">(123 reviews)</span>
          </div>
          <p className="text-muted-foreground mb-6">
            {product.description}
          </p>
          <div className="w-full sm:w-auto">
             <AddToCartButton product={product} />
          </div>
        </div>
      </div>
    </div>
  );
}
