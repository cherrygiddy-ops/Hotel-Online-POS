// Mock data for LoHo eLearning Platform dashboards

export const monthlyRevenue = [
  { month: "Jul", revenue: 12400, shaba: 3200, fedha: 4800, dhahabu: 4400 },
  { month: "Aug", revenue: 14200, shaba: 3600, fedha: 5200, dhahabu: 5400 },
  { month: "Sep", revenue: 13800, shaba: 3400, fedha: 5000, dhahabu: 5400 },
  { month: "Oct", revenue: 16500, shaba: 4000, fedha: 6000, dhahabu: 6500 },
  { month: "Nov", revenue: 18200, shaba: 4200, fedha: 6800, dhahabu: 7200 },
  { month: "Dec", revenue: 21000, shaba: 4800, fedha: 7600, dhahabu: 8600 },
  { month: "Jan", revenue: 19800, shaba: 4600, fedha: 7200, dhahabu: 8000 },
  { month: "Feb", revenue: 22400, shaba: 5000, fedha: 8200, dhahabu: 9200 },
  { month: "Mar", revenue: 24100, shaba: 5400, fedha: 8800, dhahabu: 9900 },
];

export const contentTypeDistribution = [
  { name: "eBook", value: 35, units: 12400 },
  { name: "Video", value: 28, units: 9800 },
  { name: "Lab Sim", value: 15, units: 5200 },
  { name: "Game", value: 12, units: 4100 },
  { name: "Dals", value: 10, units: 3500 },
];

export const topContent = [
  { title: "Intro to Data Science", type: "Video", units: 3420, engagement: 92 },
  { title: "Python Fundamentals", type: "eBook", units: 2890, engagement: 87 },
  { title: "Network Security Lab", type: "Lab Sim", units: 2340, engagement: 95 },
  { title: "Math Challenge", type: "Game", units: 1980, engagement: 78 },
  { title: "Cloud Architecture", type: "Video", units: 1740, engagement: 84 },
];

export const topPublishers = [
  { name: "TechEd Global", revenue: 8420, units: 14200, content: 42 },
  { name: "LearnHub Africa", revenue: 6890, units: 11800, content: 35 },
  { name: "Digital Academy", revenue: 5340, units: 9400, content: 28 },
  { name: "SkillForge", revenue: 4120, units: 7200, content: 22 },
  { name: "EduPrime", revenue: 3680, units: 6100, content: 18 },
];

export const subscriptionBreakdown = [
  { tier: "Shaba (Bronze)", count: 4200, revenue: 21000, percent: 22 },
  { tier: "Fedha (Silver)", count: 2800, revenue: 56000, percent: 36 },
  { tier: "Dhahabu (Gold)", count: 1600, revenue: 80000, percent: 42 },
];

// Partner mock data
export const partnerRevenue = [
  { month: "Jul", earned: 1840, referrals: 32 },
  { month: "Aug", earned: 2100, referrals: 38 },
  { month: "Sep", earned: 1960, referrals: 35 },
  { month: "Oct", earned: 2480, referrals: 44 },
  { month: "Nov", earned: 2720, referrals: 48 },
  { month: "Dec", earned: 3150, referrals: 56 },
  { month: "Jan", earned: 2940, referrals: 52 },
  { month: "Feb", earned: 3360, referrals: 60 },
  { month: "Mar", earned: 3620, referrals: 64 },
];

export const partnerContentEarnings = [
  { title: "Embedded: AI Basics", units: 1240, revenue: 620, type: "Video" },
  { title: "Embedded: Web Dev 101", units: 980, revenue: 490, type: "eBook" },
  { title: "Embedded: Cyber Lab", units: 760, revenue: 380, type: "Lab Sim" },
  { title: "Embedded: Math Games", units: 540, revenue: 270, type: "Game" },
];

export const partnerAgreement = {
  partnerType: "Type A - External Host",
  revenueSharePercent: 15,
  currentMonth: {
    grossRevenue: 3620,
    platformFee: 543,
    tax: 307.7,
    netEarnings: 2769.3,
  },
  previousMonth: {
    grossRevenue: 3360,
    platformFee: 504,
    tax: 285.6,
    netEarnings: 2570.4,
  },
};

export const adminStats = {
  totalRevenue: 24100,
  totalUsers: 8600,
  totalContent: 145,
  totalPublishers: 23,
  revenueGrowth: 7.6,
  userGrowth: 12.3,
};

export const partnerStats = {
  totalEarned: 3620,
  totalReferrals: 64,
  activeContent: 12,
  revenueShare: 15,
  earningGrowth: 7.7,
};
