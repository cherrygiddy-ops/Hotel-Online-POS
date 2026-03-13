import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { monthlyEarnings, revenueByContentType, payoutLedger } from "@/data/publisherMockData";
import DateRangeFilter from "./DateRangeFilter";


export default function PublisherRevenue() {
   const [dateRange, setDateRange] = useState("6m");
  return (
    <div className="space-y-6">
         <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-heading font-bold">Revenue Breakdown</h1>
          <p className="text-muted-foreground mt-1">Track your earnings, deductions and payouts</p>
        </div>
        <DateRangeFilter value={dateRange} onChange={setDateRange} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-4">Monthly Earnings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyEarnings}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Net Earnings"]}
              />
              <Line type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-4">By Content Type</h3>
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie data={revenueByContentType} cx="50%" cy="50%" innerRadius={55} outerRadius={85} dataKey="value" paddingAngle={3}>
                {revenueByContentType.map((entry, i) => (
                  <Cell key={i} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: "hsl(var(--card))", border: "1px solid hsl(var(--border))", borderRadius: "8px" }} formatter={(v: number) => [`${v}%`, "Share"]} />
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-2 mt-2">
            {revenueByContentType.map((item) => (
              <div key={item.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: item.fill }} />
                  <span className="text-muted-foreground">{item.name}</span>
                </div>
                <span className="font-medium">{item.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card rounded-xl p-6">
        <h3 className="font-heading font-semibold mb-4">Payout Ledger</h3>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Month</TableHead>
                <TableHead className="text-right">Gross Units</TableHead>
                <TableHead className="text-right">Weighted Units</TableHead>
                <TableHead className="text-right">Gross Revenue</TableHead>
                <TableHead className="text-right">Platform Fee (15%)</TableHead>
                <TableHead className="text-right">Tax (5%)</TableHead>
                <TableHead className="text-right">Net Payout</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutLedger.map((row) => (
                <TableRow key={row.month}>
                  <TableCell className="font-medium">{row.month}</TableCell>
                  <TableCell className="text-right">{row.grossUnits.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{row.weightedUnits.toLocaleString()}</TableCell>
                  <TableCell className="text-right">${row.grossRevenue.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">-${row.platformFee.toFixed(2)}</TableCell>
                  <TableCell className="text-right text-muted-foreground">-${row.tax.toFixed(2)}</TableCell>
                  <TableCell className="text-right font-semibold">${row.netPayout.toFixed(2)}</TableCell>
                  <TableCell>
                    <Badge variant={row.status === "Paid" ? "default" : "secondary"} className={row.status === "Paid" ? "bg-success text-success-foreground" : ""}>
                      {row.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
