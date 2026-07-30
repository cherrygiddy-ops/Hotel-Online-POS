import { StatCard } from "@/components/admin/StatCard";
import {
  adminStats,
  monthlyRevenue,
  contentTypeDistribution,
  subscriptionBreakdown,
} from "@/lib/mock-data";
import { DollarSign, Users, BookOpen, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { useAdminStats } from "@/hooks/useAdminStats";


const COLORS = [
  "hsl(162, 63%, 41%)",
  "hsl(36, 95%, 55%)",
  "hsl(210, 100%, 56%)",
  "hsl(280, 65%, 60%)",
  "hsl(350, 70%, 55%)",
];

export default function AdminAnalyticsDashboard() {
  return (<></>)
}
