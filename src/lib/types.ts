export interface Product {
  id: string;
  title: string;
  description: string;
  regularPrice: number;
  salePrice?: number;
  stockQuantity: number;
  variants?: string;
  categoryId: string;
  imageUrl: string;
  imageHint: string;
  isActive: boolean;
}

export interface Category {
  id: string;
  name: string;
}
