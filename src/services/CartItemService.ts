import type { CartItem } from "@/entities/CartItem";
import APICLIENT from "./ApiClient";

export default new APICLIENT<CartItem,CartItem>("/auth/carts");
