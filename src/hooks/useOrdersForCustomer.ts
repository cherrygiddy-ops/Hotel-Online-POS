// hooks/useOrdersForCustomer.ts
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import orderService from "@/services/OrderService";
import type OrdersResponseDto from "@/entities/OrdersResponseDto";
import { OrderSummaryDto } from "@/entities/OrderSummaryDto";

const useOrdersForCustomer = (search?: string) => {
  const queryClient = useQueryClient();

  // Fetch all orders
  const ordersQuery = useQuery<OrdersResponseDto[]>({
    queryKey: ["orders"],
    queryFn: () => orderService.getAllOrders(),
  });

  // ✅ Fetch single order by ID when search is numeric
  const singleOrderQuery = useQuery<OrdersResponseDto>({
    queryKey: ["order", search],
    queryFn: () => orderService.searchOrderById(Number(search)),
    enabled: !!search && !isNaN(Number(search)), // only run if search is a number
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
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["orderSummary"] });
    },
  });

  return {
    ...ordersQuery,
    summary: summaryQuery.data,
    searchedOrder: singleOrderQuery.data, // ✅ expose searched order
    markPaidMutation,
  };
};

export default useOrdersForCustomer;
