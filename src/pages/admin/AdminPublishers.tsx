import { topPublishers } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Trophy } from "lucide-react";

export default function AdminPublishers() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Publisher Insights</h1>
          <p className="text-muted-foreground">Top publishers by revenue and engagement</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {topPublishers.slice(0, 3).map((pub, i) => (
            <motion.div
              key={pub.name}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className={`stat-card relative overflow-hidden ${i === 0 ? "ring-2 ring-primary/20" : ""}`}
            >
              {i === 0 && (
                <div className="absolute top-3 right-3">
                  <Trophy className="h-5 w-5 text-accent" />
                </div>
              )}
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">#{i + 1} Publisher</p>
              <p className="mt-2 text-xl font-bold font-display">{pub.name}</p>
              <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                <div>
                  <p className="text-lg font-bold text-primary">${(pub.revenue / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-muted-foreground">Revenue</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{(pub.units / 1000).toFixed(1)}k</p>
                  <p className="text-xs text-muted-foreground">Units</p>
                </div>
                <div>
                  <p className="text-lg font-bold">{pub.content}</p>
                  <p className="text-xs text-muted-foreground">Content</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
          <h3 className="text-lg font-semibold font-display mb-4">All Publishers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Publisher</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Units</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Content</th>
                </tr>
              </thead>
              <tbody>
                {topPublishers.map((pub) => (
                  <tr key={pub.name} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{pub.name}</td>
                    <td className="py-3 px-4 text-right text-primary font-medium">${pub.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{pub.units.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">{pub.content}</td>
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
