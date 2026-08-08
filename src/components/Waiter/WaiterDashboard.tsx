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


const printReceipt = () => {
  if (!cart || !cart.items || cart.items.length === 0) {
    alert("Receipt not found or cart is empty.");
    return;
  }

  const receiptWindow = window.open("", "_blank", "width=400,height=600");

  if (!receiptWindow) {
    alert("Please allow pop-ups for this site so the receipt can print.");
    return;
  }

  const itemsHtml = cart.items
    .map(
      (item) => `
        <div class="item">
          <span>${item.product.name} x${item.quantity}</span>
          <span>KES ${item.totalprice}</span>
        </div>
      `
    )
    .join("");

  receiptWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>Receipt</title>

        <style>
          @page {
            size: 58mm 120mm;
            margin: 0;
          }

          * {
            box-sizing: border-box;
          }

          html,
          body {
            width: 58mm;
            margin: 0;
            padding: 0;
            background: white;
          }

          body {
            font-family: monospace;
            font-size: 11px;
            line-height: 1.25;
            color: black;
          }

          .receipt {
            width: 58mm;
            padding: 2mm;
            margin: 0;
          }

          .center {
            text-align: center;
          }

          .bold {
            font-weight: bold;
          }

          .item {
            display: flex;
            justify-content: space-between;
            width: 100%;
            margin-bottom: 3px;
          }

          .line {
            border-top: 1px dashed black;
            margin: 6px 0;
          }

          .total {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
          }

          @media print {
            html,
            body {
              width: 58mm;
              margin: 0;
              padding: 0;
            }

            .receipt {
              width: 58mm;
            }
          }
        </style>
      </head>

      <body>
        <div class="receipt">

          <div class="center">
            <div class="bold">HOTEL POS</div>
            <div>Kapkatet, Kericho</div>
            <div>Tel: 0712 345 678</div>
          </div>

          <div class="line"></div>

          ${itemsHtml}

          <div class="line"></div>

          <div class="total">
            <span>TOTAL</span>
            <span>KES ${cart.totalPrice}</span>
          </div>

          <div class="line"></div>

          <div class="center">
            Thank you!<br>
            Welcome again
          </div>

        </div>

        <script>
          window.onload = function() {
            setTimeout(function() {
              window.print();
            }, 300);
          };

          window.onafterprint = function() {
            window.close();
          };
        </script>

      </body>
    </html>
  `);

  receiptWindow.document.close();
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