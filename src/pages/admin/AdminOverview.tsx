import { StatCard } from "@/components/StatCard";
import { StatCard } from "@/components/StatCard";
import { adminStats, monthlyRevenue, contentTypeDistribution, subscriptionBreakdown } from "@/lib/mock-data";
import { DollarSign, Users, BookOpen, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend,
} from "recharts";

const COLORS = [
  "hsl(162, 63%, 41%)", "hsl(36, 95%, 55%)", "hsl(210, 100%, 56%)",
  "hsl(280, 65%, 60%)", "hsl(350, 70%, 55%)",
];

export default function AdminOverview() {
  return (
    <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Dashboard Overview</h1>
          <p className="text-muted-foreground">Platform performance at a glance</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Revenue" value={`$${adminStats.totalRevenue.toLocaleString()}`} change={`${adminStats.revenueGrowth}% this month`} icon={DollarSign} delay={0} />
          <StatCard title="Total Users" value={adminStats.totalUsers.toLocaleString()} change={`${adminStats.userGrowth}% growth`} icon={Users} delay={0.1} />
          <StatCard title="Content Items" value={adminStats.totalContent.toString()} change="12 new this month" icon={BookOpen} delay={0.2} />
          <StatCard title="Publishers" value={adminStats.totalPublishers.toString()} change="2 new this month" icon={TrendingUp} delay={0.3} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="stat-card lg:col-span-2">
            <h3 className="text-lg font-semibold font-display mb-4">Monthly Revenue Trend</h3>
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={monthlyRevenue}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(162, 63%, 41%)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="hsl(162, 63%, 41%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220, 15%, 90%)" />
                <XAxis dataKey="month" stroke="hsl(220, 10%, 46%)" fontSize={12} />
                <YAxis stroke="hsl(220, 10%, 46%)" fontSize={12} tickFormatter={(v) => `$${v / 1000}k`} />
                <Tooltip formatter={(value: number) => [`$${value.toLocaleString()}`, "Revenue"]} />
                <Area type="monotone" dataKey="revenue" stroke="hsl(162, 63%, 41%)" fill="url(#revenueGrad)" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="stat-card">
            <h3 className="text-lg font-semibold font-display mb-4">Content Distribution</h3>
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={contentTypeDistribution} cx="50%" cy="50%" innerRadius={60} outerRadius={90} paddingAngle={4} dataKey="value">
                  {contentTypeDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value: number) => [`${value}%`, "Share"]} />
                <Legend iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }} className="stat-card">
          <h3 className="text-lg font-semibold font-display mb-4">Subscription Tiers</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4 font-medium text-muted-foreground">Tier</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Subscribers</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Revenue</th>
                  <th className="text-right py-3 px-4 font-medium text-muted-foreground">Share</th>
                </tr>
              </thead>
              <tbody>
                {subscriptionBreakdown.map((tier) => (
                  <tr key={tier.tier} className="border-b border-border/50 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4 font-medium">{tier.tier}</td>
                    <td className="py-3 px-4 text-right">{tier.count.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">${tier.revenue.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                        {tier.percent}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
    </div>
  );
}
