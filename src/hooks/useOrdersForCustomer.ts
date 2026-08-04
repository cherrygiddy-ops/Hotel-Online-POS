// hooks/useOrdersForCustomer.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import orderService from "@/services/OrderService";
import type OrdersResponseDto from "@/entities/OrdersResponseDto";
import { OrderSummaryDto } from "@/entities/OrderSummaryDto";

const useOrdersForCustomer = () => {
  const queryClient = useQueryClient();

  // Fetch all orders
  const ordersQuery = useQuery<OrdersResponseDto[]>({
    queryKey: ["orders"],
    queryFn: () => orderService.getAllOrders(),
   
  });

  // Fetch summary
  const summaryQuery = useQuery<OrderSummaryDto>({
    queryKey: ["orderSummary"],
    queryFn: () => orderService.getOrderSummary(),

  });

  // Mutation: mark order as paid
  const markPaidMutation = useMutation({
    mutationFn: (orderId: number) => orderService.markOrderAsPaid(orderId),
    onSuccess: () => {
      // Refresh both orders and summary after update
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orderSummary"] });
    },
  });

  return {
    ...ordersQuery,
    summary: summaryQuery.data,
    markPaidMutation,
  };
};

export default useOrdersForCustomer;
