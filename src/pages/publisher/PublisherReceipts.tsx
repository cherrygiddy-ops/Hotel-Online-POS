import { useState } from "react";
import { FileDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { receipts } from "@/data/publisherMockData";
import { toast } from "sonner";
import DateRangeFilter from "./DateRangeFilter";


export default function PublisherReceipts() {
    const [dateRange, setDateRange] = useState("1y");

  const handleGeneratePdf = (receiptId: string) => {
    toast.success(`PDF report generated for ${receiptId}`, { description: "Download will start shortly." });
  };
  return (
    <div className="space-y-6">
       <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Receipts</h1>
          <p className="text-muted-foreground mt-1">Monthly payout statements and downloadable reports</p>
        </div>
        <div className="flex gap-3">
          <DateRangeFilter value={dateRange} onChange={setDateRange} />
          <Button onClick={() => toast.success("Full report PDF generated")} className="gap-2">
            <FileDown className="h-4 w-4" /> Generate Report
          </Button>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Receipt ID</TableHead>
              <TableHead>Month</TableHead>
              <TableHead className="text-right">Weighted Units</TableHead>
              <TableHead className="text-right">Net Amount</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {receipts.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-sm">{r.id}</TableCell>
                <TableCell className="font-medium">{r.month}</TableCell>
                <TableCell className="text-right">{r.units.toLocaleString()}</TableCell>
                <TableCell className="text-right font-semibold">${r.amount.toFixed(2)}</TableCell>
                <TableCell>
                  <Badge variant={r.status === "Paid" ? "default" : "secondary"} className={r.status === "Paid" ? "bg-success text-success-foreground" : ""}>
                    {r.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleGeneratePdf(r.id)} className="gap-1.5 text-muted-foreground hover:text-foreground">
                    <FileDown className="h-3.5 w-3.5" /> PDF
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
