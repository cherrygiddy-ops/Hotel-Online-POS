import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  Divider,
  Badge,
  HStack,
  useColorModeValue, // 👈 import this
} from "@chakra-ui/react";
import useOrdersForCustomer from "@/hooks/useOrdersForCustomer";
import type OrdersResponseDto from "@/entities/OrdersResponseDto";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCartStore } from "@/Store/CartStore";

const OrdersPage = () => {
  const { data: orders, isLoading } = useOrdersForCustomer();
  const clearCart = useCartStore((state) => state.clearCart);
  const cartId = useCartStore((state) => state.cartId);

  useEffect(() => {
    if (orders && cartId) {
      const hasPaidOrder = orders.some(
        (order) => order.cartId === cartId && order.paymentStatus === "PAID"
      );
      if (hasPaidOrder) {
        clearCart();
      }
    }
  }, [orders, cartId, clearCart]);

  // 👇 adaptive colors
  const cardBg = useColorModeValue("white", "gray.800");
  const dateText = useColorModeValue("gray.600", "gray.400");
  const labelText = useColorModeValue("gray.700", "gray.300");

  if (isLoading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="xl" />
        <Text mt={2}>Loading your orders...</Text>
      </Box>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <Box p={6} textAlign="center">
        <Text mb={2}>No orders found for your account.</Text>
        <Text>
          <Link to="/" style={{ color: "#319795", fontWeight: "bold" }}>
            Start Ordering →
          </Link>
        </Text>
      </Box>
    );
  }

  return (
    <Box p={6}>
      <Heading size="lg" mb={4}>
        My Orders
      </Heading>
      <Divider mb={4} />

      <VStack spacing={4} align="stretch">
        {[...orders].reverse().map((order: OrdersResponseDto) => (
          <Box
            key={order.orderId}
            borderWidth="1px"
            borderRadius="md"
            p={4}
            bg={cardBg} // 👈 adaptive background
            shadow="sm"
          >
            <Heading size="sm">Order #{order.orderId}</Heading>
            <Text fontSize="sm" color={dateText}>
              Placed on {new Date(order.orderDate).toLocaleDateString()}
            </Text>

            <Divider my={2} />

            <Text>
              Total: <strong>KES {order.totalPrice.toFixed(2)}</strong>
            </Text>

            {/* Payment status */}
            <HStack mt={2} spacing={2}>
              <Text fontSize="sm" color={labelText}>
                Payment:
              </Text>
              <Badge
                colorScheme={
                  order.paymentStatus === "PAID"
                    ? "green"
                    : order.paymentStatus === "FAILED"
                    ? "red"
                    : "yellow"
                }
              >
                {order.paymentStatus ?? "PENDING"}
              </Badge>
            </HStack>

            {/* Delivery status */}
            <HStack mt={2} spacing={2}>
              <Text fontSize="sm" color={labelText}>
                Delivery:
              </Text>
              <Badge
                colorScheme={
                  order.deliveryStatus === "DELIVERED"
                    ? "green"
                    : order.deliveryStatus === "IN_TRANSIT"
                    ? "blue"
                    : order.deliveryStatus === "PROCESSING"
                    ? "orange"
                    : order.deliveryStatus === "CANCELLED"
                    ? "red"
                    : "gray"
                }
              >
                {order.deliveryStatus ?? "NOT ASSIGNED"}
              </Badge>
            </HStack>

            <Divider my={2} />

            {order.orderItems.map((item) => (
              <Text key={item.product.id}>
                {item.product.name} × {item.quantity} = KES {item.totalPrice}
              </Text>
            ))}
          </Box>
        ))}
      </VStack>
    </Box>
  );
};

export default OrdersPage;
