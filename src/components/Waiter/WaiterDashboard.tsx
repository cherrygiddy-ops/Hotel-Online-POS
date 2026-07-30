import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const categories = [
  { name: "Coffee", items: ["Cappuccino", "Americano", "Latte"] },
  { name: "Smoothies", items: ["Mango Smoothie", "Berry Blast", "Green Detox"] },
  { name: "Meals", items: ["Grilled Chicken", "Classic Steak", "Pumpkin Risotto"] },
  { name: "Desserts", items: ["Baklava", "Cheesecake", "Brownie"] },
];

export default function WaiterDashboard() {
  const [cart, setCart] = useState<{ name: string; qty: number }[]>([]);
  const [search, setSearch] = useState("");

  const addToCart = (item: string) => {
    setCart(prev => {
      const existing = prev.find(p => p.name === item);
      if (existing) {
        return prev.map(p =>
          p.name === item ? { ...p, qty: p.qty + 1 } : p
        );
      }
      return [...prev, { name: item, qty: 1 }];
    });
  };

  const updateQty = (item: string, delta: number) => {
    setCart(prev =>
      prev
        .map(p =>
          p.name === item ? { ...p, qty: Math.max(1, p.qty + delta) } : p
        )
        .filter(p => p.qty > 0)
    );
  };

  // Filter items by search term
  const filteredCategories = categories.map(cat => ({
    ...cat,
    items: cat.items.filter(item =>
      item.toLowerCase().includes(search.toLowerCase())
    ),
  }));

  return (
    <div className="min-h-screen bg-background p-4 pb-28">
      <h1 className="text-xl font-bold mb-4">Hotel POS Menu</h1>

      {/* Search bar */}
      <Input
        type="text"
        placeholder="Search items..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-6 h-11"
      />

      <div className="space-y-6">
        {filteredCategories.map((cat, idx) =>
          cat.items.length > 0 ? (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="rounded-lg border border-muted p-4 bg-card"
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
          ) : null
        )}
      </div>

      {/* Cart panel */}
      <div className="fixed bottom-0 left-0 right-0 bg-card border-t border-muted p-4 max-h-48 overflow-y-auto">
        <h2 className="text-sm font-semibold mb-2">Cart</h2>
        {cart.length === 0 ? (
          <p className="text-xs text-muted-foreground">No items yet</p>
        ) : (
          <div className="space-y-2">
            {cart.map(item => (
              <div
                key={item.name}
                className="flex justify-between items-center text-sm"
              >
                <span>{item.name}</span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQty(item.name, -1)}
                  >
                    –
                  </Button>
                  <span>{item.qty}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => updateQty(item.name, +1)}
                  >
                    +
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
        <div className="mt-3 flex justify-between items-center">
          <span className="text-sm font-medium">
            Items: {cart.reduce((sum, i) => sum + i.qty, 0)}
          </span>
          <Button className="h-9 px-4">Checkout</Button>
        </div>
      </div>
    </div>
  );
}
