export interface Product {
  id: number;
  name: string;
  price: number;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
}