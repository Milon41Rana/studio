
import { PlaceHolderImages } from './placeholder-images';
import type { Product, Category } from './types';


const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    // Fallback if image is not found in placeholder data
    console.warn(`Placeholder image with id '${id}' not found. Using a default fallback.`);
    return { imageUrl: `https://picsum.photos/seed/${id}/400/400`, imageHint: 'placeholder' };
  }
  return { imageUrl: image.imageUrl, imageHint: image.imageHint };
};

export const categories: Category[] = [
  { id: 'grocery', name: 'Grocery' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home' },
  { id: 'beauty', 'name': 'Beauty' },
  { id: 'toys', name: 'Toys' },
];

export const products: (Omit<Product, 'description' | 'title'> & {name: string})[] = [
  { id: '1', name: 'Basmati Rice 5kg', price: 750, categoryId: 'grocery', ...findImage('product-rice'), isActive: true },
  { id: '2', name: 'Soybean Oil 5L', price: 820, categoryId: 'grocery', ...findImage('product-oil'), isActive: true },
  { id: '3', name: 'Wireless Earbuds Pro', price: 3500, categoryId: 'electronics', ...findImage('product-earbuds'), isActive: true },
  { id: '4', name: 'Classic Cotton T-Shirt', price: 550, categoryId: 'fashion', ...findImage('product-shirt'), isActive: true },
  { id: '5', name: 'Slim-Fit Denim Jeans', price: 1800, categoryId: 'fashion', ...findImage('product-jeans'), isActive: true },
  { id: '6', name: 'Red Lentils (Masoor Dal) 1kg', price: 140, categoryId: 'grocery', ...findImage('product-lentils'), isActive: true },
  { id: '7', name: 'Mechanical Gaming Keyboard', price: 4200, categoryId: 'electronics', ...findImage('product-keyboard'), isActive: true },
  { id: '8', name: 'Ergonomic Wireless Mouse', price: 1200, categoryId: 'electronics', ...findImage('product-mouse'), isActive: true },
  { id: '9', name: 'Running Sport Shoes', price: 2500, categoryId: 'fashion', ...findImage('product-shoes'), isActive: true },
  { id: '10', name: 'Fitness Tracker Smart Watch', price: 4800, categoryId: 'electronics', ...findImage('product-watch'), isActive: true },
];
