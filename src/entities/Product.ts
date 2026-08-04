export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: number;
  createdAt?: string;
  updatedAt?: string;
}