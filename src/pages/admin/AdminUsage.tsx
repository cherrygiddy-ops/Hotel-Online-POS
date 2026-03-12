
import { motion } from "framer-motion";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";

const usageTrend = [
  { month: "Jul", online: 8200, offline: 1400 },
  { month: "Aug", online: 9100, offline: 1600 },
  { month: "Sep", online: 8800, offline: 1500 },
  { month: "Oct", online: 10400, offline: 1900 },
  { month: "Nov", online: 11600, offline: 2100 },
  { month: "Dec", online: 13200, offline: 2400 },
  { month: "Jan", online: 12500, offline: 2200 },
  { month: "Feb", online: 14100, offline: 2600 },
  { month: "Mar", online: 15200, offline: 2800 },
];

const deviceData = [
  { name: "Mobile", value: 48 },
  { name: "Desktop", value: 34 },
  { name: "Tablet", value: 18 },
];

const COLORS = ["hsl(162,63%,41%)", "hsl(36,95%,55%)", "hsl(210,100%,56%)"];

export default function AdminUsage() {
  return (
    <DashboardLayout role="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-display">Usage Patterns</h1>
          <p className="text-muted-foreground">Online vs offline consumption and device breakdown</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="stat-card lg:col-span-2">
            <h3 className="text-lg font-semibold font-display mb-4">Online vs Offline</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={usageTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,90%)" />
                <XAxis dataKey="month" stroke="hsl(220,10%,46%)" fontSize={12} />
                <YAxis stroke="hsl(220,10%,46%)" fontSize={12} />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="online" stroke="hsl(162,63%,41%)" strokeWidth={2} dot={false} />
                <Line type="monotone" dataKey="offline" stroke="hsl(36,95%,55%)" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="stat-card">
            <h3 className="text-lg font-semibold font-display mb-4">Device Breakdown</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={deviceData} cx="50%" cy="50%" innerRadius={55} outerRadius={85} paddingAngle={4} dataKey="value">
                  {deviceData.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
                </Pie>
                <Tooltip formatter={(v: number) => `${v}%`} />
                <Legend iconSize={8} />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>
      </div>
    </DashboardLayout>
  );
}
