import { StatCard } from "@/components/StatCard";
import { partnerContentEarnings, partnerRevenue } from "@/lib/mock-data";
import { BookOpen, DollarSign, Eye, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const publisherStats = {
  totalContent: partnerContentEarnings.length,
  totalUnits: partnerContentEarnings.reduce((s, c) => s + c.units, 0),
  totalRevenue: partnerContentEarnings.reduce((s, c) => s + c.revenue, 0),
  avgEngagement: 86,
};

export default function PublisherDashboard() {
  return (
    <DashboardLayout role="publisher">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Publisher Dashboard</h1>
          <p className="text-muted-foreground">Your content performance at a glance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Content" value={publisherStats.totalContent.toString()} icon={BookOpen} delay={0} />
          <StatCard title="Total Units" value={publisherStats.totalUnits.toLocaleString()} change="This month" icon={Eye} delay={0.1} />
          <StatCard title="Total Revenue" value={`$${publisherStats.totalRevenue.toLocaleString()}`} change="+12.4%" icon={DollarSign} delay={0.2} />
          <StatCard title="Avg Engagement" value={`${publisherStats.avgEngagement}%`} icon={TrendingUp} delay={0.3} changeType="neutral" />
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card">
          <h3 className="text-lg font-semibold font-display mb-4">Monthly Earnings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={partnerRevenue}>
              <defs>
                <linearGradient id="publisherGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(210,100%,56%)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(210,100%,56%)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
              <XAxis dataKey="month" stroke="hsl(220,10%,46%)" fontSize={12} />
              <YAxis stroke="hsl(220,10%,46%)" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
              <Area type="monotone" dataKey="earned" stroke="hsl(210,100%,56%)" fill="url(#publisherGrad)" strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
