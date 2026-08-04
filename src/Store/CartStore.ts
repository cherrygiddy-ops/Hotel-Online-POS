// stores/cartStore.ts
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartState {
  cartId: string;
  itemCount: number;
  showCartToast: boolean;
  setCartId: (id: string) => void;
  setItemCount: (count: number) => void;
  incrementItemCount: () => void;
  decrementItemCount: () => void;
  decrementItemCountByQuantity: (quantity: number) => void;
  clearItems: () => void;   // ✅ new
  clearCart: () => void;
  triggerCartToast: () => void;
  resetCartToast: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      cartId: "",
      itemCount: 0,
      showCartToast: false,
      setCartId: (id) => set({ cartId: id }),
      setItemCount: (count) => set({ itemCount: count }),
      incrementItemCount: () =>
        set((state) => ({ itemCount: state.itemCount + 1 })),
      decrementItemCount: () =>
        set((state) => ({ itemCount: state.itemCount - 1 })),
      decrementItemCountByQuantity: (quantity) =>
        set((state) => ({ itemCount: state.itemCount - quantity })),
      clearItems: () => set({ itemCount: 0 }),   // ✅ only clears items
      clearCart: () => set({ cartId: "", itemCount: 0 }),
      triggerCartToast: () => set({ showCartToast: true }),
      resetCartToast: () => set({ showCartToast: false }),
    }),
    { name: "fluxmart-cart" }
  )
);
