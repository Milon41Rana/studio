'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/types';
import { Plus } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Badge } from '@/components/ui/badge';

interface ProductCardProps {
  product: Product;
}

const FALLBACK_IMAGE_URL = 'https://picsum.photos/seed/placeholder/400/400';

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { toast } = useToast();

  const handleAddToCart = () => {
    if (!product.isActive) return;
    addToCart(product);
    toast({
      title: 'Added to cart',
      description: `${product.title} has been added to your cart.`,
    });
  };

  const imageUrl = product.imageUrl || FALLBACK_IMAGE_URL;
  const isInactive = !product.isActive;

  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-md hover:shadow-xl transition-shadow duration-300 group">
      <Link href={`/product/${product.id}`} className="flex flex-col h-full">
        <div className="relative aspect-square w-full overflow-hidden">
          {isInactive && (
             <Badge variant="destructive" className="absolute top-2 left-2 z-10">Stock Out</Badge>
          )}
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${isInactive ? 'grayscale' : ''}`}
            onError={(e) => {
              e.currentTarget.srcset = FALLBACK_IMAGE_URL;
              e.currentTarget.src = FALLBACK_IMAGE_URL;
            }}
          />
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <CardTitle className="text-base font-semibold mb-2 leading-tight h-10">{product.title}</CardTitle>
          <p className="text-lg font-bold text-foreground mt-auto">৳{product.price}</p>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handleAddToCart}
          disabled={isInactive}
        >
          <Plus className="mr-2 h-4 w-4" /> 
          {isInactive ? 'Unavailable' : 'Add to Cart'}
        </Button>
      </CardFooter>
    </Card>
  );
}
