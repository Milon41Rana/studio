import { FlashSaleBanner } from '@/components/FlashSaleBanner';
import { CategoryList } from '@/components/CategoryList';
import { ProductCard } from '@/components/ProductCard';
import { products } from '@/lib/dummyData';

export default function Home() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8">
      <FlashSaleBanner />
      <CategoryList />

      <div className="mb-8">
        <h2 className="text-2xl font-bold mb-4 font-headline">Featured Products</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
