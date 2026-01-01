'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export function SearchBar() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    const current = new URLSearchParams(Array.from(searchParams.entries()));

    if (!debouncedSearchTerm) {
      current.delete('q');
    } else {
      current.set('q', debouncedSearchTerm);
    }
    
    // We only want search on the homepage
    if (pathname === '/') {
        const search = current.toString();
        const query = search ? `?${search}` : '';
        router.push(`${pathname}${query}`);
    }

  }, [debouncedSearchTerm, pathname, router, searchParams]);

  // If not on the homepage, don't render the search bar
  if (pathname !== '/') {
    return null;
  }

  return (
    <div className="relative w-full max-w-md">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search for products..."
        className="w-full pl-10"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
    </div>
  );
}
