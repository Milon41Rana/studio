
'use client';

import Link from 'next/link';
import { Package } from 'lucide-react';
import { useUser } from '@/firebase';
import { SearchBar } from './SearchBar';
import { Button } from './ui/button';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/firebase';
import { useToast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';

export function Header() {
  const { user } = useUser();
  const auth = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const isAdmin = user && user.email === 'ranamilon41@gmail.com';
  const isLoggedIn = user && !user.isAnonymous;

  const handleLogout = async () => {
    if (!auth) return;
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
    <header className="bg-card/80 backdrop-blur-sm sticky top-0 z-40 w-full border-b">
      <div className="container flex h-16 items-center">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg mr-6">
          <Package className="h-6 w-6 text-primary" />
          <span className="font-headline hidden md:inline">Super Shop</span>
        </Link>
        <div className="flex-1">
           <SearchBar />
        </div>
        <nav className="hidden md:flex items-center space-x-2 text-sm font-medium ml-auto">
          <Button variant="ghost" asChild>
            <Link href="/">Home</Link>
          </Button>
           <Button variant="ghost" asChild>
            <Link href="/ui-generator">UI Gen</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/cart">Cart</Link>
          </Button>
          <Button variant="ghost" asChild>
            <Link href="/orders">Orders</Link>
          </Button>
          
          {isLoggedIn ? (
            <>
              {isAdmin && (
                <Button variant="ghost" asChild>
                  <Link href="/admin">Admin</Link>
                </Button>
              )}
              <span className="text-muted-foreground">|</span>
              <span className="font-semibold">{user.displayName || user.email}</span>
              <Button variant="outline" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
             <Button asChild>
                <Link href="/login">Login</Link>
            </Button>
          )}
        </nav>
      </div>
    </header>
  );
}
