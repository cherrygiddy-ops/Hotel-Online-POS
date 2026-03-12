import { partnerRevenue, partnerContentEarnings } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";
import { Badge } from "@/components/ui/badge";

export default function PublisherRevenue() {
  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Revenue Breakdown</h1>
          <p className="text-muted-foreground">Detailed view of your content earnings and trends</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <h3 className="text-lg font-semibold font-display mb-4">Earnings Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={partnerRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="month" stroke="hsl(220,10%,46%)" fontSize={12} />
              <YAxis stroke="hsl(220,10%,46%)" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="earned" stroke="hsl(210,100%,56%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <h3 className="text-lg font-semibold font-display mb-4">Revenue by Content</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Content</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Units</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                </tr>
              </thead>
              <tbody>
                {partnerContentEarnings.map((c) => (
                  <tr key={c.title} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{c.title}</td>
                    <td className="py-3 px-4"><Badge variant="secondary">{c.type}</Badge></td>
                    <td className="py-3 px-4 text-right">{c.units.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right text-primary font-medium">${c.revenue.toLocaleString()}</td>
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
