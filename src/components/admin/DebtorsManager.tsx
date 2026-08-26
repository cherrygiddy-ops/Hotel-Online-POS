import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";


interface Receipt {
  receiptNo: number;
  items: string[];
  total: number;
}

interface Debtor {
  name: string;
  receipts: Receipt[];
}

export default function DebtorsManager() {
  const [debtors, setDebtors] = useState<Debtor[]>([
    {
      name: "Robert Koech",
      receipts: [
        { receiptNo: 1001, items: ["Burger x2", "Fries x1"], total: 850 },
        { receiptNo: 1002, items: ["Soda x3"], total: 300 },
      ],
    },
    {
      name: "Evans Tonui",
      receipts: [
        { receiptNo: 1003, items: ["Pizza x1"], total: 1200 },
      ],
    },
  ]);

  const [search, setSearch] = useState("");
  const [newDebtorName, setNewDebtorName] = useState("");
  const [newReceiptNo, setNewReceiptNo] = useState<number | "">("");

  // Add debtor
  const addDebtor = () => {
    if (!newDebtorName || !newReceiptNo) return;
    const newDebtor: Debtor = {
      name: newDebtorName,
      receipts: [{ receiptNo: Number(newReceiptNo), items: [], total: 0 }],
    };
    setDebtors([...debtors, newDebtor]);
    setNewDebtorName("");
    setNewReceiptNo("");
  };

  // Filter debtors by search
  const filteredDebtors = debtors.filter((d) =>
    d.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-4">
      <h2 className="font-bold text-lg mb-4">Debtors Manager</h2>

      {/* Add Debtor Form */}
      <div className="flex gap-2 mb-4">
        <Input
          placeholder="Debtor name"
          value={newDebtorName}
          onChange={(e) => setNewDebtorName(e.target.value)}
        />
        <Input
          placeholder="Receipt number"
          type="number"
          value={newReceiptNo}
          onChange={(e) => setNewReceiptNo(e.target.value ? Number(e.target.value) : "")}
        />
        <Button onClick={addDebtor}>Add Debtor</Button>
      </div>

      {/* Search bar */}
      <div className="mb-4">
        <Input
          placeholder="Search debtor by name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Debtors List */}
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded shadow-sm text-xs md:text-sm lg:text-base">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border p-2">Debtor Name</th>
              <th className="border p-2">Receipt No.</th>
              <th className="border p-2">Items</th>
              <th className="border p-2">Total</th>
            </tr>
          </thead>
          <tbody>
            {filteredDebtors.map((debtor) =>
              debtor.receipts.map((receipt) => (
                <tr key={`${debtor.name}-${receipt.receiptNo}`} className="hover:bg-gray-50">
                  <td className="border p-2">{debtor.name}</td>
                  <td className="border p-2">{receipt.receiptNo}</td>
                  <td className="border p-2">
                    {receipt.items.length > 0
                      ? receipt.items.map((item, idx) => <div key={idx}>{item}</div>)
                      : "—"}
                  </td>
                  <td className="border p-2">KES {receipt.total}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
