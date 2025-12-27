import Image from 'next/image';
import { Card, CardContent, CardFooter, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import type { Product } from '@/lib/dummyData';
import { Plus } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  return (
    <Card className="flex flex-col overflow-hidden h-full shadow-md hover:shadow-xl transition-shadow duration-300">
      <div className="relative aspect-square w-full">
        <Image
          src={product.imageUrl}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 50vw, 33vw"
          className="object-cover"
          data-ai-hint={product.imageHint}
        />
      </div>
      <CardContent className="p-4 flex-grow flex flex-col">
        <CardTitle className="text-base font-semibold mb-2 leading-tight h-10">{product.name}</CardTitle>
        <p className="text-lg font-bold text-foreground mt-auto">৳{product.price}</p>
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button className="w-full bg-accent text-accent-foreground hover:bg-accent/90">
          <Plus className="mr-2 h-4 w-4" /> Add to Cart
        </Button>
      </CardFooter>
    </Card>
  );
}
