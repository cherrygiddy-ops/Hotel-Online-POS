// services/CheckoutService.ts
import APICLIENT from "@/services/ApiClient";
import { CheckoutRequestDto } from "@/entities/CheckoutRequestDto";
import { CheckoutResponseDto } from "@/entities/CheckoutResponseDto";

const CheckoutService = new APICLIENT<CheckoutRequestDto, CheckoutResponseDto>("/auth/checkout");

export default CheckoutService;
