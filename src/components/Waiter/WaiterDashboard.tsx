import { motion } from "framer-motion";
import Printer from "../../plugins/printer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useProducts } from "@/hooks/useProducts";
import useUpdateCartItem from "@/hooks/useUpdateCartItem";
import useDeleteCartItem from "@/hooks/useDeleteCartItem";
import { useState } from "react";
import { Product } from "@/entities/Product";
import useAddToCart from "@/hooks/useAddToCart";
import useCheckout from "@/hooks/useCheckout";
import useCart from "@/hooks/useCart";
import { useCartStore } from "@/Store/CartStore";
import APICLIENT from "@/services/ApiClient";
import { CheckoutRequestDto } from "@/entities/CheckoutRequestDto";
import { CheckoutResponseDto } from "@/entities/CheckoutResponseDto";
import Cart from "@/entities/Cart";
import { useCategories } from "@/hooks/useCategories";



export default function WaiterDashboard() {
  const [receiptOrder, setReceiptOrder] = useState<CheckoutResponseDto | null>(
    null,
  );
  const [waiterName, setWaiterName] = useState("");
  const [askWaiterName, setAskWaiterName] = useState(false);
  const { productsQuery } = useProducts();
  const { data: cart, isLoading } = useCart();

  const updateItem = useUpdateCartItem();
  const deleteItem = useDeleteCartItem();
  const addItem = useAddToCart();
  const { clearItems } = useCartStore();
  const { data: categories } = useCategories();

  const {
    incrementItemCount,
    decrementItemCount,
    decrementItemCountByQuantity,
  } = useCartStore();

  const [search, setSearch] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptCart, setReceiptCart] = useState<Cart | null>(null);

  const checkoutMutation = useCheckout();

  // --------------------------------------------------
  // LOADING / ERROR
  // --------------------------------------------------
  if (productsQuery.isLoading || isLoading) {
    return <div>Loading menu...</div>;
  }

  if (productsQuery.error) {
    return <div>Error loading products</div>;
  }

  // --------------------------------------------------
  // GROUP PRODUCTS BY CATEGORY
  // --------------------------------------------------
  const grouped = productsQuery.data?.reduce(
    (acc, product) => {
      const catName =
        categories?.find((c) => c.id === product.categoryId)?.name ||
        product.categoryId; // fallback to ID if not found

      if (!acc[catName]) acc[catName] = [];
      acc[catName].push(product);
      return acc;
    },
    {} as Record<string, typeof productsQuery.data>,
  );

  const handleCheckout = async () => {
    if (!cart?.id) return;

    setAskWaiterName(true);
    // Save snapshot for preview
  };
  const confirmWaiterName = () => {
    if (!waiterName) {
      alert("Please enter waiter name");
      return;
    }

    if (!cart?.items?.length) {
      alert("Cart is empty");
      return;
    }

    const snapshot = {
      ...cart,
      items: [...cart.items],
    };

    setReceiptCart(snapshot);
    setAskWaiterName(false);
    setShowReceipt(true);
  };

  // --------------------------------------------------
  // PRINT RECEIPT
  // --------------------------------------------------
const printReceipt = async () => {
  try {
    if (!receiptCart?.items?.length) {
      alert("No items available to print");
      return;
    }

    if (!receiptCart?.id) {
      alert("Cart ID is missing");
      return;
    }

    // STEP 1: Checkout first
    const order = await checkoutMutation.mutateAsync({
      cartId: receiptCart.id,
    });

 const WIDTH = 32;

const center = (text: string) => {
  const clean = text.slice(0, WIDTH);
  const left = Math.max(0, Math.floor((WIDTH - clean.length) / 2));
  return " ".repeat(left) + clean;
};

const line = "=".repeat(WIDTH);
const dashedLine = "-".repeat(WIDTH);

const totalItems = receiptCart.items.reduce(
  (sum, item) => sum + item.quantity,
  0,
);

const receiptLines: string[] = [];

receiptLines.push(center("STEAK HOUSE HOTEL"));
receiptLines.push(center("KITCHEN COPY"));
receiptLines.push(line);

receiptLines.push(`Receipt No: ${order.orderId}`);
receiptLines.push(`Till No: 5631334`);
receiptLines.push(`Requested By: ${waiterName}`);

receiptLines.push(line);

// TABLE HEADER
receiptLines.push(
  "ITEM".padEnd(28, " ") +
  "QTY".padStart(4, " ")
);

receiptLines.push(dashedLine);

// TABLE ROWS
receiptCart.items.forEach((item) => {
  const qty = String(item.quantity);

  const maxItemLength = WIDTH - 4;

  let itemName = item.product.name;

  if (itemName.length > maxItemLength) {
    itemName = itemName.substring(0, maxItemLength);
  }

  receiptLines.push(
    itemName.padEnd(maxItemLength, " ") +
    qty.padStart(4, " ")
  );
});

receiptLines.push(line);

// TOTAL
receiptLines.push(
  "TOTAL ITEMS TO BE SERVED".padEnd(28, " ") +
  String(totalItems).padStart(4, " ")
);

receiptLines.push(line);

const receipt = receiptLines.join("\n");

    const result = await Printer.printReceipt({ receipt });

    console.log("Native printer result:", result);

    if (result.result === 0) {
      clearItems();

      setReceiptOrder(order);
      setReceiptCart(null);
      setShowReceipt(false);
      setWaiterName("");

      alert("Receipt printed successfully");
    } else {
      alert("Printer returned error: " + result.result);
    }
  } catch (error) {
    console.error("Checkout/Print error:", error);

    alert(
      "Failed: " +
        (error instanceof Error
          ? error.message
          : String(error)),
    );
  }
};
  // --------------------------------------------------
  // ADD TO CART
  // --------------------------------------------------

  const handleAddToCart = (product: Product) => {
    if (!cart?.id) return;

    addItem.mutate({
      cartId: cart.id,
      product,
    });
  };

  // --------------------------------------------------
  // INCREASE
  // --------------------------------------------------

  const handleIncrease = (productId: string, qty: number) => {
    if (!cart?.id) return;

    updateItem.mutate({
      cartId: cart.id,
      productId,
      quantity: qty + 1,
    });

    incrementItemCount();
  };

  // --------------------------------------------------
  // DECREASE
  // --------------------------------------------------

  const handleDecrease = (productId: string, qty: number) => {
    if (!cart?.id) return;

    if (qty <= 1) {
      return;
    }

    updateItem.mutate({
      cartId: cart.id,
      productId,
      quantity: qty - 1,
    });

    decrementItemCount();
  };

  // --------------------------------------------------
  // REMOVE
  // --------------------------------------------------

  const handleRemove = (productId: string, qty: number) => {
    if (!cart?.id) return;

    deleteItem.mutate({
      cartId: cart.id,
      productId,
    });

    decrementItemCountByQuantity(qty);
  };

  // --------------------------------------------------
  // PAGE
  // --------------------------------------------------

  return (
    <main className="max-w-5xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Hotel POS Menu</h1>

      {/* SEARCH */}

      <Input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 h-11"
      />

      {/* PRODUCTS */}

      <div className="space-y-6">
        {grouped &&
          Object.entries(grouped).map(([category, items], idx) => {
            const filtered = items.filter((item) =>
              item.name.toLowerCase().includes(search.toLowerCase()),
            );

            if (filtered.length === 0) {
              return null;
            }

            return (
              <motion.div
                key={idx}
                initial={{
                  opacity: 0,
                  y: 10,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.3,
                }}
                className="rounded-lg border border-gray-200 p-4 bg-white shadow"
              >
                <h2 className="text-lg font-semibold mb-3">{category}</h2>

                <div className="flex flex-col gap-3">
                  {filtered.map((item) => (
                    <Button
                      key={item.id}
                      variant="outline"
                      className="w-full h-12 text-sm font-medium"
                      onClick={() => handleAddToCart(item)}
                    >
                      {item.name} Ã¢â‚¬â€œ Kes {item.price}
                    </Button>
                  ))}
                </div>
              </motion.div>
            );
          })}
      </div>

      {/* CART */}

      <div className="fixed bottom-0 inset-x-0 flex justify-center z-50">
        <div className="bg-white border-t border-gray-300 p-6 h-64 shadow-lg flex flex-col w-full max-w-5xl">
          <h2 className="text-base font-bold mb-3">Ã°Å¸â€ºâ€™ Checkout List</h2>

          <div className="flex-1 overflow-y-auto space-y-3">
            {cart?.items?.length === 0 ? (
              <p className="text-sm text-gray-500">No items yet</p>
            ) : (
              cart?.items?.map((item) => (
                <div
                  key={item.product.id}
                  className="flex justify-between items-center text-sm bg-gray-100 rounded px-3 py-2"
                >
                  <span className="font-medium">{item.product.name}</span>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDecrease(item.product.id, item.quantity)
                      }
                    >
                      Ã¢â‚¬â€œ
                    </Button>

                    <span className="font-bold">{item.quantity}</span>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleIncrease(item.product.id, item.quantity)
                      }
                    >
                      +
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        handleRemove(item.product.id, item.quantity)
                      }
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* TOTAL */}

          <div className="mt-3 flex justify-between items-center border-t border-gray-200 pt-3">
            <span className="text-sm font-semibold">
              Total Items:{" "}
              {cart?.items?.reduce((sum, i) => sum + i.quantity, 0)}
            </span>

            <span className="text-sm font-semibold">
              Total Amount: Kes {cart?.totalPrice ?? 0}
            </span>

            <Button
              className="h-10 px-6 bg-green-600 text-white hover:bg-green-700"
              onClick={handleCheckout}
              disabled={checkoutMutation.isPending}
            >
              {checkoutMutation.isPending ? "Processing..." : "Checkout"}
            </Button>
          </div>
        </div>
      </div>

      {askWaiterName && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
          <div className="bg-white rounded-lg p-6 w-[320px] shadow-xl">
            <h3 className="font-bold mb-3">Enter Waiter Name</h3>
            <Input
              placeholder="Waiter name"
              value={waiterName}
              onChange={(e) => setWaiterName(e.target.value)}
            />
            <div className="mt-4 flex justify-center gap-3">
              <Button variant="outline" onClick={() => setAskWaiterName(false)}>
                Cancel
              </Button>
              <Button onClick={confirmWaiterName}>Confirm</Button>
            </div>
          </div>
        </div>
      )}

      {/* ==================================================
          RECEIPT PREVIEW
          SCREEN ONLY
          ================================================== */}

   {showReceipt && receiptCart && (
  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
    <div className="bg-white rounded-lg p-6 w-[320px] shadow-xl">

      {/* RECEIPT PREVIEW */}

      <div className="bg-white text-black font-bold">
        <div className="text-center">

          <h2 className="font-extrabold text-lg">
            STEAK HOUSE HOTEL
          </h2>

          <p className="font-extrabold">
            KITCHEN Copy
          </p>

          {receiptOrder && (
            <p className="text-sm font-bold">
              Receipt No: {receiptOrder.orderId}
            </p>
          )}

          <p className="text-sm font-bold">
            Requested By: {waiterName}
          </p>

        </div>

        <hr className="my-2 border-black border-dashed" />

        {/* ITEMS */}

        {receiptCart.items.map((item) => (
          <div
            key={item.product.id}
            className="flex justify-between text-sm mb-2 font-bold"
          >
            <span className="break-words">
              {item.product.name}
            </span>

            <span className="ml-3 whitespace-nowrap">
              x{item.quantity}
            </span>
          </div>
        ))}

        <hr className="my-2 border-black border-dashed" />

        {/* TOTAL ITEMS */}

        <div className="flex justify-between font-extrabold text-sm">
          <span>
            TOTAL ITEMS TO BE SERVED
          </span>

          <span>
            {receiptCart.items.reduce(
              (sum, item) => sum + item.quantity,
              0,
            )}
          </span>
        </div>

        <hr className="my-2 border-black border-dashed" />

      </div>

      {/* SCREEN BUTTONS */}

      <div className="mt-4 flex justify-center gap-3">
        <Button
          variant="outline"
          onClick={() => setShowReceipt(false)}
        >
          Cancel
        </Button>

        <Button onClick={printReceipt}>
          Print Receipt
        </Button>
      </div>

    </div>
  </div>
)}
    </main>
  );
}
