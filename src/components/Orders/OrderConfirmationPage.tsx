import {Box, Text,Divider,Button, VStack, HStack, Image,} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // ✅ Assume order details are passed via navigate state after checkout
  const { orderId, items, subtotal, paymentMethod } = location.state || {};

  return (
    <Box
      maxW="600px"
      mx="auto"
      mt={10}
      p={6}
      borderWidth="1px"
      borderRadius="md"
      bg="gray.50"
    >
      <Text fontSize="2xl" fontWeight="bold" mb={2} color="teal.600">
        🎉 Order Confirmed!
      </Text>
      <Text fontSize="md" mb={4}>
        Thank you for your purchase. Your order <strong>#{orderId}</strong> has
        been placed successfully.
      </Text>

      <Divider mb={4} />

      {/* ✅ Order Summary */}
      <VStack align="stretch" spacing={3}>
        {items?.map((item: any) => (
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

      <Text fontSize="lg" fontWeight="semibold">
        Subtotal: KES {subtotal?.toFixed(2)}
      </Text>
      <Text fontSize="sm" color="gray.600" mb={4}>
        Payment Method: {paymentMethod}
      </Text>

      {/* ✅ Actions */}
      <HStack spacing={4} mt={6}>
        <Button colorScheme="teal" onClick={() => navigate("/orders")}>
          View My Orders
        </Button>
        <Button variant="outline" onClick={() => navigate("/")}>
          Continue Shopping
        </Button>
      </HStack>
    </Box>
  );
};

export default OrderConfirmation;
