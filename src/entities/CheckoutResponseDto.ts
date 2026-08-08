// CheckoutResponseDto.ts
export interface CheckoutResponseDto {
  orderId: number;
  stripeCheckoutUrl?: string; // optional, depending on payment method
  phoneNumber?: string;
}
