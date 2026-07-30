// src/services/ProductService.ts
import { axiosInstance } from "./ApiClient";
import { Product } from "@/entities/Product";

export default class ProductService {
  static async getAll(): Promise<Product[]> {
    const res = await axiosInstance.get<Product[]>("/auth/products");
    return res.data;
  }

  static async create(payload: Omit<Product, "id">): Promise<Product> {
    const res = await axiosInstance.post<Product>("/auth/products", payload);
    return res.data;
  }

  static async update(id: number, payload: Partial<Product>): Promise<Product> {
    const res = await axiosInstance.put<Product>(`/auth/products/${id}`, payload);
    return res.data;
  }

  static async delete(id: number): Promise<void> {
    await axiosInstance.delete(`/auth/products/${id}`);
  }
}
