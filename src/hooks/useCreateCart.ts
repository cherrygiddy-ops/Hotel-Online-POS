import type Cart from "@/entities/Cart";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import cartServices from "@/services/CartServices";
import { useCartStore } from "@/Store/CartStore";

const useCreateCart = () => {
  const queryClient = useQueryClient();
  const setCartId = useCartStore((s) => s.setCartId);
  return useMutation<Cart, Error>({

    mutationFn: () => cartServices.createCart(),
    onSuccess: (cart) => {
      setCartId(cart.id); // store cartId globally
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
    },
  });
};

export default useCreateCart;
