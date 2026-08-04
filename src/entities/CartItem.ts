import { Product } from "./Product";

export interface CartItem {
  product:Product;
  quantity: number;
  totalprice: number;
  
}
