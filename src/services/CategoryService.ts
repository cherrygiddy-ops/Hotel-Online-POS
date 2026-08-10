import APICLIENT from "./ApiClient";

import { CategoryResponseDto } from "@/entities/CategoryResponseDto";

export default new APICLIENT<string, CategoryResponseDto>("/auth/categories");