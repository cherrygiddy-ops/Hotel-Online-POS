import {
  Box,
  Text,
  Divider,
  Checkbox,
  FormControl,
  FormLabel,
  RadioGroup,
  VStack,
  Radio,
  Button,
  Input,
  useColorModeValue, // 👈 import this
} from "@chakra-ui/react";
import { useState } from "react";
import useCart from "@/hooks/useCart";
import useCheckout from "@/hooks/useCheckout";

const CheckoutPage = () => {
  const { data: cart } = useCart();
  const checkout = useCheckout();

  const subtotal = cart?.totalPrice;

  type PaymentMethod = "PayBill" | "Stripe" | "STKPush";
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("Stripe");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  // 👇 adaptive colors
  const boxBg = useColorModeValue("gray.50", "gray.700");
  const paybillBg = useColorModeValue("white", "gray.800");
  const paybillText = useColorModeValue("gray.700", "gray.200");

  const formatPhoneNumber = (input: string): string => {
    let normalized = input.trim();

    if (normalized.startsWith("+254")) {
      normalized = normalized.replace("+254", "254");
    } else if (normalized.startsWith("07")) {
      normalized = normalized.replace(/^0/, "254");
    } else if (normalized.startsWith("254")) {
      // do nothing
    } else {
      normalized = "254" + normalized;
    }

    return normalized;
  };

  const handleCheckout = () => {
    const formattedPhone =
      selectedMethod === "STKPush" ? formatPhoneNumber(phoneNumber) : "";

    setIsProcessing(true);

    checkout.mutate(
      {
        cartId: cart?.id!,
        paymentMethod: selectedMethod,
        phoneNumber: formattedPhone,
      },
      {
        onSettled: () => {
          setTimeout(() => {
            setIsProcessing(false);
          }, 8000);
        },
      }
    );
  };

  return (
    <Box flex="1" borderWidth="1px" borderRadius="md" p={4} bg={boxBg}>
      <Text fontSize="lg" fontWeight="bold" mb={2}>
        Cart Summary
      </Text>
      <Divider mb={4} />
      <Text fontSize="md">Subtotal ({cart?.items?.length} items):</Text>
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        KES {subtotal?.toFixed(2)}
      </Text>
      <Checkbox mb={4}>This order contains a gift</Checkbox>

      <FormControl as="fieldset" mb={4}>
        <FormLabel>Select Payment Method</FormLabel>
        <RadioGroup
          onChange={(val: string) => setSelectedMethod(val as PaymentMethod)}
          value={selectedMethod}
        >
          <VStack align="start">
            <Radio value="PayBill">PayBill</Radio>
            <Radio value="Stripe">Stripe</Radio>
            <Radio value="STKPush">STKPush</Radio>
          </VStack>
        </RadioGroup>
      </FormControl>

      {selectedMethod === "PayBill" && (
        <Box mb={4} p={2} borderWidth="1px" borderRadius="md" bg={paybillBg}>
          <Text fontSize="sm" color={paybillText}>
            PayBill Number: <strong>600999</strong>
          </Text>
        </Box>
      )}

      {selectedMethod === "STKPush" && (
        <FormControl mb={4}>
          <FormLabel>Phone Number</FormLabel>
          <Input
            type="tel"
            placeholder="Enter phone number 07..."
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
            pattern="^(\+254|0)[0-9]{9}$"
            required
          />
        </FormControl>
      )}

      <Button
        colorScheme="teal"
        w="full"
        onClick={handleCheckout}
        isDisabled={
          !selectedMethod || (selectedMethod === "STKPush" && !phoneNumber)
        }
        isLoading={isProcessing}
        loadingText="Proceeding..."
      >
        Proceed to Checkout
      </Button>
    </Box>
  );
};

export default CheckoutPage;
