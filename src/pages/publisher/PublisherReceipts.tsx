
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { Receipt, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const receipts = [
  { id: "RCP-001", date: "Mar 2026", amount: 1760, status: "Paid", items: 4 },
  { id: "RCP-002", date: "Feb 2026", amount: 1580, status: "Paid", items: 4 },
  { id: "RCP-003", date: "Jan 2026", amount: 1420, status: "Paid", items: 3 },
  { id: "RCP-004", date: "Dec 2025", amount: 1680, status: "Paid", items: 5 },
  { id: "RCP-005", date: "Nov 2025", amount: 1340, status: "Paid", items: 3 },
  { id: "RCP-006", date: "Oct 2025", amount: 1200, status: "Paid", items: 3 },
];

export default function PublisherReceipts() {
  return (
    <DashboardLayout role="publisher">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Receipts & Payouts</h1>
          <p className="text-muted-foreground">Your payout history and downloadable receipts</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { label: "Total Paid Out", value: `$${receipts.reduce((s, r) => s + r.amount, 0).toLocaleString()}` },
            { label: "Total Receipts", value: receipts.length.toString() },
            { label: "Avg Payout", value: `$${Math.round(receipts.reduce((s, r) => s + r.amount, 0) / receipts.length).toLocaleString()}` },
          ].map((card, i) => (
            <motion.div key={card.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} className="stat-card text-center">
              <p className="text-sm text-muted-foreground">{card.label}</p>
              <p className="mt-2 text-2xl font-bold font-display text-primary">{card.value}</p>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
          <div className="flex items-center gap-2 mb-4">
            <Receipt className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-semibold font-display">Payout History</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Receipt ID</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Period</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Items</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Status</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Action</th>
                </tr>
              </thead>
              <tbody>
                {receipts.map((r) => (
                  <tr key={r.id} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium font-mono text-sm">{r.id}</td>
                    <td className="py-3 px-4">{r.date}</td>
                    <td className="py-3 px-4 text-right">{r.items}</td>
                    <td className="py-3 px-4 text-right text-primary font-medium">${r.amount.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">{r.status}</Badge>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="sm" className="h-8 text-muted-foreground hover:text-foreground">
                        <Download className="h-4 w-4 mr-1" /> PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
