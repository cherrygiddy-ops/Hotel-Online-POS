import { DollarSign, TrendingUp, Package, Percent } from "lucide-react";
import { publisherInfo, monthlyEarnings, revenueByContentType } from "@/data/publisherMockData";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";
import StatCard from "./StatCard";

export default function PublisherDashboard() {
  return (
    <div className="space-y-6">
         <div>
        <h1 className="text-3xl font-heading font-bold">Dashboard</h1>
        <p className="text-muted-foreground mt-1">Welcome back, {publisherInfo.name}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard title="Wallet Balance" value={`$${publisherInfo.walletBalance.toFixed(2)}`} icon={DollarSign} trend={9.8} />
        <StatCard title="Total Earnings" value={`$${publisherInfo.totalEarnings.toFixed(2)}`} icon={TrendingUp} subtitle="All time" />
        <StatCard title="Content Items" value={publisherInfo.totalContent.toString()} icon={Package} />
        <StatCard title="Unit Share" value={`${publisherInfo.unitShare}%`} icon={Percent} trend={1.2} subtitle="Of total platform" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-4">Earnings Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyEarnings}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" stroke="hsl(var(--muted-foreground))" fontSize={12} />
              <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickFormatter={(v) => `$${v}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontFamily: "var(--font-body)",
                }}
                formatter={(value: number) => [`$${value.toFixed(2)}`, "Earnings"]}
              />
              <Line type="monotone" dataKey="earnings" stroke="hsl(var(--primary))" strokeWidth={2.5} dot={{ fill: "hsl(var(--primary))", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card rounded-xl p-6">
          <h3 className="font-heading font-semibold mb-4">Revenue by Type</h3>
          <ResponsiveContainer width="100%" height={240}>
            <PieChart>
              <Pie data={revenueByContentType} cx="50%" cy="50%" innerRadius={60} outerRadius={90} dataKey="value" paddingAngle={3}>
                {revenueByContentType.map((entry, index) => (
                  <Cell key={index} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
                formatter={(value: number) => [`${value}%`, "Share"]}
              />
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
    </div>
  );
}
