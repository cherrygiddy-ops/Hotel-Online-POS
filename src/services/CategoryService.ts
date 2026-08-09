import { Category } from "@/entities/Category";
import APICLIENT from "./ApiClient";
import { CategoryRequestDto } from "@/entities/CategoryRequestDto";
import { CategoryResponseDto } from "@/entities/CategoryResponseDto";

export default new APICLIENT<string, CategoryResponseDto>("/auth/categories");