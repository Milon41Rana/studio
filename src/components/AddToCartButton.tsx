'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import type { Product } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
    product: Product;
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addToCart } = useCart();
    const { toast } = useToast();
    const isInactive = !product.isActive;

    const handleAddToCart = () => {
        if (isInactive) return;
        addToCart(product);
        toast({
            title: 'Added to cart',
            description: `${product.title} has been added to your cart.`,
        });
    };
    
    return (
        <Button size="lg" onClick={handleAddToCart} disabled={isInactive}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isInactive ? 'Currently Unavailable' : 'Add to Cart'}
        </Button>
    )
}
