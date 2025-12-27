import { categories } from '@/lib/dummyData';
import { Button } from '@/components/ui/button';
import Link from 'next/link';

export function CategoryList() {
  return (
    <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-headline">Categories</h2>
        <div className="flex space-x-3 overflow-x-auto pb-4 -mx-4 px-4 scrollbar-hide">
            {categories.map((category) => (
                <Button key={category.id} variant="secondary" className="shrink-0 shadow-sm" asChild>
                    <Link href={`/category/${category.id}`}>{category.name}</Link>
                </Button>
            ))}
        </div>
    </div>
  );
}
