import { partnerRevenue } from "@/lib/mock-data";
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from "recharts";

export default function PartnerRevenue() {
  return (
    <DashboardLayout role="partner">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Revenue Sharing</h1>
          <p className="text-muted-foreground">Monthly revenue from referrals and embedded content</p>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="stat-card">
          <h3 className="text-lg font-semibold font-display mb-4">Earnings Over Time</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={partnerRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="month" stroke="hsl(220,10%,46%)" fontSize={12} />
              <YAxis stroke="hsl(220,10%,46%)" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Line type="monotone" dataKey="earned" stroke="hsl(162,63%,41%)" strokeWidth={2} dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
          <h3 className="text-lg font-semibold font-display mb-4">Referrals by Month</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={partnerRevenue}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="month" stroke="hsl(220,10%,46%)" fontSize={12} />
              <YAxis stroke="hsl(220,10%,46%)" fontSize={12} />
              <Tooltip />
              <Bar dataKey="referrals" fill="hsl(36,95%,55%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
