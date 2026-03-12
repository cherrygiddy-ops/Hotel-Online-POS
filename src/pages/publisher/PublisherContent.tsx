import { topContent, contentTypeDistribution } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Badge } from "@/components/ui/badge";

export default function PublisherContent() {
  return (
    <DashboardLayout role="publisher">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Content Analytics</h1>
          <p className="text-muted-foreground">Track your content performance and engagement</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <h3 className="text-lg font-semibold font-display mb-4">Units by Content Type</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={contentTypeDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis type="number" stroke="hsl(220,10%,46%)" fontSize={12} />
              <YAxis dataKey="name" type="category" stroke="hsl(220,10%,46%)" fontSize={12} width={80} />
              <Tooltip formatter={(v: number) => v.toLocaleString()} />
              <Bar dataKey="units" fill="hsl(210,100%,56%)" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <h3 className="text-lg font-semibold font-display mb-4">Top Content</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Title</th>
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Type</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Units</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Engagement</th>
                </tr>
              </thead>
              <tbody>
                {topContent.map((c) => (
                  <tr key={c.title} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{c.title}</td>
                    <td className="py-3 px-4"><Badge variant="secondary">{c.type}</Badge></td>
                    <td className="py-3 px-4 text-right">{c.units.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="text-primary font-medium">{c.engagement}%</span>
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
