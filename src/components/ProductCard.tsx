
      
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

  const isOutOfStock = product.stockQuantity <= 0;
  const isButtonDisabled = !product.isActive || isOutOfStock;

  const handleAddToCart = () => {
    if (isButtonDisabled) return;
    addToCart({ ...product, price: product.salePrice ?? product.regularPrice });
    toast({
      title: 'Added to cart',
      description: `${product.title} has been added to your cart.`,
    });
  };

  const imageUrl = product.imageUrl || FALLBACK_IMAGE_URL;

  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-md hover:shadow-xl transition-shadow duration-300 group">
      <Link href={`/product/${product.id}`} className="flex flex-col h-full">
        <div className="relative aspect-square w-full overflow-hidden">
          {isOutOfStock && (
             <Badge variant="destructive" className="absolute top-2 left-2 z-10">Stock Out</Badge>
          )}
          {!product.isActive && (
            <Badge variant="secondary" className="absolute top-2 right-2 z-10">Archived</Badge>
          )}
          <Image
            src={imageUrl}
            alt={product.title}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            className={`object-cover group-hover:scale-105 transition-transform duration-300 ${!product.isActive || isOutOfStock ? 'grayscale' : ''}`}
            onError={(e) => {
              e.currentTarget.srcset = FALLBACK_IMAGE_URL;
              e.currentTarget.src = FALLBACK_IMAGE_URL;
            }}
          />
        </div>
        <CardContent className="p-4 flex-grow flex flex-col">
          <CardTitle className="text-base font-semibold mb-2 leading-tight h-10">{product.title}</CardTitle>
          <div className="flex items-baseline gap-2 mt-auto">
            {product.salePrice && product.salePrice < product.regularPrice ? (
              <>
                <p className="text-lg font-bold text-primary">৳{product.salePrice}</p>
                <p className="text-sm text-muted-foreground line-through">৳{product.regularPrice}</p>
              </>
            ) : (
              <p className="text-lg font-bold text-foreground">৳{product.regularPrice}</p>
            )}
          </div>
        </CardContent>
      </Link>
      <CardFooter className="p-4 pt-0">
        <Button 
          className="w-full bg-accent text-accent-foreground hover:bg-accent/90"
          onClick={handleAddToCart}
          disabled={isButtonDisabled}
        >
          <Plus className="mr-2 h-4 w-4" /> 
          {isOutOfStock ? 'Out of Stock' : (product.isActive ? 'Add to Cart' : 'Unavailable')}
        </Button>
      </CardFooter>
    </Card>
  );
}

    