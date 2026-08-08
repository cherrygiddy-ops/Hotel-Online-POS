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

export default function WaiterDashboard() {
  const { productsQuery } = useProducts();
  const { data: cart, isLoading } = useCart();

  const updateItem = useUpdateCartItem();
  const deleteItem = useDeleteCartItem();
  const addItem = useAddToCart();

  const {
    incrementItemCount,
    decrementItemCount,
    decrementItemCountByQuantity,
  } = useCartStore();

  const [search, setSearch] = useState("");
  const [showReceipt, setShowReceipt] = useState(false);

  const checkoutMutation = useCheckout();

  if (productsQuery.isLoading || isLoading) {
    return <div>Loading menu...</div>;
  }

  if (productsQuery.error) {
    return <div>Error loading products</div>;
  }

  const grouped = productsQuery.data?.reduce(
    (acc, product) => {
      const cat = product.categoryId;

      if (!acc[cat]) {
        acc[cat] = [];
      }

      acc[cat].push(product);

      return acc;
    },
    {} as Record<string, typeof productsQuery.data>
  );

  const handleCheckout = () => {
    if (!cart?.id || !cart.items?.length) return;

    setShowReceipt(true);
  };

  /*
   * PRINT RECEIPT
   *
   * This creates a separate print-only document.
   * Chrome will NOT print the POS page itself.
   */
const printReceipt = () => {
  try {
    const receipt = document.getElementById("thermal-receipt");

    if (!receipt) {
      alert("Receipt not found.");
      return;
    }

    // Create print styles
    const style = document.createElement("style");
    style.id = "thermal-print-styles";

    style.innerHTML = `
      @media print {
        @page {
          size: 58mm auto;
          margin: 0;
        }

        html,
        body {
          width: 58mm !important;
          margin: 0 !important;
          padding: 0 !important;
          background: white !important;
        }

        body {
          overflow: visible !important;
        }

        body > * {
          display: none !important;
        }

        #thermal-receipt {
          display: block !important;
          visibility: visible !important;

          position: absolute !important;
          left: 0 !important;
          top: 0 !important;

          width: 58mm !important;
          max-width: 58mm !important;

          margin: 0 !important;
          padding: 2mm !important;

          box-sizing: border-box !important;

          font-family: monospace !important;
          font-size: 11px !important;
          line-height: 1.2 !important;

          color: #000 !important;
          background: #fff !important;

          page-break-before: avoid !important;
          page-break-after: avoid !important;
          page-break-inside: avoid !important;

          break-before: avoid !important;
          break-after: avoid !important;
          break-inside: avoid !important;
        }

        #thermal-receipt * {
          visibility: visible !important;
        }

        .no-print {
          display: none !important;
        }
      }
    `;

    document.head.appendChild(style);

    // Print
    window.print();

    // Remove print CSS after printing
    setTimeout(() => {
      const oldStyle = document.getElementById(
        "thermal-print-styles"
      );

      if (oldStyle) {
        oldStyle.remove();
      }
    }, 1000);

  } catch (error) {
    console.error("Printing error:", error);

    alert(
      "Printing failed. Please check your printer connection."
    );
  }
};

  const handleAddToCart = (product: Product) => {
    if (!cart?.id) return;

    addItem.mutate({
      cartId: cart.id,
      product,
    });
  };

  const handleIncrease = (productId: string, qty: number) => {
    if (!cart?.id) return;

    updateItem.mutate({
      cartId: cart.id,
      productId,
      quantity: qty + 1,
    });

    incrementItemCount();
  };

  const handleDecrease = (productId: string, qty: number) => {
    if (!cart?.id || qty <= 1) return;

    updateItem.mutate({
      cartId: cart.id,
      productId,
      quantity: qty - 1,
    });

    decrementItemCount();
  };

  const handleRemove = (productId: string, qty: number) => {
    if (!cart?.id) return;

    deleteItem.mutate({
      cartId: cart.id,
      productId,
    });

    decrementItemCountByQuantity(qty);
  };

  return (
    <main className="max-w-5xl mx-auto p-4">

      <h1 className="text-2xl font-bold mb-4">
        Hotel POS Menu
      </h1>

      {/* Search */}
      <Input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="mb-6 h-11"
      />

      {/* Categories */}
      <div className="space-y-6">

        {grouped &&
          Object.entries(grouped).map(
            ([category, items], idx) => {

              const filtered = items.filter((item) =>
                item.name
                  .toLowerCase()
                  .includes(search.toLowerCase())
              );

              return filtered.length > 0 ? (
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
                    Category {category}
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
              ) : null;
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
                (sum, i) => sum + i.quantity,
                0
              )}
            </span>

            <span className="text-sm font-semibold">
              Total Amount: KES{" "}
              {cart?.totalPrice ?? 0}
            </span>

            <Button
              className="h-10 px-6 bg-green-600 text-white hover:bg-green-700"
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

      {/* RECEIPT MODAL */}
      {showReceipt && cart && (

        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[100]">

          <div className="bg-white rounded-lg p-6 w-[320px] shadow-xl">

            {/* Receipt preview */}
            <div className="bg-white text-black p-3 font-mono text-sm">

              <div className="text-center">

                <h2 className="font-bold text-lg">
                  HOTEL POS
                </h2>

                <p>
                  Kapkatet, Kericho
                </p>

                <p>
                  Tel: 0712 345 678
                </p>

              </div>

              <hr className="my-2 border-dashed" />

              {cart.items.map((item) => (

                <div
                  key={item.product.id}
                  className="flex justify-between text-sm mb-1 gap-2"
                >

                  <span>
                    {item.product.name} x{item.quantity}
                  </span>

                  <span className="whitespace-nowrap">
                    KES {item.totalprice}
                  </span>

                </div>

              ))}

              <hr className="my-2 border-dashed" />

              <div className="flex justify-between font-bold">

                <span>
                  TOTAL
                </span>

                <span>
                  KES {cart.totalPrice}
                </span>

              </div>

              <hr className="my-2 border-dashed" />

              <div className="text-center text-xs mt-3">

                Thank you!<br />
                Welcome again 🌟

              </div>

            </div>

            {/* BUTTONS */}
            <div className="mt-4 flex justify-center gap-3">

              <Button
                variant="outline"
                onClick={() =>
                  setShowReceipt(false)
                }
              >
                Cancel
              </Button>

              <Button
                className="bg-green-600 text-white hover:bg-green-700"
                onClick={printReceipt}
              >
                Print Receipt
              </Button>

            </div>

          </div>

        </div>

      )}

    </main>
  );
}