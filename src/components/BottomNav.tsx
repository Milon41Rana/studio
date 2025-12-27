"use client";

import Link from 'next/link';
import { Home, ShoppingCart, Package, UserCog } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';

export function BottomNav() {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-sm border-t z-50 flex items-center justify-around">
      <Link href="/" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors p-2">
        <Home className="h-6 w-6" />
        <span className="text-xs font-medium">Home</span>
      </Link>
      <Link href="/cart" className="relative flex flex-col items-center text-muted-foreground hover:text-primary transition-colors p-2">
        <ShoppingCart className="h-6 w-6" />
        <span className="text-xs font-medium">Cart</span>
        {totalItems > 0 && (
          <Badge variant="destructive" className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 px-2 py-0.5 text-xs">
            {totalItems}
          </Badge>
        )}
      </Link>
      <Link href="/orders" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors p-2">
        <Package className="h-6 w-6" />
        <span className="text-xs font-medium">Orders</span>
      </Link>
      <Link href="/admin" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors p-2">
        <UserCog className="h-6 w-6" />
        <span className="text-xs font-medium">Admin</span>
      </Link>
    </nav>
  );
}
