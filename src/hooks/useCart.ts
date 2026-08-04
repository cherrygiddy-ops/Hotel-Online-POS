import { useRef, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import useCreateCart from "@/hooks/useCreateCart";
import CartServices from "@/services/CartServices";
import { useCartStore } from "@/Store/CartStore";

const useCart = () => {
  const cartId = useCartStore((s) => s.cartId);
  const setCartId = useCartStore((s) => s.setCartId);
  const { mutate: createCart, data: createdCart } = useCreateCart();

  const hasTriggered = useRef(false); // ✅ prevents double creation

  useEffect(() => {
    if (!cartId && !hasTriggered.current) {
      createCart();
      hasTriggered.current = true;
    }
  }, [cartId, createCart]);

  useEffect(() => {
    if (createdCart?.id) {
      setCartId(createdCart.id);
    }
  }, [createdCart, setCartId]);

  return useQuery({
    queryKey: ["cartItems"],
    queryFn: () => CartServices.get(cartId),
    enabled: !!cartId,
    staleTime: 2 * 60 * 1000,
    refetchOnMount: true,
  });
};

export default useCart;
