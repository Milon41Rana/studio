import Link from 'next/link';
import { Package } from 'lucide-react';

export function Header() {
  return (
    <header className="hidden md:flex bg-card/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg mr-6">
          <Package className="h-6 w-6 text-primary" />
          <span className="font-headline">Super Shop</span>
        </Link>
        <nav className="flex items-center space-x-6 text-sm font-medium">
          <Link href="/" className="transition-colors hover:text-primary">Home</Link>
          <Link href="/cart" className="transition-colors hover:text-primary">Cart</Link>
          <Link href="/orders" className="transition-colors hover:text-primary">Orders</Link>
          <Link href="/admin" className="transition-colors hover:text-primary">Admin</Link>
        </nav>
      </div>
    </header>
  );
}
