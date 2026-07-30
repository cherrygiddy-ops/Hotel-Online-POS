import { StatCard } from "@/components/admin/StatCard";
import { partnerStats, partnerRevenue } from "@/lib/mock-data";
import { DollarSign, Users, BookOpen, Percent } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function PartnerOverview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display">Partner Overview</h1>
        <p className="text-muted-foreground">
          Your earnings and referral performance
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Earned"
          value={`$${partnerStats.totalEarned.toLocaleString()}`}
          change={`${partnerStats.earningGrowth}% growth`}
          icon={DollarSign}
          delay={0}
        />
        <StatCard
          title="Referrals"
          value={partnerStats.totalReferrals.toString()}
          change="This month"
          icon={Users}
          delay={0.1}
        />
        <StatCard
          title="Active Content"
          value={partnerStats.activeContent.toString()}
          icon={BookOpen}
          delay={0.2}
        />
        <StatCard
          title="Revenue Share"
          value={`${partnerStats.revenueShare}%`}
          icon={Percent}
          delay={0.3}
          changeType="neutral"
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="stat-card"
      >
        <h3 className="text-lg font-semibold font-display mb-4">
          Monthly Earnings Trend
        </h3>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={partnerRevenue}>
            <defs>
              <linearGradient id="partnerGrad" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="hsl(162,63%,41%)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="hsl(162,63%,41%)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
            <XAxis dataKey="month" stroke="hsl(220,10%,46%)" fontSize={12} />
            <YAxis
              stroke="hsl(220,10%,46%)"
              fontSize={12}
              tickFormatter={(v) => `$${v}`}
            />
            <Tooltip formatter={(v: number) => `$${v.toLocaleString()}`} />
            <Area
              type="monotone"
              dataKey="earned"
              stroke="hsl(162,63%,41%)"
              fill="url(#partnerGrad)"
              strokeWidth={2}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>
    </div>
  );
}
