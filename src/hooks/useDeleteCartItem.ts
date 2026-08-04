import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CartItem } from "@/entities/CartItem";
import cartItemService from "@/services/CartItemService";
import { useCartStore } from "@/Store/CartStore";

interface DeleteCartItemContext {
  cartId: string;
  productId: string;
}

const useDeleteCartItem = () => {
  const queryClient = useQueryClient();
  const decrementItemCount = useCartStore(s=>s.decrementItemCount)

  return useMutation<void, Error, DeleteCartItemContext,{ previousCartItems: CartItem[] }>({
    mutationFn: ({ cartId, productId }: DeleteCartItemContext) =>
      cartItemService.deleteCartItem(cartId, productId),

    onError: (_error, _variables, context) => {
      if (!context) return;
      // Rollback to previous state
      queryClient.setQueryData<CartItem[]>(
        ["cartItems"],
        context.previousCartItems
      );
    },

    onSuccess: () => {
      // Ensure cache stays in sync
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      decrementItemCount();
    },
  });
};

export default useDeleteCartItem;
