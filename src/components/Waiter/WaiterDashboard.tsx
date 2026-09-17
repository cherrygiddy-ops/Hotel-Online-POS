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
import { CartItem } from "@/entities/CartItem";
import { useCategories } from "@/hooks/useCategories";



export default function WaiterDashboard() {
  const apiClient = new APICLIENT<CheckoutRequestDto, CheckoutResponseDto>(
    "/auth/checkout",
  );
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
  const { clearCart } = useCartStore();
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

      const WIDTH = 32;

      const center = (text: string) => {
        const clean = text.slice(0, WIDTH);
        const left = Math.max(0, Math.floor((WIDTH - clean.length) / 2));
        return " ".repeat(left) + clean;
      };

      const line = "-".repeat(WIDTH);

      const formatItem = (name: string, quantity: number, total: number) => {
        const qty = String(quantity);
        const amount = total.toFixed(2);

        // Leave room for quantity and amount
        const maxNameLength = WIDTH - qty.length - amount.length - 2;

        const itemName =
          name.length > maxNameLength ? name.substring(0, maxNameLength) : name;

        return (
          itemName.padEnd(maxNameLength, " ") +
          " " +
          qty.padStart(2, " ") +
          " " +
          amount.padStart(8, " ")
        );
      };

      const totalAmount = Number(receiptCart.totalPrice) || 0;

      const receiptLines: string[] = [];

      receiptLines.push(center("STEAK HOUSE HOTEL"));
      receiptLines.push(center("CUSTOMER RECEIPT"));
      receiptLines.push(line);

      if (receiptOrder?.orderId) {
        receiptLines.push(`Receipt No: ${receiptOrder.orderId}`);
      }

      receiptLines.push(`Served By: ${waiterName}`);
      receiptLines.push(line);

      receiptLines.push(
        "ITEM".padEnd(22, " ") +
          "QTY".padStart(3, " ") +
          "TOTAL".padStart(7, " "),
      );

      receiptLines.push(line);

      receiptCart.items.forEach((item) => {
        const unitPrice = Number(item.product.price) || 0;
        const itemTotal = unitPrice * item.quantity;

        receiptLines.push(
          formatItem(item.product.name, item.quantity, itemTotal),
        );
      });

      receiptLines.push(line);

      receiptLines.push(
        "TOTAL".padEnd(24, " ") +
          `KES ${totalAmount.toFixed(2)}`.padStart(8, " "),
      );

      receiptLines.push(line);
      receiptLines.push("");
      receiptLines.push(center("Thank you!"));
      receiptLines.push(center("Welcome again"));
      receiptLines.push("");
      receiptLines.push("");
      receiptLines.push("");

    const receipt = receiptLines.join("\n");

console.log("RECEIPT GENERATED:", receipt);
console.log("RECEIPT LENGTH:", receipt.length);
console.log("RECEIPT CART:", receiptCart);

console.log("Printing receipt:");
console.log(receipt);

const result = await Printer.printReceipt({ receipt });

      console.log("Native printer result:", result);

if (result.result === 0) {
  // Printer succeeded — now finalize the checkout on the backend
  if (!receiptCart?.id) {
    alert("Receipt printed, but cart ID is missing");
    return;
  }

  checkoutMutation.mutate(
    {
      cartId: receiptCart.id,
    },
    {
      onSuccess: (data) => {
        // Save the completed order response
        setReceiptOrder(data);

        // Close receipt preview
        setShowReceipt(false);

        // Clear local cart state
        clearCart();

        // Clear receipt snapshot
        setReceiptCart(null);

        // Reset waiter name
        setWaiterName("");

        alert("Receipt printed and order completed successfully");
      },
      onError: (error) => {
        console.error("Checkout failed after printing:", error);

        alert(
          "Receipt printed, but checkout failed. Please contact the cashier.",
        );
      },
    },
  );
} else {
  alert("Printer returned error: " + result.result);
}
    } catch (error) {
      console.error("Native printer error:", error);

      alert(
        "Receipt printing failed: " +
          (error instanceof Error ? error.message : String(error)),
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

            <div className="bg-white">
              <div className="text-center">
                <h2 className="font-bold text-lg">Customer Copy</h2>

                <p>Steak House Hotel</p>
                {receiptOrder && (
                  <p className="text-xs">Receipt No: {receiptOrder.orderId}</p>
                )}
                <p className="text-xs">Served By: {waiterName}</p>
              </div>

              <hr className="my-2 border-dashed" />

              {receiptCart.items.map((item) => {
                const unitPrice = Number(item.product.price) || 0;

                const itemTotal = unitPrice * item.quantity;

                return (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm mb-1"
                  >
                    <span>
                      {item.product.name} x{item.quantity}
                    </span>

                    <span>KES {itemTotal.toFixed(2)}</span>
                  </div>
                );
              })}

              <hr className="my-2 border-dashed" />

              <div className="flex justify-between font-bold">
                <span>TOTAL</span>

                <span>
                  KES {(Number(receiptCart.totalPrice) || 0).toFixed(2)}
                </span>
              </div>

              <hr className="my-2 border-dashed" />

              <div className="text-center text-xs mt-3">
                Thank you!
                <br />
                Welcome again Ã°Å¸Å’Å¸
              </div>
            </div>

            {/* SCREEN BUTTONS */}

            <div className="mt-4 flex justify-center gap-3">
              <Button variant="outline" onClick={() => setShowReceipt(false)}>
                Cancel
              </Button>

              <Button onClick={printReceipt}>Print Receipt</Button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
