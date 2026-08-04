import {Box,Text,Divider,VStack,HStack,Image,Button,Spinner,Badge,
} from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import APICLIENT from "@/services/ApiClient";

// Generic API client for orders
const orderClient = new APICLIENT<null, any>("/orders");

const OrderPage = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order", orderId],
    queryFn: () => orderClient.get(orderId!),
    enabled: !!orderId,
  });

  if (isLoading) {
    return (
      <Box textAlign="center" mt={20}>
        <Spinner size="xl" />
        <Text mt={4}>Loading your order...</Text>
      </Box>
    );
  }

  if (isError || !order) {
    return (
      <Box textAlign="center" mt={20}>
        <Text fontSize="xl" color="red.500">
          Failed to load order. Please try again.
        </Text>
        <Button mt={4} onClick={() => navigate("/")}>
          Go Back Home
        </Button>
      </Box>
    );
  }

  return (
    <Box
      maxW="700px"
      mx="auto"
      mt={10}
      p={6}
      borderWidth="1px"
      borderRadius="md"
      bg="gray.50"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={2} color="teal.600">
        Order #{order.orderId}
      </Text>

      {/* ✅ Payment Status */}
      <Badge
        colorScheme={order.paymentStatus === "SUCCESS" ? "green" : "orange"}
        mb={2}
      >
        Payment: {order.paymentStatus}
      </Badge>

      {/* ✅ Delivery Status */}
      <Badge
        colorScheme={
          order.deliveryStatus === "DELIVERED"
            ? "green"
            : order.deliveryStatus === "SHIPPED"
            ? "blue"
            : order.deliveryStatus === "PROCESSING"
            ? "orange"
            : order.deliveryStatus === "CANCELLED"
            ? "red"
            : "gray"
        }
        mb={4}
      >
        Delivery: {order.deliveryStatus}
      </Badge>

      <Divider mb={4} />

      {/* ✅ Items */}
      <VStack align="stretch" spacing={3}>
        {order.items?.map((item: any) => (
          <HStack key={item.id} justify="space-between">
            <HStack>
              <Image
                src={item.imageUrl}
                alt={item.name}
                boxSize="50px"
                borderRadius="md"
              />
              <Text>
                {item.name} × {item.quantity}
              </Text>
            </HStack>
            <Text fontWeight="bold">
              KES {(item.unitPrice * item.quantity).toFixed(2)}
            </Text>
          </HStack>
        ))}
      </VStack>

      <Divider my={4} />

      {/* ✅ Totals */}
      <Text fontSize="lg" fontWeight="semibold">
        Subtotal: KES {order.subtotal?.toFixed(2)}
      </Text>
      <Text fontSize="sm" color="gray.600" mb={4}>
        Payment Method: {order.paymentMethod}
      </Text>

      {/* ✅ Navigation */}
      <HStack spacing={4} mt={6}>
        <Button colorScheme="teal" onClick={() => navigate("/orders")}>
          View All Orders
        </Button>
        <Button variant="outline" onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
      </HStack>
    </Box>
  );
};

export default OrderPage;
