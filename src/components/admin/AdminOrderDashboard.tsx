import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  { name: "Coffee", items: ["Cappuccino", "Americano", "Latte"] },
  {
    name: "Smoothies",
    items: ["Mango Smoothie", "Berry Blast", "Green Detox"],
  },
  {
    name: "Meals",
    items: ["Grilled Chicken", "Classic Steak", "Pumpkin Risotto"],
  },
  { name: "Desserts", items: ["Baklava", "Cheesecake", "Brownie"] },
];

export default function AdminOrderDashboard() {
  const [cart, setCart] = useState<{ name: string; qty: number }[]>([]);
  const [search, setSearch] = useState("");

  const addToCart = (item: string) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.name === item);
      if (existing) {
        return prev.map((p) =>
          p.name === item ? { ...p, qty: p.qty + 1 } : p,
        );
      }
      return [...prev, { name: item, qty: 1 }];
    });
  };

  const updateQty = (item: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((p) =>
          p.name === item ? { ...p, qty: Math.max(1, p.qty + delta) } : p,
        )
        .filter((p) => p.qty > 0),
    );
  };

  const removeItem = (item: string) => {
    setCart((prev) => prev.filter((p) => p.name !== item));
  };

  const filteredCategories = categories.map((cat) => ({
    ...cat,
    items: cat.items.filter((item) =>
      item.toLowerCase().includes(search.toLowerCase()),
    ),
  }));

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
          {filteredCategories.map((cat, idx) =>
            cat.items.length > 0 ? (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="rounded-lg border border-gray-200 p-4 bg-white shadow"
              >
                <h2 className="text-lg font-semibold mb-3">{cat.name}</h2>
                <div className="flex flex-col gap-3">
                  {cat.items.map((item, i) => (
                    <Button
                      key={i}
                      variant="outline"
                      className="w-full h-12 text-sm font-medium"
                      onClick={() => addToCart(item)}
                    >
                      {item}
                    </Button>
                  ))}
                </div>
              </motion.div>
            ) : null,
          )}
        </div>

        {/* Cart panel */}
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-300 p-6 h-64 shadow-lg flex flex-col z-50 max-w-5xl mx-auto">
          <h2 className="text-base font-bold mb-3">🛒 Checkout List</h2>

          {/* Scrollable items list */}
          <div className="flex-1 overflow-y-auto space-y-3">
            {cart.length === 0 ? (
              <p className="text-sm text-gray-500">No items yet</p>
            ) : (
              cart.map((item) => (
                <div
                  key={item.name}
                  className="flex justify-between items-center text-sm bg-gray-100 rounded px-3 py-2"
                >
                  <span className="font-medium">{item.name}</span>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQty(item.name, -1)}
                    >
                      –
                    </Button>
                    <span className="font-bold">{item.qty}</span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => updateQty(item.name, +1)}
                    >
                      +
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeItem(item.name)}
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer pinned at bottom */}
          <div className="mt-3 flex justify-between items-center border-t border-gray-200 pt-3">
            <span className="text-sm font-semibold">
              Total Items: {cart.reduce((sum, i) => sum + i.qty, 0)}
            </span>
            <Button className="h-10 px-6 bg-green-600 text-white hover:bg-green-700">
              Checkout
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
