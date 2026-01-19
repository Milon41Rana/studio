
'use client';

import { Button } from '@/components/ui/button';
import { useCart } from '@/context/CartContext';
import { useToast } from '@/hooks/use-toast';
import { Product } from '@/lib/types';
import { ShoppingCart } from 'lucide-react';

interface AddToCartButtonProps {
    product: Omit<Product, 'salePrice' | 'variants'> & { salePrice?: number | null, variants?: string | null, price: number };
}

export function AddToCartButton({ product }: AddToCartButtonProps) {
    const { addToCart } = useCart();
    const { toast } = useToast();
    
    const isOutOfStock = product.stockQuantity <= 0;
    const isButtonDisabled = !product.isActive || isOutOfStock;

    const handleAddToCart = () => {
        if (isButtonDisabled) return;
        addToCart(product);
        toast({
            title: 'Added to cart',
            description: `${product.title} has been added to your cart.`,
        });
    };
    
    return (
        <Button size="lg" onClick={handleAddToCart} disabled={isButtonDisabled}>
            <ShoppingCart className="mr-2 h-5 w-5" />
            {isOutOfStock ? 'Out of Stock' : (product.isActive ? 'Add to Cart' : 'Currently Unavailable')}
        </Button>
    )
}
