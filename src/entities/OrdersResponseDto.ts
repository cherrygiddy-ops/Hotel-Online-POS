import type { OrderResponse } from "./OrderResponse";

export default interface OrdersResponseDto {
  orderId: number;
  paymentStatus: string;
  orderDate: Date;
  orderItems: OrderResponse[];
  totalPrice: number;
  deliveryStatus: string;
  cartId:string
}