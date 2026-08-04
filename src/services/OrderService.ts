import type OrdersResponseDto from "@/entities/OrdersResponseDto";
import APICLIENT from "./ApiClient";
export default new APICLIENT<OrdersResponseDto, OrdersResponseDto>("/auth/orders");
