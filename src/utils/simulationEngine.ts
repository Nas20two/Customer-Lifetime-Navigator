import { CustomerSegment, ChurnSeries, LTVSeries } from '../types';
import { 
  segments as defaultSegments,
  journeys as defaultJourneys,
  recommendations as defaultRecommendations,
  snapshots as defaultSnapshots
} from '../mocks/customerData';

// --- Types for Raw Data (Simulating a CSV/Database export) ---
interface RawUser {
  id: string;
  joinDate: Date;
  lastLoginDate: Date;
  totalSpend: number; // For LTV
  monthlyBill: number; // For ARPU
  region: 'North America' | 'Europe' | 'APAC';
  orgSize: 'Small' | 'Medium' | 'Large';
  engagementScore: number;
}

// --- Helper: Random Normal Distribution (Box-Muller transform) ---
// Allows us to generate realistic "bell curve" data for spend/activity
const randomNormal = (mean: number, stdDev: number) => {
  let u = 0, v = 0;
  while (u === 0) u = Math.random();
  while (v === 0) v = Math.random();
  const num = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
  return num * stdDev + mean;
};

// --- 1. The Generator (Simulates Mockaroo) ---
const generateRawUsers = (count: number): RawUser[] => {
  const users: RawUser[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const isPowerUser = Math.random() > 0.7; // 30% are power users
    const isChurned = Math.random() > 0.85; // 15% have churned visually (stopped logging in)

    // Generate realistic tenure
    const daysSinceJoin = Math.floor(Math.random() * 730); // Up to 2 years
    const joinDate = new Date(now.getTime() - daysSinceJoin * 86400000);

    // Generate Last Login
    let daysSinceLogin = 0;
    if (isChurned) {
        daysSinceLogin = 30 + Math.floor(Math.random() * 90); // 30-120 days ago
    } else {
        daysSinceLogin = Math.floor(Math.random() * 7); // 0-7 days ago
    }
    const lastLoginDate = new Date(now.getTime() - daysSinceLogin * 86400000);

    // Generate Financials
    // Power users spend more
    const baseArpu = isPowerUser ? 150 : 30;
    const monthlyBill = Math.max(10, randomNormal(baseArpu, baseArpu * 0.2));
    
    // Total spend = Monthly Bill * Months Active (simplified)
    const monthsActive = Math.max(1, daysSinceJoin / 30);
    const totalSpend = monthlyBill * monthsActive;

    users.push({
      id: `u-${i}`,
      joinDate,
      lastLoginDate,
      totalSpend,
      monthlyBill,
      region: Math.random() > 0.5 ? 'North America' : Math.random() > 0.5 ? 'Europe' : 'APAC',
      orgSize: Math.random() > 0.6 ? 'Small' : Math.random() > 0.5 ? 'Medium' : 'Large',
      engagementScore: isPowerUser ? randomNormal(85, 10) : randomNormal(40, 20),
    });
  }
  return users;
};

// --- 2. The Aggregator (The Script you would write) ---
export const simulateNewData = () => {
  const rawUsers = generateRawUsers(5000); // Simulate 5000 rows

  // Define Logic to bucket users into our 3 Segments
  const now = new Date();
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);

  // Bucket 1: Power Users (High Spend + Active recently)
  const powerUsers = rawUsers.filter(u => u.monthlyBill > 100 && u.lastLoginDate > sevenDaysAgo);
  
  // Bucket 2: At Risk (Low Engagement OR joined recently but inactive)
  const atRiskUsers = rawUsers.filter(u => u.engagementScore < 30 && u.lastLoginDate > thirtyDaysAgo);

  // Bucket 3: Dormant (Inactive > 30 days)
  const dormantUsers = rawUsers.filter(u => u.lastLoginDate <= thirtyDaysAgo);

  // Helper to calculate segment metrics
  const calculateMetrics = (users: RawUser[], baseSegment: CustomerSegment): CustomerSegment => {
    if (users.length === 0) return baseSegment;

    const totalCustomers = users.length;
    const totalLTV = users.reduce((sum, u) => sum + u.totalSpend, 0);
    const totalARPU = users.reduce((sum, u) => sum + u.monthlyBill, 0);
    
    const avgLTV = totalLTV / totalCustomers;
    const avgARPU = totalARPU / totalCustomers;

    // Simulate CAC (usually external data, but we'll randomize slightly based on segment type)
    const cac = baseSegment.cac * (0.9 + Math.random() * 0.2); 

    // Calculate Expansion (Randomized for demo)
    const expansion = baseSegment.id === 'seg-001' ? 0.02 + Math.random() * 0.03 : 0;

    return {
      ...baseSegment,
      totalCustomers,
      averageLifetimeValue: Math.round(avgLTV),
      arpu: Math.round(avgARPU),
      cac: Math.round(cac),
      expansionRate: expansion,
    };
  };

  const newSegments = [
    calculateMetrics(powerUsers, defaultSegments[0]),
    calculateMetrics(atRiskUsers, defaultSegments[1]),
    calculateMetrics(dormantUsers, defaultSegments[2]),
  ];

  const newChurnSeries: ChurnSeries[] = newSegments.map(seg => ({
    segmentId: seg.id,
    points: [
      { month: 'Jan', probability: Math.random() * 0.2 },
      { month: 'Feb', probability: Math.random() * 0.2 },
      { month: 'Mar', probability: Math.random() * 0.2 },
      { month: 'Apr', probability: Math.random() * 0.2 },
      { month: 'May', probability: Math.random() * 0.2 },
      { month: 'Jun', probability: seg.churnRisk === 'high' ? 0.6 + Math.random() * 0.2 : 0.05 + Math.random() * 0.05 },
    ]
  }));

  const newLtvSeries: LTVSeries[] = newSegments.map(seg => ({
    segmentId: seg.id,
    points: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((m, i) => ({
        month: m,
        value: Math.round(seg.averageLifetimeValue * (0.8 + (i * 0.05))) // Slight upward trend
    }))
  }));

  return {
    segments: newSegments,
    churnSeries: newChurnSeries,
    ltvSeries: newLtvSeries,
    // Keep static for demo as they are qualitative
    journeys: defaultJourneys,
    recommendations: defaultRecommendations,
    snapshots: defaultSnapshots,
  };
};
