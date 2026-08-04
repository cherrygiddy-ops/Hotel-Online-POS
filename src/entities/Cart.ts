import type { CartItem } from "./CartItem";

export default interface Cart {
  id: string;
  items: CartItem[];
  totalPrice:number
}