import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type OrdersResponseDto from "@/entities/OrdersResponseDto";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/entities/Product";
import useOrdersForCustomer from "@/hooks/useOrdersForCustomer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import Printer from "../../plugins/printer";

export default function WaiterReceiptsManager() {
  const [search, setSearch] = useState("");
// At the top of your component
const [showReceipt, setShowReceipt] = useState(false);

  const {
    data: orders,
    searchedOrder,
    isLoading,
    error,
    addItemsMutation,
    removeItemMutation,
  } = useOrdersForCustomer(search);

  const [selectedReceipt, setSelectedReceipt] =
    useState<OrdersResponseDto | null>(null);

  const { productsQuery } = useProducts();
  const [productSearch, setProductSearch] = useState("");

  // ============================================
  // FILTER PENDING ORDERS
  // ============================================

  const pendingReceipts = search
    ? searchedOrder
      ? [searchedOrder]
      : []
    : orders?.filter(
        (o) => o.paymentStatus?.toLowerCase() === "pending"
      );

  // ============================================
  // REPRINT RECEIPT
  // ============================================

const handleReprintReceipt = async (
  receipt: OrdersResponseDto
) => {
  try {
    const waiterName =
      prompt("Enter waiter name for this receipt:") || "Unknown";

    // 58mm thermal printer
    const WIDTH = 32;
    const ITEM_WIDTH = 20;
    const PRICE_WIDTH = 12;

    const center = (text: string) => {
      const clean = text.slice(0, WIDTH);
      const left = Math.max(
        0,
        Math.floor((WIDTH - clean.length) / 2)
      );

      return " ".repeat(left) + clean;
    };

    const line = "=".repeat(WIDTH);
    const dashedLine = "-".repeat(WIDTH);

    // Calculate total amount
    const calculatedTotal = receipt.orderItems.reduce(
      (sum, item) => {
        const price = Number(item.product.price) || 0;
        const quantity = Number(item.quantity) || 0;

        return sum + price * quantity;
      },
      0
    );

    const receiptTotal =
      Number(receipt.totalPrice) || calculatedTotal;

    const receiptLines: string[] = [];

    // ==========================================
    // HEADER
    // ==========================================

    receiptLines.push(center("STEAK HOUSE HOTEL"));
    receiptLines.push(center("CUSTOMER COPY"));
    receiptLines.push(line);

    receiptLines.push("Till No: 5631334");
    receiptLines.push(`Receipt No: ${receipt.orderId}`);
    receiptLines.push(`Served By: ${waiterName}`);
    receiptLines.push(
      `Date: ${new Date(receipt.orderDate).toLocaleString()}`
    );

    receiptLines.push(line);

    // ==========================================
    // TABLE HEADER
    // ==========================================

    receiptLines.push(
      "ITEM".padEnd(ITEM_WIDTH, " ") +
        "PRICE".padStart(PRICE_WIDTH, " ")
    );

    receiptLines.push(dashedLine);

    // ==========================================
    // ITEMS
    // ==========================================

    receipt.orderItems.forEach((item) => {
      const price =
        Number(item.product.price) || 0;

      const quantity =
        Number(item.quantity) || 0;

      const itemTotal = price * quantity;

      let itemName =
        `${item.product.name} x${quantity}`;

      // Keep item name inside ITEM column
      if (itemName.length > ITEM_WIDTH) {
        itemName = itemName.substring(0, ITEM_WIDTH);
      }

      const priceText =
        `KES ${itemTotal.toFixed(2)}`;

      receiptLines.push(
        itemName.padEnd(ITEM_WIDTH, " ") +
          priceText.padStart(PRICE_WIDTH, " ")
      );
    });

    receiptLines.push(line);

    // ==========================================
    // TOTAL AMOUNT
    // ==========================================

    const totalText =
      `KES ${receiptTotal.toFixed(2)}`;

    receiptLines.push(
      "TOTAL AMOUNT".padEnd(ITEM_WIDTH, " ") +
        totalText.padStart(PRICE_WIDTH, " ")
    );

    receiptLines.push(line);

    // ==========================================
    // FOOTER
    // ==========================================

    receiptLines.push(center("Thank you!"));
    receiptLines.push(center("Welcome again 🌟"));

    const receiptText =
      receiptLines.join("\n");

    console.log(
      "Sending reprint directly to Android printer:"
    );
    console.log(receiptText);

    // ==========================================
    // ANDROID PRINTER BRIDGE
    // ==========================================

    const result = await Printer.printReceipt({
      receipt: receiptText,
    });

    console.log(
      "Native printer result:",
      result
    );

    if (result.result === 0) {
      alert("Receipt reprinted successfully");
    } else {
      alert(
        "Printer returned error: " +
          result.result
      );
    }
  } catch (error) {
    console.error(
      "Reprint error:",
      error
    );

    alert(
      "Reprinting failed: " +
        (error instanceof Error
          ? error.message
          : String(error))
    );
  }
};


  // ============================================
  // UI
  // ============================================

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">
        Waiter Receipts Manager
      </h2>

      {/* SEARCH */}

      <Input
        placeholder="Search receipt..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* LOADING */}

      {isLoading && (
        <p className="text-blue-600 font-medium mt-2">
          🔎 Searching receipts...
        </p>
      )}

      {/* ERROR */}

      {error && (
        <p className="text-red-600 font-semibold mt-2">
          ❌ Error loading receipts
        </p>
      )}

      {/* NO MATCH */}

      {search &&
        !isLoading &&
        !error &&
        pendingReceipts?.length === 0 && (
          <p className="text-red-600 font-semibold mt-2">
            ❌ No receipt issued for number "{search}"
          </p>
        )}

      {/* ========================================
          ORDERS TABLE
          ======================================== */}

      {!isLoading &&
        !error &&
        pendingReceipts &&
        pendingReceipts.length > 0 && (
          <div className="overflow-x-auto mt-4">
            <table className="min-w-full border border-gray-200 rounded shadow-sm text-xs md:text-sm lg:text-base">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="border p-2">
                    Receipt No.
                  </th>

                  <th className="border p-2">
                    Date
                  </th>

                  <th className="border p-2">
                    Items
                  </th>

                  <th className="border p-2">
                    Status
                  </th>

                  <th className="border p-2">
                    Total
                  </th>
                </tr>
              </thead>

              <tbody>
                {pendingReceipts.map((receipt) => (
                  <Dialog.Root
                    key={receipt.orderId}
                    onOpenChange={(open) => {
                      if (!open) {
                        setSelectedReceipt(null);
                        setProductSearch("");
                      }
                    }}
                  >
                    <Dialog.Trigger asChild>
                      <tr
                        className="
                          hover:bg-gray-50
                          cursor-pointer
                        "
                        onClick={() =>
                          setSelectedReceipt(receipt)
                        }
                      >
                        <td className="border p-2">
                          {receipt.orderId}
                        </td>

                        <td className="border p-2">
                          {new Date(
                            receipt.orderDate
                          ).toLocaleString()}
                        </td>

                        <td className="border p-2">
                          {receipt.orderItems.map(
                            (item, idx) => (
                              <div key={idx}>
                                {item.product.name} x{" "}
                                {item.quantity}
                              </div>
                            )
                          )}
                        </td>

                        <td className="border p-2">
                          {receipt.paymentStatus}
                        </td>

                        <td className="border p-2 font-semibold">
                          KES{" "}
                          {Number(
                            receipt.totalPrice
                          ).toFixed(2)}
                        </td>
                      </tr>
                    </Dialog.Trigger>

                    {/* ====================================
                        DIALOG
                        ==================================== */}

                    <Dialog.Portal>
                      <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />

                      <Dialog.Content
                        className="
                          fixed
                          top-1/2
                          left-1/2
                          w-[500px]
                          max-w-[95vw]
                          max-h-[90vh]
                          overflow-y-auto
                          -translate-x-1/2
                          -translate-y-1/2
                          bg-white
                          p-5
                          rounded-lg
                          shadow-xl
                          z-50
                        "
                      >
                        <Dialog.Title className="text-lg font-bold mb-4">
                          Receipt #{receipt.orderId}
                        </Dialog.Title>

                        {/* ==================================
                            ITEMS
                            ================================== */}

                        <div className="mb-4">
                          <p className="font-semibold mb-2">
                            Items:
                          </p>

                          <ul className="space-y-2 text-sm">
                            {receipt.orderItems.map(
                              (item, idx) => (
                                <li
                                  key={idx}
                                  className="
                                    flex
                                    justify-between
                                    items-center
                                    border-b
                                    pb-2
                                  "
                                >
                                  <span>
                                    {item.product.name}{" "}
                                    x{item.quantity}
                                    {" — "}
                                    KES{" "}
                                    {(
                                      Number(
                                        item.product.price
                                      ) *
                                      item.quantity
                                    ).toFixed(2)}
                                  </span>

                                  {/* <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() =>
                                      removeItemMutation.mutate(
                                        {
                                          orderId:
                                            receipt.orderId,
                                          productId:
                                            item.product.id,
                                        }
                                      )
                                    }
                                    disabled={
                                      removeItemMutation.isPending
                                    }
                                  >
                                    Delete
                                  </Button> */}
                                </li>
                              )
                            )}
                          </ul>

                          {/* TOTAL */}

                          <div className="mt-3 flex justify-between font-bold border-t pt-3">
                            <span>Total</span>

                            <span>
                              KES{" "}
                              {Number(
                                receipt.totalPrice
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>

                        {/* ==================================
                            ADD ITEMS
                            ================================== */}

                        <div className="border p-3 rounded mb-4">
                          <p className="font-semibold mb-2">
                            ➕ Add Items to Order
                          </p>

                          <Input
                            placeholder="Search product..."
                            value={productSearch}
                            onChange={(e) =>
                              setProductSearch(
                                e.target.value
                              )
                            }
                          />

                          <div className="mt-2 max-h-40 overflow-y-auto">
                            {productSearch &&
                              productsQuery.data
                                ?.filter(
                                  (p: Product) =>
                                    p.name
                                      .toLowerCase()
                                      .includes(
                                        productSearch.toLowerCase()
                                      )
                                )
                                .map(
                                  (
                                    product: Product
                                  ) => (
                                    <div
                                      key={product.id}
                                      className="
                                        flex
                                        justify-between
                                        items-center
                                        border-b
                                        py-2
                                      "
                                    >
                                      <span>
                                        {product.name} — KES{" "}
                                        {product.price}
                                      </span>

                                      <Button
                                        size="sm"
                                        onClick={() =>
                                          addItemsMutation.mutate(
                                            {
                                              orderId:
                                                receipt.orderId,
                                              items: [
                                                {
                                                  productId:
                                                    product.id,
                                                  quantity: 1,
                                                },
                                              ],
                                            }
                                          )
                                        }
                                        disabled={
                                          addItemsMutation.isPending
                                        }
                                      >
                                        Add
                                      </Button>
                                    </div>
                                  )
                                )}
                          </div>
                        </div>

                        {/* ==================================
                            REPRINT
                            ================================== */}

                        <Button
                          className="w-full"
                          onClick={() =>
                            handleReprintReceipt(
                              receipt
                            )
                          }
                        >
                          🖨️ Reprint Receipt
                        </Button>

                        {/* CLOSE */}

                        <Dialog.Close asChild>
                          <Button
                            className="mt-3 w-full"
                            variant="outline"
                          >
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
        )}
    </div>
  );
}