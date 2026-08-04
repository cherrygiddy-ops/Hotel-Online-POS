import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CartItem } from "@/entities/CartItem";
import cartItemService from "@/services/CartItemService";
import type Cart from "@/entities/Cart";

interface CartItemContext {
  cartId: string;
  productId: string;
  quantity: number;
}

const useUpdateCartItems = () => {
  const queryClient = useQueryClient();

  return useMutation<CartItem, Error, CartItemContext, { previousCart?: Cart }>(
    {
      mutationFn: ({ cartId, productId, quantity }) =>
        cartItemService.updateCartItem(cartId, productId, quantity),

      onMutate: async ({ productId, quantity }) => {
        await queryClient.cancelQueries({ queryKey: ["cartItems"] });

        const previousCart = queryClient.getQueryData<Cart>(["cartItems"]);

        queryClient.setQueryData<Cart>(["cartItems"], (oldCart) => {
          if (!oldCart) return oldCart;
          return {
            ...oldCart,
            items: oldCart.items.map((item) =>
              item.product.id === productId ? { ...item, quantity } : item
            ),
          };
        });

        return { previousCart };
      },

      onError: (_error, _variables, context) => {
        if (context?.previousCart) {
          queryClient.setQueryData(["cartItems"], context.previousCart);
        }
      },

      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      },
    }
  );
};

export default useUpdateCartItems;
