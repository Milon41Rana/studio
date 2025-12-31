'use client';

import Link from 'next/link';
import { Home, ShoppingCart, Package, UserCog, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Badge } from '@/components/ui/badge';
import { useUser, useAuth } from '@/firebase';
import { signOut } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { useToast } from '@/hooks/use-toast';

export function BottomNav() {
  const { cart } = useCart();
  const { user } = useUser();
  const auth = useAuth();
  const router = useRouter();
  const { toast } = useToast();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const isAdmin = user && user.email === 'ranamilon41@gmail.com';

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
      toast({
        title: 'Logged Out',
        description: 'You have been successfully logged out.',
      });
    } catch (error) {
      console.error('Logout Error:', error);
      toast({
        variant: 'destructive',
        title: 'Logout Failed',
        description: 'An error occurred while logging out.',
      });
    }
  };

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
      {isAdmin && (
        <>
          <Link href="/admin" className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors p-2">
            <UserCog className="h-6 w-6" />
            <span className="text-xs font-medium">Admin</span>
          </Link>
          <button onClick={handleLogout} className="flex flex-col items-center text-muted-foreground hover:text-primary transition-colors p-2">
            <LogOut className="h-6 w-6" />
            <span className="text-xs font-medium">Logout</span>
          </button>
        </>
      )}
    </nav>
  );
}
