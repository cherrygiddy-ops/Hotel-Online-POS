import { motion } from "framer-motion";
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

declare global {
  interface Window {
    AndroidPrinter?: {
      printReceipt(text: string): void;
    };
  }
}

export default function WaiterDashboard() {
  const apiClient = new APICLIENT<CheckoutRequestDto, CheckoutResponseDto>("/auth/checkout");
  const [receiptOrder, setReceiptOrder] = useState<CheckoutResponseDto | null>(null);
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
const grouped = productsQuery.data?.reduce((acc, product) => {
  const catName =
    categories?.find((c) => c.id === product.categoryId)?.name ||
    product.categoryId; // fallback to ID if not found

  if (!acc[catName]) acc[catName] = [];
  acc[catName].push(product);
  return acc;
}, {} as Record<string, typeof productsQuery.data>);


const handleCheckout = async () => {
if (!cart?.id) return;

  // Save snapshot for preview
  setReceiptCart({ ...cart });

  // Show receipt modal
  setShowReceipt(true);
};

// --------------------------------------------------
// PRINT RECEIPT
// --------------------------------------------------
const printReceipt = async () => {
  if (!receiptCart) {
    alert("Receipt not found.");
    return;
  }

  try {
    
      // ✅ Call checkout API AFTER printing
      const response: CheckoutResponseDto = await apiClient.checkout({
        cartId: receiptCart.id,
      });
      setReceiptOrder(response);
      console.log("Order placed:", response.orderId);
    // Build hidden iframe
    const iframe = document.createElement("iframe");
    iframe.style.position = "fixed";
    iframe.style.width = "1px";
    iframe.style.height = "1px";
    iframe.style.border = "0";
    iframe.style.opacity = "0";
    iframe.style.pointerEvents = "none";
    document.body.appendChild(iframe);

    const printDocument = iframe.contentDocument || iframe.contentWindow?.document;
    if (!printDocument) throw new Error("Unable to create print document.");

    // Build receipt items
    const receiptItems = receiptCart.items.map((item) => {
      const unitPrice = Number(item.product.price) || 0;
      const quantity = Number(item.quantity) || 0;
      const itemTotal = unitPrice * quantity;
      return `
        <div class="item">
          <span class="item-name">${item.product.name} x${quantity}</span>
          <span class="item-price">KES ${itemTotal.toFixed(2)}</span>
        </div>
      `;
    }).join("");

    const calculatedTotal = receiptCart.items.reduce((sum, item) => {
      const price = Number(item.product.price) || 0;
      const quantity = Number(item.quantity) || 0;
      return sum + price * quantity;
    }, 0);

    const receiptTotal = Number(receiptCart.totalPrice) || calculatedTotal;

    // Write receipt HTML
    printDocument.open();
    printDocument.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />
          <title>Receipt</title>
          <style>
            @page { size: 58mm auto; margin: 0; }
            body { font-family: monospace; font-size: 11px; line-height: 1.25; }
            .receipt { width: 58mm; padding: 3mm; }
            .line { border-top: 1px dashed black; margin: 6px 0; }
            .item { display: flex; justify-content: space-between; margin-bottom: 4px; }
            .total { display: flex; justify-content: space-between; font-weight: bold; }
            .thank-you { text-align: center; font-size: 10px; margin-top: 8px; }
          </style>
        </head>
        <body>
          <div class="receipt">
            <div style="text-align:center;">
              <div style="font-weight:bold;">HOTEL POS</div>
              <div>Steak House Hotel</div>
              <div>Receipt No: ${response.orderId}</div>
            </div>
            <div class="line"></div>
            ${receiptItems}
            <div class="line"></div>
            <div class="total"><span>TOTAL</span><span>KES ${receiptTotal.toFixed(2)}</span></div>
            <div class="line"></div>
            <div class="thank-you">Thank you!<br/>Welcome again 🌟</div>
          </div>
        </body>
      </html>
    `);
    printDocument.close();

    // ✅ Make the timeout callback async
    setTimeout(async () => {
      const printWindow = iframe.contentWindow;
      printWindow?.focus();
      printWindow?.print();

      // Close modal and clear cart
      setShowReceipt(true);
     


      printWindow?.close();
      setTimeout(() => iframe.remove(), 500);
    }, 500);

  } catch (error) {
    console.error("Printing error:", error);
    alert("Printing failed. Please check printer connection.");
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

  const handleIncrease = (
    productId: string,
    qty: number
  ) => {
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

  const handleDecrease = (
    productId: string,
    qty: number
  ) => {
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

  const handleRemove = (
    productId: string,
    qty: number
  ) => {
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

      <h1 className="text-2xl font-bold mb-4">
        Hotel POS Menu
      </h1>

      {/* SEARCH */}

      <Input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) =>
          setSearch(e.target.value)
        }
        className="mb-6 h-11"
      />

      {/* PRODUCTS */}

      <div className="space-y-6">

        {grouped &&
          Object.entries(grouped).map(
            ([category, items], idx) => {

              const filtered = items.filter(
                (item) =>
                  item.name
                    .toLowerCase()
                    .includes(search.toLowerCase())
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

                  <h2 className="text-lg font-semibold mb-3">
                    {category}
                  </h2>

                  <div className="flex flex-col gap-3">

                    {filtered.map((item) => (

                      <Button
                        key={item.id}
                        variant="outline"
                        className="w-full h-12 text-sm font-medium"
                        onClick={() =>
                          handleAddToCart(item)
                        }
                      >
                        {item.name} – Kes {item.price}
                      </Button>

                    ))}

                  </div>

                </motion.div>
              );
            }
          )}

      </div>

      {/* CART */}

      <div className="fixed bottom-0 inset-x-0 flex justify-center z-50">

        <div className="bg-white border-t border-gray-300 p-6 h-64 shadow-lg flex flex-col w-full max-w-5xl">

          <h2 className="text-base font-bold mb-3">
            🛒 Checkout List
          </h2>

          <div className="flex-1 overflow-y-auto space-y-3">

            {cart?.items?.length === 0 ? (

              <p className="text-sm text-gray-500">
                No items yet
              </p>

            ) : (

              cart?.items?.map((item) => (

                <div
                  key={item.product.id}
                  className="flex justify-between items-center text-sm bg-gray-100 rounded px-3 py-2"
                >

                  <span className="font-medium">
                    {item.product.name}
                  </span>

                  <div className="flex items-center gap-2">

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        handleDecrease(
                          item.product.id,
                          item.quantity
                        )
                      }
                    >
                      –
                    </Button>

                    <span className="font-bold">
                      {item.quantity}
                    </span>

                    <Button
                      variant="outline"
                      size="sm"
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

          {/* TOTAL */}

          <div className="mt-3 flex justify-between items-center border-t border-gray-200 pt-3">

            <span className="text-sm font-semibold">
              Total Items:{" "}
              {cart?.items?.reduce(
                (sum, i) =>
                  sum + i.quantity,
                0
              )}
            </span>

            <span className="text-sm font-semibold">
              Total Amount: Kes{" "}
              {cart?.totalPrice ?? 0}
            </span>

            <Button
              className="h-10 px-6 bg-green-600 text-white hover:bg-green-700"
              onClick={handleCheckout}
              disabled={
                checkoutMutation.isPending
              }
            >
              {checkoutMutation.isPending
                ? "Processing..."
                : "Checkout"}
            </Button>

          </div>

        </div>

      </div>

      {/* ==================================================
          RECEIPT PREVIEW
          SCREEN ONLY
          ================================================== */}

      {showReceipt && cart && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">

          <div className="bg-white rounded-lg p-6 w-[320px] shadow-xl">

            {/* RECEIPT PREVIEW */}

            <div className="bg-white">

              <div className="text-center">

                <h2 className="font-bold text-lg">
                  HOTEL POS
                </h2>

                <p>
                 Steak House Hotel
                </p>
{receiptOrder && (
                  <p className="text-xs">Receipt No: {receiptOrder.orderId}</p>
                )}
            

              </div>

              <hr className="my-2 border-dashed" />

              {cart.items.map((item) => {

                const unitPrice =
                  Number(item.product.price) || 0;

                const itemTotal =
                  unitPrice * item.quantity;

                return (
                  <div
                    key={item.product.id}
                    className="flex justify-between text-sm mb-1"
                  >

                    <span>
                      {item.product.name} x
                      {item.quantity}
                    </span>

                    <span>
                      KES {itemTotal.toFixed(2)}
                    </span>

                  </div>
                );
              })}

              <hr className="my-2 border-dashed" />

              <div className="flex justify-between font-bold">

                <span>
                  TOTAL
                </span>

                <span>
                  KES {(
                    Number(cart.totalPrice) || 0
                  ).toFixed(2)}
                </span>

              </div>

              <hr className="my-2 border-dashed" />

              <div className="text-center text-xs mt-3">

                Thank you!
                <br />
                Welcome again 🌟

              </div>

            </div>

            {/* SCREEN BUTTONS */}

            <div className="mt-4 flex justify-center gap-3">

              <Button
                variant="outline"
                onClick={() =>
                  setShowReceipt(false)
                }
              >
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


