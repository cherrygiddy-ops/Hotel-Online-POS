
import type { CartItem } from "@/entities/CartItem";
import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import CartItemService from "@/services/CartItemService";
import { Product } from "@/entities/Product";
import { useCartStore } from "@/Store/CartStore";

interface addToCartContext {
  cartId: string;
  product: Product;
}

const useAddToCart = () => {
  const toast = useToast();
  const queryClient = useQueryClient();
    const incrementCount = useCartStore((s) => s.incrementItemCount);
    const triggerCartToast = useCartStore((s) => s.triggerCartToast);

  return useMutation<CartItem, Error, addToCartContext>({
    mutationFn: ({ cartId, product }) =>
    CartItemService.addToCart(cartId, product.id),

    onSuccess: (_, { product }) => {
      incrementCount();
      queryClient.invalidateQueries({ queryKey: ["cartItems"] });
      triggerCartToast()
      toast({
        title: "Added to cart",
        description: `${product.name} has been added.`,
        status: "success",
        duration: 3000,
        isClosable: true,
        position: "top-right",
      });
    },

    onError: (error: any) => {
      const message =
        error?.response?.data?.message ||
        error?.message ||
        "Failed to add item to cart";

      toast({
        title: "Error adding to cart",
        description: message,
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
      });
    },
  });
};

export default useAddToCart;



