export interface OrderPayload {
  items: { productId: number; quantity: number }[];
  totalPrice: number;
}
