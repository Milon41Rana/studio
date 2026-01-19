'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

export function SearchBar() {
  const router = useRouter();
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
    
    // Always redirect to the homepage for searching
    const search = current.toString();
    const query = search ? `?${search}` : '';

    // Only push if the query is different from the current URL's query,
    // to avoid unnecessary re-renders on page load.
    if (`/${query}` !== `${window.location.pathname}${window.location.search}`) {
       router.push(`/${query}`);
    }

  }, [debouncedSearchTerm, router, searchParams]);

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
