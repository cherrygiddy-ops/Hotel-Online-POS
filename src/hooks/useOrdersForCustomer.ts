// hooks/useOrdersForCustomer.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import orderService from "@/services/OrderService";
import type OrdersResponseDto from "@/entities/OrdersResponseDto";
import { OrderSummaryDto } from "@/entities/OrderSummaryDto";

const useOrdersForCustomer = (search?: string) => {
  const queryClient = useQueryClient();

  // ============================================
  // Fetch all orders
  // ============================================
  const ordersQuery = useQuery<OrdersResponseDto[]>({
    queryKey: ["orders"],
    queryFn: () => orderService.getAllOrders(),
  });

  // ============================================
  // Fetch single order by ID
  // ============================================
  const orderId = search && !isNaN(Number(search))
    ? Number(search)
    : undefined;

  const singleOrderQuery = useQuery<OrdersResponseDto>({
    queryKey: ["order", orderId],
    queryFn: () => orderService.searchOrderById(orderId!),
    enabled: orderId !== undefined,
  });

  // ============================================
  // Fetch summary
  // ============================================
  const summaryQuery = useQuery<OrderSummaryDto>({
    queryKey: ["orderSummary"],
    queryFn: () => orderService.getOrderSummary(),
  });

  // ============================================
  // MARK ORDER AS PAID
  // ============================================
  const markPaidMutation = useMutation({
    mutationFn: (orderId: number) =>
      orderService.markOrderAsPaid(orderId),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["orderSummary"],
      });
    },
  });

  // ============================================
  // ADD ITEMS - OPTIMISTIC UPDATE
  // ============================================
  const addItemsMutation = useMutation({
    mutationFn: (params: {
      orderId: number;
      items: {
        productId: string;
        quantity: number;
      }[];
    }) =>
      orderService.updateOrderItems(
        params.orderId,
        params.items
      ),

    onMutate: async (params) => {
      // Cancel queries so they don't overwrite
      // our optimistic update
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: ["orders"],
        }),

        queryClient.cancelQueries({
          queryKey: ["order", params.orderId],
        }),
      ]);

      // Save previous data for rollback
      const previousOrders =
        queryClient.getQueryData<OrdersResponseDto[]>([
          "orders",
        ]);

      const previousOrder =
        queryClient.getQueryData<OrdersResponseDto>([
          "order",
          params.orderId,
        ]);

      // ==========================================
      // OPTIMISTICALLY UPDATE ALL ORDERS
      // ==========================================
      queryClient.setQueryData<OrdersResponseDto[]>(
        ["orders"],
        (old) => {
          if (!old) return old;

          return old.map((order) => {
            if (order.orderId !== params.orderId) {
              return order;
            }

            const updatedItems = [...order.orderItems];

            params.items.forEach((newItem) => {
              const existingItem = updatedItems.find(
                (item) =>
                  item.product.id === newItem.productId
              );

              if (existingItem) {
                // Increase existing quantity
                existingItem.quantity += newItem.quantity;

                existingItem.totalPrice =
                  existingItem.product.price *
                  existingItem.quantity;
              } else {
                // Add new item optimistically
                updatedItems.push({
                  product: {
                    id: newItem.productId,
                    name: "Pending...",
                    price: 0,
                    categoryId: "",
                  },
                  quantity: newItem.quantity,
                  totalPrice: 0,
                });
              }
            });

            return {
              ...order,
              orderItems: updatedItems,

              // Optimistically update total
              totalPrice: updatedItems.reduce(
                (total, item) =>
                  total +
                  item.product.price * item.quantity,
                0
              ),
            };
          });
        }
      );

      // ==========================================
      // OPTIMISTICALLY UPDATE SEARCHED ORDER
      // ==========================================
      queryClient.setQueryData<OrdersResponseDto>(
        ["order", params.orderId],
        (old) => {
          if (!old) return old;

          const updatedItems = [...old.orderItems];

          params.items.forEach((newItem) => {
            const existingItem = updatedItems.find(
              (item) =>
                item.product.id === newItem.productId
            );

            if (existingItem) {
              existingItem.quantity += newItem.quantity;

              existingItem.totalPrice =
                existingItem.product.price *
                existingItem.quantity;
            } else {
              updatedItems.push({
                product: {
                  id: newItem.productId,
                  name: "Pending...",
                  price: 0,
                  categoryId: "",
                },
                quantity: newItem.quantity,
                totalPrice: 0,
              });
            }
          });

          return {
            ...old,
            orderItems: updatedItems,

            totalPrice: updatedItems.reduce(
              (total, item) =>
                total +
                item.product.price * item.quantity,
              0
            ),
          };
        }
      );

      return {
        previousOrders,
        previousOrder,
      };
    },

    // ==========================================
    // ROLLBACK IF REQUEST FAILS
    // ==========================================
    onError: (_error, params, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(
          ["orders"],
          context.previousOrders
        );
      }

      if (context?.previousOrder) {
        queryClient.setQueryData(
          ["order", params.orderId],
          context.previousOrder
        );
      }
    },

    // ==========================================
    // REFRESH FROM SERVER
    // ==========================================
    onSettled: (_data, _error, params) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["order", params.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orderSummary"],
      });
    },
  });

  // ============================================
  // REMOVE ITEM - OPTIMISTIC UPDATE
  // ============================================
  const removeItemMutation = useMutation({
    mutationFn: (params: {
      orderId: number;
      productId: string;
    }) =>
      orderService.deleteOrderItem(
        params.orderId,
        params.productId
      ),

    onMutate: async (params) => {
      // Cancel queries
      await Promise.all([
        queryClient.cancelQueries({
          queryKey: ["orders"],
        }),

        queryClient.cancelQueries({
          queryKey: ["order", params.orderId],
        }),
      ]);

      // Save previous state
      const previousOrders =
        queryClient.getQueryData<OrdersResponseDto[]>([
          "orders",
        ]);

      const previousOrder =
        queryClient.getQueryData<OrdersResponseDto>([
          "order",
          params.orderId,
        ]);

      // ==========================================
      // OPTIMISTICALLY REMOVE FROM ALL ORDERS
      // ==========================================
      queryClient.setQueryData<OrdersResponseDto[]>(
        ["orders"],
        (old) => {
          if (!old) return old;

          return old.map((order) => {
            if (order.orderId !== params.orderId) {
              return order;
            }

            const updatedItems =
              order.orderItems.filter(
                (item) =>
                  item.product.id !==
                  params.productId
              );

            return {
              ...order,
              orderItems: updatedItems,

              // Recalculate total
              totalPrice: updatedItems.reduce(
                (total, item) =>
                  total +
                  item.product.price * item.quantity,
                0
              ),
            };
          });
        }
      );

      // ==========================================
      // OPTIMISTICALLY REMOVE FROM SEARCHED ORDER
      // ==========================================
      queryClient.setQueryData<OrdersResponseDto>(
        ["order", params.orderId],
        (old) => {
          if (!old) return old;

          const updatedItems =
            old.orderItems.filter(
              (item) =>
                item.product.id !==
                params.productId
            );

          return {
            ...old,
            orderItems: updatedItems,

            // Recalculate total
            totalPrice: updatedItems.reduce(
              (total, item) =>
                total +
                item.product.price * item.quantity,
              0
            ),
          };
        }
      );

      return {
        previousOrders,
        previousOrder,
      };
    },

    // ==========================================
    // ROLLBACK IF DELETE FAILS
    // ==========================================
    onError: (_error, params, context) => {
      if (context?.previousOrders) {
        queryClient.setQueryData(
          ["orders"],
          context.previousOrders
        );
      }

      if (context?.previousOrder) {
        queryClient.setQueryData(
          ["order", params.orderId],
          context.previousOrder
        );
      }
    },

    // ==========================================
    // REFRESH FROM SERVER
    // ==========================================
    onSettled: (_data, _error, params) => {
      queryClient.invalidateQueries({
        queryKey: ["orders"],
      });

      queryClient.invalidateQueries({
        queryKey: ["order", params.orderId],
      });

      queryClient.invalidateQueries({
        queryKey: ["orderSummary"],
      });
    },
  });

  // ============================================
  // RETURN
  // ============================================
  return {
    ...ordersQuery,

    summary: summaryQuery.data,

    searchedOrder: singleOrderQuery.data,

    markPaidMutation,

    addItemsMutation,

    removeItemMutation,
  };
};

export default useOrdersForCustomer;