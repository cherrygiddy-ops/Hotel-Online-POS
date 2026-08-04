import type Cart from "@/entities/Cart";
import APICLIENT from "./ApiClient";

export default new APICLIENT<Cart,Cart>("/auth/carts");
