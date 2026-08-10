import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import CheckoutService from "@/services/CheckoutService";
import { CheckoutRequestDto } from "@/entities/CheckoutRequestDto";
import { CheckoutResponseDto } from "@/entities/CheckoutResponseDto";

const useCheckout = () => {
  const toast = useToast();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation<CheckoutResponseDto, Error, CheckoutRequestDto>({
    mutationFn: async (payload: CheckoutRequestDto) => {
      // ✅ delegate to CheckoutService
      return await CheckoutService.checkout(payload);
    },
    onSuccess: async (data) => {
      toast({
        title: "Order Confirmed 🎉",
        description: `Order #${data.orderId} placed successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      // optional: navigate("/cashier");
    },
    onError: (error: any) => {
      toast({
        title: "Checkout Failed ❌",
        description: error?.response?.data?.message || "Something went wrong.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    },
  });
};

export default useCheckout;
