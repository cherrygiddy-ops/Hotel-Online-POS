// CheckoutRequestDto.ts
export interface CheckoutRequestDto {
  cartId: string;          // required
  paymentMethod?: string;  // optional
  phoneNumber?: string;     // required
}
