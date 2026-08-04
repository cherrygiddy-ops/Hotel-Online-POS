import { Category } from "@/entities/Category";
import APICLIENT from "./ApiClient";

export default new APICLIENT<Category,Category>("/categories");
