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
import { useQueryClient } from "@tanstack/react-query";
import useCart from "@/hooks/useCart";
import { useCartStore } from "@/Store/CartStore";

export default function WaiterDashboard() {
  const queryClient = useQueryClient();
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

  if (productsQuery.isLoading || isLoading) return <p>Loading menu...</p>;
  if (productsQuery.error) return <p>Error loading products</p>;

  // Group products by categoryId
  const grouped = productsQuery.data?.reduce(
    (acc, product) => {
      const cat = product.categoryId;
      if (!acc[cat]) acc[cat] = [];
      acc[cat].push(product);
      return acc;
    },
    {} as Record<string, typeof productsQuery.data>,
  );

  const handleCheckout = () => {
    if (!cart?.id) return;
    setShowReceipt(true);
  };

const printReceipt = () => {
  if (!cart?.id) return;

  // Clear items optimistically
  useCartStore.getState().clearItems();
  queryClient.setQueryData(["cartItems"], (old: any) => {
    if (!old) return old;
    return { ...old, items: [], totalPrice: 0 };
  });

  checkoutMutation.mutate({
    cartId: cart.id,
    paymentMethod: "PayBill",
    phoneNumber: "0712345678",
  });

  // Trigger print directly from the click event
  window.print();

  // Close modal AFTER print dialog has opened
  // Use a delay so the gesture context isn't lost
  setTimeout(() => {
    setShowReceipt(false);
  }, 1500);
};





  const handleAddToCart = (product: Product) => {
    addItem.mutate({ cartId: cart!.id, product });
  };

  const handleIncrease = (productId: string, qty: number) => {
    updateItem.mutate({ cartId: cart!.id, productId, quantity: qty + 1 });
    incrementItemCount();
  };

  const handleDecrease = (productId: string, qty: number) => {
    updateItem.mutate({ cartId: cart!.id, productId, quantity: qty - 1 });
    decrementItemCount();
  };

  const handleRemove = (productId: string, qty: number) => {
    deleteItem.mutate({ cartId: cart!.id, productId });
    decrementItemCountByQuantity(qty);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <main className="relative p-4 pb-28 bg-white w-full max-w-5xl">
        <h1 className="text-xl font-bold mb-4">Hotel POS Menu</h1>

        {/* Search bar */}
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
            Object.entries(grouped).map(([category, items], idx) => {
              const filtered = items.filter((item) =>
                item.name.toLowerCase().includes(search.toLowerCase()),
              );
              return filtered.length > 0 ? (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
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
                        onClick={() => handleAddToCart(item)}
                      >
                        {item.name} – Kes {item.price}
                      </Button>
                    ))}
                  </div>
                </motion.div>
              ) : null;
            })}
        </div>

        {/* Cart panel */}
        <div className="fixed bottom-0 inset-x-0 flex justify-center z-50">
          <div className="bg-white border-t border-gray-300 p-6 h-64 shadow-lg flex flex-col w-full max-w-5xl">
            <h2 className="text-base font-bold mb-3">🛒 Checkout List</h2>

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
                        –
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

              {/* Receipt modal */}
        {/* Receipt modal */}
{showReceipt && cart && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded shadow-lg w-96">
      <div id="receipt" className="text-center">
        <h2 className="text-lg font-bold mb-2">
          🥩 Steak House Hotel
        </h2>
        <p className="text-xs mb-4 text-gray-500">
          Thank you for dining with us
        </p>

        <div className="space-y-1">
          {cart.items.map((item) => (
            <div
              key={item.product.id}
              className="text-sm"
              style={{ pageBreakInside: "avoid" }}
            >
              {item.product.name} x {item.quantity} — Kes {item.totalprice}
            </div>
          ))}
        </div>

        <div
          className="mt-2 font-semibold"
          style={{ pageBreakInside: "avoid" }}
        >
          Total: Kes {cart.totalPrice}
        </div>

        <p className="text-xs mt-2 italic text-gray-500">
          🌟 Welcome back again! 🌟
        </p>
      </div>

      {/* Actions */}
      <div className="mt-4 flex justify-center">
        <Button
          className="bg-green-600 text-white hover:bg-green-700"
          onClick={printReceipt}
          disabled={checkoutMutation.isPending}
        >
          {checkoutMutation.isPending ? "Processing..." : "Print Receipt"}
        </Button>
      </div>
    </div>
  </div>
)}

      </main>
    </div>
  );
}
