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
receiptLines.push(`Requested By: ${waiterName}`);

receiptLines.push(line);

// TABLE HEADER
const ITEM_WIDTH = 28;
const QTY_WIDTH = 4;

receiptLines.push(
  "ITEM".padEnd(ITEM_WIDTH, " ") +
  "QTY".padStart(QTY_WIDTH, " ")
);

receiptLines.push(dashedLine);

// TABLE ROWS
receiptCart.items.forEach((item) => {
  const qty = String(item.quantity);
  let itemName = item.product.name;

  // Keep item name within the 28-character column
  if (itemName.length > ITEM_WIDTH) {
    itemName = itemName.substring(0, ITEM_WIDTH);
  }

  receiptLines.push(
    itemName.padEnd(ITEM_WIDTH, " ") +
    qty.padStart(QTY_WIDTH, " ")
  );
});

receiptLines.push(line);

// TOTAL
receiptLines.push(
  "TOTAL ITEMS TO BE SERVED".padEnd(ITEM_WIDTH, " ") +
  String(totalItems).padStart(QTY_WIDTH, " ")
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
    <main className="w-full max-w-5xl mx-auto px-3 sm:px-4 pb-72 overflow-x-hidden">
      <h1 className="text-2xl font-bold mb-4">Hotel POS Menu</h1>

      {/* SEARCH */}

     <Input
  type="text"
  placeholder="Search items..."
  value={search}
  onChange={(e) => setSearch(e.target.value)}
  className="mb-6 h-11 w-full min-w-0"
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
                className="w-full min-w-0 rounded-lg border border-gray-200 p-3 sm:p-4 bg-white shadow"
              >
                <h2 className="text-lg font-semibold mb-3">{category}</h2>

                <div className="flex flex-col gap-3">
                  {filtered.map((item) => (
                    <Button
  key={item.id}
  variant="outline"
  className="w-full min-w-0 h-auto min-h-12 px-3 py-3 text-sm font-medium whitespace-normal break-words text-left"
  onClick={() => handleAddToCart(item)}
>
  <span className="w-full break-words">
    {item.name} - Kes {item.price}
  </span>
</Button>
                  ))}
                </div>
              </motion.div>
            );
          })}
      </div>
{/* CART / CHECKOUT */}
<div className="fixed bottom-0 left-0 right-0 z-50 w-full">
  <div
    className="
      mx-auto
      w-full
      max-w-5xl
      bg-white
      border-t
      border-gray-300
      shadow-2xl
      flex
      flex-col
      h-[280px]
      sm:h-64
    "
  >
    {/* HEADER */}
    <div className="shrink-0 px-3 sm:px-6 pt-3 pb-2">
      <h2 className="text-sm sm:text-base font-bold">
        🛒 Checkout List
      </h2>
    </div>

    {/* SCROLLABLE ITEMS */}
    <div
      className="
        flex-1
        min-h-0
        overflow-y-auto
        overflow-x-hidden
        px-3
        sm:px-6
        space-y-2
        overscroll-contain
        scrollbar-thin
      "
    >
      {cart?.items?.length === 0 ? (
        <p className="text-sm text-gray-500 py-2">
          No items yet
        </p>
      ) : (
        cart.items.map((item) => (
          <div
            key={item.product.id}
            className="
              w-full
              min-w-0
              flex
              items-center
              gap-2
              bg-gray-100
              rounded
              px-2
              py-2
            "
          >
            {/* ITEM NAME */}
            <span
              className="
                flex-1
                min-w-0
                text-xs
                sm:text-sm
                font-medium
                break-words
              "
            >
              {item.product.name}
            </span>

            {/* CONTROLS */}
            <div className="shrink-0 flex items-center gap-1">
              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() =>
                  handleDecrease(
                    item.product.id,
                    item.quantity
                  )
                }
              >
                -
              </Button>

              <span className="w-6 text-center text-sm font-bold">
                {item.quantity}
              </span>

              <Button
                variant="outline"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() =>
                  handleIncrease(
                    item.product.id,
                    item.quantity
                  )
                }
              >
                +
              </Button>

              <Button
                variant="destructive"
                size="sm"
                className="h-8 px-2 text-xs sm:px-3 sm:text-sm"
                onClick={() =>
                  handleRemove(
                    item.product.id,
                    item.quantity
                  )
                }
              >
                Remove
              </Button>
            </div>
          </div>
        ))
      )}
    </div>

    {/* TOTAL / CHECKOUT */}
    <div
      className="
        shrink-0
        border-t
        border-gray-200
        px-3
        sm:px-6
        py-2
        bg-white
      "
    >
      <div className="flex items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="text-xs sm:text-sm font-semibold">
            Total Items:{" "}
            {cart?.items?.reduce(
              (sum, i) => sum + i.quantity,
              0
            ) || 0}
          </p>

          <p className="text-xs sm:text-sm font-semibold truncate">
            Total: Kes {cart?.totalPrice ?? 0}
          </p>
        </div>

        <Button
          className="
            shrink-0
            h-9
            px-4
            sm:h-10
            sm:px-6
            bg-green-600
            text-white
            hover:bg-green-700
          "
          onClick={handleCheckout}
          disabled={checkoutMutation.isPending}
        >
          {checkoutMutation.isPending
            ? "Processing..."
            : "Checkout"}
        </Button>
      </div>
    </div>
  </div>
</div>

      {askWaiterName && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">
         <div
  className="
    bg-white
    rounded-lg
    p-4
    sm:p-6
    w-[calc(100%-24px)]
    max-w-[360px]
    max-h-[90vh]
    overflow-y-auto
    shadow-xl
  "
>
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
<div className="w-full text-sm font-bold">
  {/* HEADER */}
  <div className="flex w-full border-b border-dashed border-black pb-1 mb-2">
    <span className="flex-1 min-w-0">
      ITEM
    </span>

    <span className="w-10 text-right shrink-0">
      QTY
    </span>
  </div>

  {/* ROWS */}
  {receiptCart.items.map((item) => (
    <div
      key={item.product.id}
      className="flex w-full mb-2"
    >
      <span className="flex-1 min-w-0 break-words pr-2">
        {item.product.name}
      </span>

      <span className="w-10 text-right shrink-0">
        {item.quantity}
      </span>
    </div>
  ))}
</div>

        <hr className="my-2 border-black border-dashed" />

        {/* TOTAL ITEMS */}

        <div className="flex w-full items-start font-extrabold text-sm">
  <span className="flex-1 min-w-0 pr-2">
    TOTAL ITEMS TO BE SERVED
  </span>

  <span className="w-10 text-right shrink-0">
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
