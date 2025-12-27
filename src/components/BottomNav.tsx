import Link from 'next/link';
import { Home, ShoppingCart, Package, UserCog } from 'lucide-react';

export function BottomNav() {
  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-card/80 backdrop-blur-sm border-t z-50 flex items-center justify-around">
      <Link href="/" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors p-2">
        <Home className="h-6 w-6" />
        <span className="text-xs font-medium">Home</span>
      </Link>
      <Link href="/cart" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors p-2">
        <ShoppingCart className="h-6 w-6" />
        <span className="text-xs font-medium">Cart</span>
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
