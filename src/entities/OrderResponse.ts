import { Product } from "./Product";

export interface OrderResponse {
  product:Product;
  quantity:number;
  totalPrice:number;
}
