export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  categoryId: string;
  imageUrl: string;
  imageHint: string;
}

export interface Category {
  id: string;
  name: string;
}
