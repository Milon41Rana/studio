import { PlaceHolderImages } from './placeholder-images';

export interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
  imageUrl: string;
  imageHint: string;
}

export interface Category {
  id: string;
  name: string;
}

const findImage = (id: string) => {
  const image = PlaceHolderImages.find(img => img.id === id);
  if (!image) {
    // Fallback if image is not found in placeholder data
    return { imageUrl: `https://picsum.photos/seed/${id}/400/400`, imageHint: 'placeholder' };
  }
  return { imageUrl: image.imageUrl, imageHint: image.imageHint };
};

export const categories: Category[] = [
  { id: 'grocery', name: 'Grocery' },
  { id: 'electronics', name: 'Electronics' },
  { id: 'fashion', name: 'Fashion' },
  { id: 'home', name: 'Home' },
  { id: 'beauty', name: 'Beauty' },
  { id: 'toys', name: 'Toys' },
];

export const products: Product[] = [
  { id: '1', name: 'Basmati Rice 5kg', price: 750, category: 'grocery', ...findImage('product-rice') },
  { id: '2', name: 'Soybean Oil 5L', price: 820, category: 'grocery', ...findImage('product-oil') },
  { id: '3', name: 'Wireless Earbuds Pro', price: 3500, category: 'electronics', ...findImage('product-earbuds') },
  { id: '4', name: 'Classic Cotton T-Shirt', price: 550, category: 'fashion', ...findImage('product-shirt') },
  { id: '5', name: 'Slim-Fit Denim Jeans', price: 1800, category: 'fashion', ...findImage('product-jeans') },
  { id: '6', name: 'Red Lentils (Masoor Dal) 1kg', price: 140, category: 'grocery', ...findImage('product-lentils') },
  { id: '7', name: 'Mechanical Gaming Keyboard', price: 4200, category: 'electronics', ...findImage('product-keyboard') },
  { id: '8', name: 'Ergonomic Wireless Mouse', price: 1200, category: 'electronics', ...findImage('product-mouse') },
  { id: '9', name: 'Running Sport Shoes', price: 2500, category: 'fashion', ...findImage('product-shoes') },
  { id: '10', name: 'Fitness Tracker Smart Watch', price: 4800, category: 'electronics', ...findImage('product-watch') },
];
