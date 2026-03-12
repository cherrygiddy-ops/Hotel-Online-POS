import { monthlyRevenue } from "@/lib/mock-data";
import { motion } from "framer-motion";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function AdminRevenue() {
  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Revenue Overview</h1>
          <p className="text-muted-foreground">Monthly recognized revenue by subscription tier</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <h3 className="text-lg font-semibold font-display mb-4">Revenue by Tier (Stacked)</h3>
          <ResponsiveContainer width="100%" height={360}>
            <BarChart data={monthlyRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="month" stroke="hsl(220,10%,46%)" fontSize={12} />
              <YAxis stroke="hsl(220,10%,46%)" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Legend />
              <Bar dataKey="shaba" stackId="a" fill="hsl(210,100%,56%)" name="Shaba" radius={[0, 0, 0, 0]} />
              <Bar dataKey="fedha" stackId="a" fill="hsl(36,95%,55%)" name="Fedha" />
              <Bar dataKey="dhahabu" stackId="a" fill="hsl(162,63%,41%)" name="Dhahabu" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
