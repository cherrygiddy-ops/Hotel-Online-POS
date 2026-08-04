import { axiosInstance } from "@/services/ApiClient";
import { useToast } from "@chakra-ui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

type CheckoutPayload = {
  cartId?: string;
  paymentMethod: "PayBill" | "Stripe" | "STKPush";
  phoneNumber?: string; // ✅ now allowed in backend DTO
};

const useCheckout = () => {
  const toast = useToast();
  const navigate = useNavigate();
    const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CheckoutPayload) => {
      // ✅ send phoneNumber along with cartId + paymentMethod
      const response = await axiosInstance.post("/auth/checkout", payload);
      return response.data;
    },
    onSuccess: async (data, variables) => {
      toast({
        title: "Order Confirmed 🎉",
        description: `Order #${data.orderId} placed successfully.`,
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      queryClient.invalidateQueries({ queryKey: ["orders"] });

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
