export interface CustomerSegment {
  id: string;
  name: string;
  description: string;
  totalCustomers: number;
  averageLifetimeValue: number; // Projected LTV
  cac: number; // Customer Acquisition Cost
  arpu: number; // Average Revenue Per User
  expansionRate: number; // Monthly expansion revenue % (upsells/cross-sells)
  churnRisk: 'low' | 'medium' | 'high';
  color: string;
  orgSize: 'Small' | 'Medium' | 'Large';
  region: 'North America' | 'Europe' | 'APAC';
}

export interface ChurnDataPoint {
  month: string;
  probability: number; // 0.0 to 1.0
}

export interface ChurnSeries {
  segmentId: string;
  points: ChurnDataPoint[];
}

export interface LTVDataPoint {
  month: string;
  value: number; // Dollar amount
}

export interface LTVSeries {
  segmentId: string;
  points: LTVDataPoint[];
}

export interface JourneyStage {
  id: string;
  name: string;
  value: number; // Number of users or conversion rate
  dropoff: number; // Percentage dropping off
}

export interface JourneyFlow {
  segmentId: string;
  stages: JourneyStage[];
}

export interface Touchpoint {
  id: string;
  name: string;
  engagementScore: number; // 0 to 100
  category: 'email' | 'app' | 'web' | 'support';
}

export interface JourneySnapshot {
  segmentId: string;
  recentTouchpoints: Touchpoint[];
}

export interface Recommendation {
  segmentId: string;
  title: string;
  description: string;
  projectedLift: number; // Percentage lift in retention or LTV
  actionType: 'campaign' | 'feature' | 'discount';
}