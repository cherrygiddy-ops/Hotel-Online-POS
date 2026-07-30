import React, { useState } from "react";

interface Receipt {
  id: number;
  table: number;
  items: string[];
  status: "Pending" | "Paid";
}

const CashierDashboard: React.FC = () => {
  const [receipts, setReceipts] = useState<Receipt[]>([
    { id: 102, table: 3, items: ["Tea", "Mandazi"], status: "Pending" },
    { id: 103, table: 5, items: ["Samosa", "Soda"], status: "Pending" },
    { id: 104, table: 1, items: ["Tea", "Chapati"], status: "Pending" },
  ]);

  const [search, setSearch] = useState("");

  const filteredReceipts = receipts.filter(r =>
    r.id.toString().includes(search)
  );

  return (
    <div className="p-4 bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="mb-4 text-center md:text-left">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
          Hotel POS System
        </h1>
        <p className="text-gray-600">Welcome, Admin</p>
      </header>

      {/* Summary Boxes */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        <div className="bg-orange-500 text-white p-3 rounded shadow text-center">
          Open Receipts: {receipts.length}
        </div>
        <div className="bg-green-500 text-white p-3 rounded shadow text-center">
          Receipted Today: 12
        </div>
        <div className="bg-blue-500 text-white p-3 rounded shadow text-center">
          Total Sales Today: KES 4,500
        </div>
        <div className="bg-red-500 text-white p-3 rounded shadow text-center">
          Pending Payments: 2
        </div>
      </div>

      {/* Search */}
      <div className="mb-4 flex justify-center md:justify-start">
        <input
          type="text"
          placeholder="Search Receipt"
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="border border-gray-300 p-2 rounded w-full sm:w-72 focus:ring focus:ring-blue-300"
        />
      </div>

      {/* Open Receipts Table */}
      <div className="overflow-x-auto">
  <table className="min-w-full border border-gray-200 rounded shadow-sm text-xs md:text-sm lg:text-base">
    <thead>
      <tr className="bg-gray-100 text-left">
        <th className="border p-2 whitespace-nowrap">Receipt No.</th>
        <th className="border p-2 whitespace-nowrap">Table</th>
        <th className="border p-2 whitespace-nowrap">Items</th>
        <th className="border p-2 whitespace-nowrap">Status</th>
        <th className="border p-2 whitespace-nowrap">Actions</th>
      </tr>
    </thead>
    <tbody>
      {filteredReceipts.map(r => (
        <tr key={r.id} className="hover:bg-gray-50">
          <td className="border p-2">{r.id}</td>
          <td className="border p-2">{r.table}</td>
          <td className="border p-2">{r.items.join(", ")}</td>
          <td className="border p-2">{r.status}</td>
          <td className="border p-2">
            <div className="flex flex-col sm:flex-row gap-2">
              <button className="bg-green-500 text-white px-2 py-1 rounded hover:bg-green-600">
                Edit
              </button>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                onClick={() =>
                  setReceipts(receipts.filter(x => x.id !== r.id))
                }
              >
                Clear
              </button>
            </div>
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

    </div>
  );
};

export default CashierDashboard;
