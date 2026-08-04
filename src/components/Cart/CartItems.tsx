import useCart from "@/hooks/useCart";
import useUpdateCartItem from "@/hooks/useUpdateCartItem";
import useDeleteCartItem from "@/hooks/useDeleteCartItem";
import {
  Box,
  Flex,
  Image,
  Text,
  Button,
  Divider,
  VStack,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "../Store/AuthStore";
import useCartStore from "@/Store/CartStore";

const CartItems = () => {
  const { data: cart } = useCart();
  const updateItem = useUpdateCartItem();
  const deleteItem = useDeleteCartItem();
  const subtotal = cart?.totalPrice;
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const incrementCartItemStore = useCartStore((s) => s.incrementItemCount);
  const decrementCartItemStore = useCartStore((s) => s.decrementItemCount);
  const decrementCartItemStoreByQuantity = useCartStore(
    (s) => s.decrementItemCountByQuantity
  );

  const bgCard = useColorModeValue("white", "gray.700");
  const bgSummary = useColorModeValue("gray.50", "gray.800");
  const textSecondary = useColorModeValue("gray.600", "gray.300");

  const handleIncreaseQuantity = (productId: string, quantity: number) => {
    updateItem.mutate({ cartId: cart!.id, productId, quantity: quantity + 1 });
    incrementCartItemStore();
  };

  const handleDecreaseQuantity = (productId: string, quantity: number) => {
    updateItem.mutate({ cartId: cart!.id, productId, quantity: quantity - 1 });
    decrementCartItemStore();
  };

  const handleRemoveItem = (productId: string) => {
    deleteItem.mutate({ cartId: cart!.id, productId });
  };

  return (
    <Flex direction={{ base: "column", md: "row" }} p={6} gap={6}>
      {/* Cart Items Section */}
      <Box flex="3">
        <Text fontSize="2xl" fontWeight="bold" mb={4}>
          Shopping Cart
        </Text>
        <Divider mb={4} />
        <VStack spacing={6} align="stretch">
          {cart?.items?.map((item) => (
            <Flex
              key={item.product.id}
              align="flex-start"
              justify="space-between"
              borderWidth="1px"
              borderRadius="md"
              p={4}
              bg={bgCard}
              shadow="sm"
              wrap="wrap"
            >
        

              {/* Product Details */}
              <Box flex="1" ml={4}>
                <Text fontWeight="bold" fontSize="lg">
                  {item.product.name}
                </Text>
                <Text color={textSecondary} fontSize="sm">
                  KES {item.product.price}
                </Text>

                {/* Quantity Controls */}
                <HStack mt={3}>
                  <Button
                    size="sm"
                    onClick={() =>
                      handleDecreaseQuantity(item.product.id, item.quantity)
                    }
                    isDisabled={item.quantity <= 1}
                  >
                    -
                  </Button>
                  <Text fontSize="md" fontWeight="semibold">
                    {item.quantity}
                  </Text>
                  <Button
                    size="sm"
                    onClick={() =>
                      handleIncreaseQuantity(item.product.id, item.quantity)
                    }
                  >
                    +
                  </Button>
                </HStack>

                {/* Remove Button */}
                <Button
                  mt={3}
                  size="sm"
                  colorScheme="red"
                  variant="outline"
                  onClick={() => {
                    handleRemoveItem(item.product.id);
                    decrementCartItemStoreByQuantity(item.quantity - 1);
                  }}
                >
                  Remove
                </Button>
              </Box>
            </Flex>
          ))}
        </VStack>
      </Box>

      {/* Summary Section */}
      <Box flex="1" borderWidth="1px" borderRadius="md" p={4} bg={bgSummary}>
        <Text fontSize="lg" fontWeight="bold" mb={2}>
          Cart Summary
        </Text>
        <Divider mb={4} />
        <Text fontSize="md">Subtotal ({cart?.items?.length} items):</Text>
        <Text fontSize="xl" fontWeight="bold" mb={4}>
          KES {subtotal?.toFixed(2)}
        </Text>

        {subtotal! > 0 && (
          <Button
            colorScheme="teal"
            w="full"
            onClick={() => {
              if (user) {
                navigate("/checkoutPage");
              } else {
                navigate("/login");
              }
            }}
          >
            Proceed to Checkout
          </Button>
        )}
      </Box>
    </Flex>
  );
};

export default CartItems;
