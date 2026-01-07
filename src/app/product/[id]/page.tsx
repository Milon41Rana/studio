
'use client';

import React, { use } from 'react';
import { useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { AddToCartButton } from '@/components/AddToCartButton';
import { Star, Package, ShieldCheck, Truck } from 'lucide-react';
import { doc } from 'firebase/firestore';
import type { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import Head from 'next/head';

const FALLBACK_IMAGE_URL = 'https://picsum.photos/seed/placeholder/600/600';

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const { id } = params;
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
  
  const displayPrice = product.salePrice ?? product.regularPrice;
  const productWithPrice = { ...product, price: displayPrice };

  const imageUrl = product.imageUrl || FALLBACK_IMAGE_URL;
  const productUrl = typeof window !== 'undefined' ? window.location.href : '';

  return (
    <>
    <Head>
        <title>{product.title} - Super Shop</title>
        <meta name="description" content={product.description} />
        
        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content={productUrl} />
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:price:amount" content={String(displayPrice)} />
        <meta property="og:price:currency" content="BDT" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content={productUrl} />
        <meta property="twitter:title" content={product.title} />
        <meta property="twitter:description" content={product.description} />
        <meta property="twitter:image" content={imageUrl} />
      </Head>
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
             {product.stockQuantity <= 0 && (
                <Badge variant="destructive" className="absolute top-4 left-4 z-10 text-lg p-2">Stock Out</Badge>
            )}
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">{product.title}</h1>
            <div className="flex items-baseline gap-3 mb-4">
                {product.salePrice && product.salePrice < product.regularPrice ? (
                <>
                    <p className="text-3xl font-semibold text-primary">৳{product.salePrice}</p>
                    <p className="text-xl text-muted-foreground line-through">৳{product.regularPrice}</p>
                </>
                ) : (
                <p className="text-3xl font-semibold text-foreground">৳{product.regularPrice}</p>
                )}
            </div>
            <div className="flex items-center gap-1 mb-4">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className={`h-5 w-5 ${i < 4 ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}`} />
              ))}
              <span className="text-muted-foreground ml-2">(123 reviews)</span>
            </div>
            <p className="text-muted-foreground mb-6">
              {product.description}
            </p>

            {product.variants && (
                <div className="mb-6">
                    <h3 className="text-sm font-medium text-muted-foreground mb-2">Available Variants</h3>
                    <div className="flex flex-wrap gap-2">
                        {product.variants.split(',').map(v => v.trim()).map(variant => (
                            <Badge key={variant} variant="outline" className="px-3 py-1 text-base">{variant}</Badge>
                        ))}
                    </div>
                </div>
            )}
            
            <div className="w-full sm:w-auto mb-6">
               <AddToCartButton product={productWithPrice} />
            </div>

            <div className="flex flex-col gap-3 text-sm text-muted-foreground border-t pt-4">
                <div className="flex items-center gap-2"><Package className="h-5 w-5 text-primary" /> <span>In Stock: {product.stockQuantity > 0 ? `${product.stockQuantity} units` : 'Out of Stock'}</span></div>
                <div className="flex items-center gap-2"><Truck className="h-5 w-5 text-primary" /> <span>Fast Delivery Available</span></div>
                <div className="flex items-center gap-2"><ShieldCheck className="h-5 w-5 text-primary" /> <span>100% Genuine Product</span></div>
            </div>

          </div>
        </div>
      </div>
    </>
  );
}
