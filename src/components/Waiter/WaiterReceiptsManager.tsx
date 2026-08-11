import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import * as Dialog from "@radix-ui/react-dialog";

interface Product {
  id: string;
  name: string;
  price: number;
}

interface Cart {
  id: number; // numeric receipt number
  date: string;
  items: { product: Product; quantity: number }[];
  totalPrice: number;
  status: string;
}

export default function WaiterReceiptsManager() {
  const products: Product[] = [
    { id: "p1", name: "Burger", price: 350 },
    { id: "p2", name: "Fries", price: 150 },
    { id: "p3", name: "Soda", price: 100 },
  ];

  const [pendingReceipts, setPendingReceipts] = useState<Cart[]>([
    {
      id: 1001,
      date: new Date().toISOString(),
      items: [
        { product: products[0], quantity: 2 },
        { product: products[1], quantity: 1 },
      ],
      totalPrice: 850,
      status: "Pending",
    },
    {
      id: 1002,
      date: new Date().toISOString(),
      items: [{ product: products[2], quantity: 3 }],
      totalPrice: 300,
      status: "Pending",
    },
  ]);

  const [search, setSearch] = useState("");
  const [selectedReceipt, setSelectedReceipt] = useState<Cart | null>(null);

// Duplicate receipt (redirect to print window only)
const duplicateReceipt = (receipt: Cart) => {
  // Just open a print preview window
  const printWindow = window.open("", "_blank");
  if (printWindow) {
    printWindow.document.write(`
      <html>
        <head><title>Receipt ${receipt.id}</title></head>
        <body style="font-family: monospace; font-size: 12px;">
          <h2 style="text-align:center;">Receipt #${receipt.id}</h2>
          <p>Date: ${new Date(receipt.date).toLocaleString()}</p>
          <hr/>
          <ul style="list-style:none; padding:0;">
            ${receipt.items
              .map(
                (item) =>
                  `<li>${item.product.name} x${item.quantity} — KES ${
                    item.product.price * item.quantity
                  }</li>`
              )
              .join("")}
          </ul>
          <hr/>
          <p><strong>Total: KES ${receipt.totalPrice}</strong></p>
          <p style="text-align:center; margin-top:10px;">Thank you! Welcome again 🌟</p>
        </body>
      </html>
    `);
    printWindow.document.close();
    // Temporarily disable auto-print, just show the window
    // printWindow.print();
  }
};


  const addItemToReceipt = (receipt: Cart, product: Product) => {
    const updated = {
      ...receipt,
      items: [...receipt.items, { product, quantity: 1 }],
      totalPrice: receipt.totalPrice + product.price,
    };
    setPendingReceipts(
      pendingReceipts.map((r) => (r.id === receipt.id ? updated : r))
    );
    setSelectedReceipt(updated);
  };

  const filteredReceipts = pendingReceipts.filter((r) =>
    r.id.toString().includes(search)
  );

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">Waiter Receipts Manager</h2>

      {/* Search bar */}
      <div className="mb-4">
        <Input
          placeholder="Search receipt..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded shadow-sm text-xs md:text-sm lg:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">Receipt No.</th>
              <th className="border p-2">Date</th>
              <th className="border p-2">Items</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredReceipts.map((receipt) => (
              <Dialog.Root
                key={receipt.id}
                onOpenChange={(open) => !open && setSelectedReceipt(null)}
              >
                <Dialog.Trigger asChild>
                  <tr className="hover:bg-gray-50 cursor-pointer">
                    <td className="border p-2">{receipt.id}</td>
                    <td className="border p-2">
                      {new Date(receipt.date).toLocaleString()}
                    </td>
                    <td className="border p-2">
                      {receipt.items.map((item, idx) => (
                        <div key={idx}>
                          {item.product.name} x {item.quantity}
                        </div>
                      ))}
                    </td>
                    <td className="border p-2">{receipt.status}</td>
                    <td className="border p-2">KES {receipt.totalPrice}</td>
                  </tr>
                </Dialog.Trigger>
                <Dialog.Portal>
                  <Dialog.Overlay className="fixed inset-0 bg-black/50" />
                  <Dialog.Content className="fixed top-1/2 left-1/2 w-[400px] -translate-x-1/2 -translate-y-1/2 bg-white p-4 rounded shadow">
                    <Dialog.Title className="text-lg font-bold mb-2">
                      Receipt #{receipt.id}
                    </Dialog.Title>

                    <div className="mb-3">
                      <p className="font-semibold">Items:</p>
                      <ul className="list-disc pl-5 text-sm">
                        {receipt.items.map((item, idx) => (
                          <li key={idx}>
                            {item.product.name} x{item.quantity} — KES{" "}
                            {item.product.price * item.quantity}
                          </li>
                        ))}
                      </ul>
                      <p className="mt-2 font-bold">
                        Total: KES {receipt.totalPrice}
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Button
                      disabled
                        className="w-full"
                        onClick={() => duplicateReceipt(receipt)}
                      >
                        Duplicate Receipt
                      </Button>

                      <div className="grid grid-cols-2 gap-3 mt-3">
                        {products.map((product) => (
                          <div key={product.id} className="border p-2 rounded">
                            <p>{product.name}</p>
                            <p>KES {product.price}</p>
                            <Button
                              size="sm"
                              onClick={() => addItemToReceipt(receipt, product)}
                            >
                              Add
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    <Dialog.Close asChild>
                      <Button className="mt-3 w-full" variant="outline">
                        Close
                      </Button>
                    </Dialog.Close>
                  </Dialog.Content>
                </Dialog.Portal>
              </Dialog.Root>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
