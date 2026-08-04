import React, { useState } from "react";
import useOrdersForCustomer from "@/hooks/useOrdersForCustomer";
import type OrdersResponseDto from "@/entities/OrdersResponseDto";

const CashierDashboard: React.FC = () => {
  const {
    data: orders,
    isLoading,
    summary,
    error,
    markPaidMutation,
  } = useOrdersForCustomer();
  const [search, setSearch] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<OrdersResponseDto | null>(
    null,
  );

  if (isLoading) return <p>Loading orders...</p>;
  if (error) return <p>Error loading orders</p>;

  // Filter by receipt number
  const filteredOrders = orders?.filter((o: OrdersResponseDto) =>
    o.orderId.toString().includes(search),
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="mb-4 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Steak Hotel POS System
        </h1>
        <p className="text-gray-600">Welcome, Admin</p>
      </header>

      {/* Summary Boxes (using backend summary) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div
          className="bg-red-500 text-white p-3 rounded shadow text-center cursor-pointer hover:bg-red-600"
          onClick={() =>
            setSelectedOrder({
              orderId: -1, // marker for pending list
              paymentStatus: "Pending",
              orderDate: new Date(),
              orderItems: [],
              totalPrice: 0,
              deliveryStatus: "",
              cartId: "",
            })
          }
        >
          Pending Payments: {summary?.pendingReceipts ?? 0}
        </div>
        <div
          className="bg-green-500 text-white p-3 rounded shadow text-center cursor-pointer hover:bg-green-600"
          onClick={() =>
            setSelectedOrder({
              orderId: -2, // marker for paid list
              paymentStatus: "Paid",
              orderDate: new Date(),
              orderItems: [],
              totalPrice: 0,
              deliveryStatus: "",
              cartId: "",
            })
          }
        >
          Paid Receipts: {summary?.paidReceipts ?? 0}
        </div>
        <div className="bg-orange-500 text-white p-3 rounded shadow text-center">
          Total Receipts: {summary?.totalReceipts ?? 0}
        </div>
        <div className="bg-blue-500 text-white p-3 rounded shadow text-center">
          Total Sales: KES {summary?.totalSales ?? 0}
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex justify-center md:justify-start">
        <input
          type="text"
          placeholder="Search Receipt"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full sm:w-72 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Orders Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded shadow-sm text-xs md:text-sm lg:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2 whitespace-nowrap">Receipt No.</th>
              <th className="border p-2 whitespace-nowrap">Date</th>
              <th className="border p-2 whitespace-nowrap">Items</th>
              <th className="border p-2 whitespace-nowrap">Status</th>
              <th className="border p-2 whitespace-nowrap">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders?.map((o) => (
              <tr
                key={o.orderId}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => setSelectedOrder(o)}
              >
                <td className="border p-2">{o.orderId}</td>
                <td className="border p-2">
                  {new Date(o.orderDate).toLocaleString()}
                </td>
                <td className="border p-2">
                  {o.orderItems.map((item, idx) => (
                    <div key={idx}>
                      {item.product.name} x {item.quantity}
                    </div>
                  ))}
                </td>
                <td className="border p-2">{o.paymentStatus}</td>
                <td className="border p-2">KES {o.totalPrice}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Popup Modal for Pending Orders */}
      {selectedOrder && selectedOrder.orderId === -1 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-2 text-center">
              Pending Orders
            </h2>

            {orders
              ?.filter((o) => o.paymentStatus?.toLowerCase() === "pending")
              .map((o) => (
                <div key={o.orderId} className="border-b py-2 text-sm">
                  <div className="flex justify-between">
                    <span>Receipt #{o.orderId}</span>
                    <span>KES {o.totalPrice}</span>
                  </div>
                  <div className="ml-2 text-gray-600">
                    {o.orderItems.map((item, idx) => (
                      <div key={idx}>
                        {item.product.name} x {item.quantity}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal for Paid Orders */}
      {selectedOrder && selectedOrder.orderId === -2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-xl font-bold mb-2 text-center">Paid Orders</h2>

            {orders
              ?.filter((o) => o.paymentStatus?.toLowerCase() === "paid")
              .map((o) => (
                <div key={o.orderId} className="border-b py-2 text-sm">
                  <div className="flex justify-between">
                    <span>Receipt #{o.orderId}</span>
                    <span>KES {o.totalPrice}</span>
                  </div>
                  <div className="ml-2 text-gray-600">
                    {o.orderItems.map((item, idx) => (
                      <div key={idx}>
                        {item.product.name} x {item.quantity}
                      </div>
                    ))}
                  </div>
                </div>
              ))}

            <div className="mt-4 flex justify-end">
              <button
                className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                onClick={() => setSelectedOrder(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Popup Modal for Single Order */}
      {selectedOrder &&
        selectedOrder.orderId !== -1 &&
        selectedOrder.orderId !== -2 && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white p-6 rounded shadow-lg w-96">
              <h2 className="text-xl font-bold mb-2 text-center">
                Receipt #{selectedOrder.orderId}
              </h2>
              <p className="text-xs text-center mb-4 text-gray-500">
                {new Date(selectedOrder.orderDate).toLocaleString()}
              </p>

              <div className="space-y-2">
                {selectedOrder.orderItems.map((item, idx) => (
                  <div key={idx} className="flex justify-between text-sm">
                    <span>
                      {item.product.name} x {item.quantity}
                    </span>
                    <span>KES {item.totalPrice}</span>
                  </div>
                ))}
              </div>

              <div className="mt-4 border-t pt-2 flex justify-between font-semibold">
                <span>Total</span>
                <span>KES {selectedOrder.totalPrice}</span>
              </div>

              <div className="mt-4 flex justify-end gap-2">
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
                  onClick={() => setSelectedOrder(null)}
                >
                  Close
                </button>
                <button
                  className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
                  onClick={() => markPaidMutation.mutate(selectedOrder.orderId)}
                  disabled={markPaidMutation.isPending}
                >
                  {markPaidMutation.isPending ? "Updating..." : "Mark as Paid"}
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default CashierDashboard;
