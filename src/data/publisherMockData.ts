export const monthlyEarnings = [
  { month: "Jul", earnings: 312, units: 1840 },
  { month: "Aug", earnings: 428, units: 2520 },
  { month: "Sep", earnings: 389, units: 2290 },
  { month: "Oct", earnings: 510, units: 3000 },
  { month: "Nov", earnings: 475, units: 2800 },
  { month: "Dec", earnings: 620, units: 3650 },
  { month: "Jan", earnings: 580, units: 3420 },
  { month: "Feb", earnings: 695, units: 4100 },
  { month: "Mar", earnings: 742, units: 4370 },
];

export const revenueByContentType = [
  { name: "Video", value: 42, fill: "hsl(var(--chart-1))" },
  { name: "eBook", value: 25, fill: "hsl(var(--chart-2))" },
  { name: "Lab Simulation", value: 18, fill: "hsl(var(--chart-3))" },
  { name: "Game", value: 10, fill: "hsl(var(--chart-4))" },
  { name: "Dals Module", value: 5, fill: "hsl(var(--chart-5))" },
];

export const payoutLedger = [
  { month: "Mar 2026", grossUnits: 4370, weightedUnits: 6555, grossRevenue: 892.40, platformFee: 133.86, tax: 37.93, netPayout: 720.61, status: "Pending" },
  { month: "Feb 2026", grossUnits: 4100, weightedUnits: 6150, grossRevenue: 838.20, platformFee: 125.73, tax: 35.62, netPayout: 676.85, status: "Paid" },
  { month: "Jan 2026", grossUnits: 3420, weightedUnits: 5130, grossRevenue: 699.60, platformFee: 104.94, tax: 29.73, netPayout: 564.93, status: "Paid" },
  { month: "Dec 2025", grossUnits: 3650, weightedUnits: 5475, grossRevenue: 746.80, platformFee: 112.02, tax: 31.74, netPayout: 603.04, status: "Paid" },
  { month: "Nov 2025", grossUnits: 2800, weightedUnits: 4200, grossRevenue: 572.60, platformFee: 85.89, tax: 24.34, netPayout: 462.37, status: "Paid" },
  { month: "Oct 2025", grossUnits: 3000, weightedUnits: 4500, grossRevenue: 613.50, platformFee: 92.03, tax: 26.07, netPayout: 495.40, status: "Paid" },
];

export const contentEngagement = [
  { name: "Entrepreneurship SB", type: "Video", units: 1240, trend: 12 },
  { name: "Longhorn Pre-Technical Studies Grade 9 Learner's B", type: "eBook", units: 890, trend: 8 },
  { name: "Leo Siki Ya kuzaliwa Kwa Mama", type: "Lab Simulation", units: 720, trend: -3 },
  { name: "Akili and the Magical Telescop", type: "Game", units: 540, trend: 22 },
  { name: "Sauti ya Nani", type: "Video", units: 480, trend: 5 },
  { name: "Matunda na Mboga Yanaotaje?", type: "Dals Module", units: 310, trend: 15 },
  { name: "Sehemu Mbalimbali Tofauti", type: "eBook", units: 290, trend: -1 },
  { name: "Tusikose Shoo!", type: "Video", units: 260, trend: 9 },
];

export const usageTrends = [
  { month: "Jul", video: 820, ebook: 410, lab: 320, game: 180, dals: 110 },
  { month: "Aug", video: 1100, ebook: 520, lab: 400, game: 290, dals: 210 },
  { month: "Sep", video: 980, ebook: 480, lab: 380, game: 250, dals: 200 },
  { month: "Oct", video: 1300, ebook: 560, lab: 500, game: 380, dals: 260 },
  { month: "Nov", video: 1180, ebook: 530, lab: 460, game: 340, dals: 290 },
  { month: "Dec", video: 1520, ebook: 680, lab: 600, game: 480, dals: 370 },
  { month: "Jan", video: 1400, ebook: 640, lab: 560, game: 440, dals: 380 },
  { month: "Feb", video: 1680, ebook: 750, lab: 680, game: 520, dals: 470 },
  { month: "Mar", video: 1800, ebook: 810, lab: 720, game: 540, dals: 500 },
];

export const receipts = [
  { id: "RCP-2026-03", month: "March 2026", date: "2026-03-01", amount: 720.61, status: "Pending", units: 6555 },
  { id: "RCP-2026-02", month: "February 2026", date: "2026-02-01", amount: 676.85, status: "Paid", units: 6150 },
  { id: "RCP-2026-01", month: "January 2026", date: "2026-01-01", amount: 564.93, status: "Paid", units: 5130 },
  { id: "RCP-2025-12", month: "December 2025", date: "2025-12-01", amount: 603.04, status: "Paid", units: 5475 },
  { id: "RCP-2025-11", month: "November 2025", date: "2025-11-01", amount: 462.37, status: "Paid", units: 4200 },
  { id: "RCP-2025-10", month: "October 2025", date: "2025-10-01", amount: 495.40, status: "Paid", units: 4500 },
  { id: "RCP-2025-09", month: "September 2025", date: "2025-09-01", amount: 389.00, status: "Paid", units: 3435 },
  { id: "RCP-2025-08", month: "August 2025", date: "2025-08-01", amount: 428.00, status: "Paid", units: 3780 },
];

export const publisherInfo = {
  name: "TechEd Publishing",
  platformFee: 15,
  taxRate: 5,
  currency: "USD",
  totalContent: 24,
  totalEarnings: 5762.18,
  walletBalance: 720.61,
  unitShare: 8.2,
};
