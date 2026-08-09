export interface Product {
  id: string;
  name: string;
  price: number;
  categoryId: string;   // 👈 use string here
  createdAt?: string;
  updatedAt?: string;
}
