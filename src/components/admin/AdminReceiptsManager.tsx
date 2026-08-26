import { useState } from "react";
import * as Dialog from "@radix-ui/react-dialog";
import type OrdersResponseDto from "@/entities/OrdersResponseDto";
import { useProducts } from "@/hooks/useProducts";
import { Product } from "@/entities/Product";
import useOrdersForCustomer from "@/hooks/useOrdersForCustomer";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

export default function AdminReceiptsManager() {
  const [search, setSearch] = useState("");

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

  const handleReprintReceipt = (receipt: OrdersResponseDto) => {
    const printWindow = window.open("", "_blank");

    if (!printWindow) {
      alert("Unable to open print window. Please allow popups.");
      return;
    }

    // Calculate total from items
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

    // ==========================================
    // RECEIPT ITEMS
    // ==========================================

    const receiptItems = receipt.orderItems
      .map((item) => {
        const unitPrice = Number(item.product.price) || 0;
        const quantity = Number(item.quantity) || 0;
        const itemTotal = unitPrice * quantity;

        return `
          <div class="item">
            <span class="item-name">
              ${item.product.name} x${quantity}
            </span>

            <span class="item-price">
              KES ${itemTotal.toFixed(2)}
            </span>
          </div>
        `;
      })
      .join("");

    // ==========================================
    // PRINT DOCUMENT
    // ==========================================

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8" />

          <title>
            Receipt ${receipt.orderId}
          </title>

          <style>
            @page {
              size: 58mm auto;
              margin: 0;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              margin: 0;
              padding: 0;
              width: 58mm;
              background: white;
            }

            body {
              font-family: monospace;
              font-size: 11px;
              line-height: 1.25;
            }

            .receipt {
              width: 58mm;
              padding: 3mm;
            }

            .header {
              text-align: center;
            }

            .customer-copy {
              font-size: 13px;
              font-weight: bold;
              margin-bottom: 3px;
            }

            .hotel-name {
              font-size: 12px;
              font-weight: bold;
            }

            .receipt-number {
              margin-top: 3px;
            }

            .line {
              border-top: 1px dashed #000;
              margin: 7px 0;
            }

            .item {
              display: flex;
              justify-content: space-between;
              align-items: flex-start;
              gap: 8px;
              margin-bottom: 5px;
            }

            .item-name {
              flex: 1;
              text-align: left;
              word-break: break-word;
            }

            .item-price {
              white-space: nowrap;
              text-align: right;
            }

            .total {
              display: flex;
              justify-content: space-between;
              font-weight: bold;
              font-size: 12px;
            }

            .footer {
              text-align: center;
              font-size: 10px;
              margin-top: 8px;
            }

            .status {
              text-align: center;
              margin-top: 4px;
              font-size: 10px;
            }
          </style>
        </head>

        <body>
          <div class="receipt">

            <!-- HEADER -->

            <div class="header">
              <div class="customer-copy">
                Customer Copy
              </div>

              <div class="hotel-name">
                Steak House Hotel
              </div>

              <div> Till No: 5631334 </div>

              <div class="receipt-number">
                Receipt No: ${receipt.orderId}
              </div>

              <div>
                Date:
                ${new Date(
                  receipt.orderDate
                ).toLocaleString()}
              </div>
            </div>

            <!-- SEPARATOR -->

            <div class="line"></div>

            <!-- ITEMS -->

            ${receiptItems}

            <!-- SEPARATOR -->

            <div class="line"></div>

            <!-- TOTAL -->

            <div class="total">
              <span>TOTAL</span>

              <span>
                KES ${receiptTotal.toFixed(2)}
              </span>
            </div>

            <!-- SEPARATOR -->

            <div class="line"></div>

           

            <!-- FOOTER -->

            <div class="footer">
              Thank you!
              <br />
              Welcome again 🌟
            </div>

          </div>
        </body>
      </html>
    `);

    printWindow.document.close();

    // Give browser time to render before printing
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      printWindow.close();
    }, 300);
  };

  // ============================================
  // UI
  // ============================================

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">
        Admin Receipts Manager
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

                                  <Button
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
                                  </Button>
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

                        {/* <Button
                          className="w-full"
                          onClick={() =>
                            handleReprintReceipt(
                              receipt
                            )
                          }
                        >
                          🖨️ Reprint Receipt
                        </Button> */}

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