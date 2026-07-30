import { partnerContentEarnings } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";

export default function PartnerContent() {
  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Embedded Content Earnings</h1>
          <p className="text-muted-foreground">Performance of your hosted content on LoHo</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
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
  );
}
