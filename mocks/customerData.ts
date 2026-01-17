import { CustomerSegment, JourneyFlow, ChurnSeries, LTVSeries, Recommendation, JourneySnapshot } from '../types';

export const segments: CustomerSegment[] = [
  {
    id: 'seg-001',
    name: 'Power Users',
    description: 'High daily activity, >30 days retention',
    totalCustomers: 12450,
    averageLifetimeValue: 2400,
    cac: 450, // LTV:CAC = 5.3 (Excellent)
    arpu: 120, // 4 months to recover CAC
    expansionRate: 0.035, // 3.5% monthly expansion (Net Negative Churn!)
    churnRisk: 'low',
    color: '#10b981', // Emerald
    orgSize: 'Large',
    region: 'North America',
  },
  {
    id: 'seg-002',
    name: 'At-Risk New',
    description: 'Joined < 7 days, declining activity',
    totalCustomers: 4320,
    averageLifetimeValue: 120,
    cac: 300, // LTV:CAC = 0.4 (Unprofitable)
    arpu: 15, // 20 months to recover CAC (Too long)
    expansionRate: 0.0, // No expansion
    churnRisk: 'high',
    color: '#ef4444', // Red
    orgSize: 'Small',
    region: 'Europe',
  },
  {
    id: 'seg-003',
    name: 'Dormant',
    description: 'No activity in last 14 days',
    totalCustomers: 8900,
    averageLifetimeValue: 340,
    cac: 200, // LTV:CAC = 1.7 (Warning)
    arpu: 25, // 8 months to recover
    expansionRate: 0.005, // 0.5% very low expansion
    churnRisk: 'medium',
    color: '#f59e0b', // Amber
    orgSize: 'Large', 
    region: 'APAC',
  },
];

export const journeys: JourneyFlow[] = [
  {
    segmentId: 'seg-001',
    stages: [
      { id: 'acq', name: 'Acquisition', value: 1000, dropoff: 0 },
      { id: 'act', name: 'Activation', value: 950, dropoff: 5 },
      { id: 'eng', name: 'Engagement', value: 880, dropoff: 8 },
      { id: 'ret', name: 'Retention', value: 850, dropoff: 3 },
      { id: 'rev', name: 'Revenue', value: 800, dropoff: 5 },
    ],
  },
  {
    segmentId: 'seg-002',
    stages: [
      { id: 'acq', name: 'Acquisition', value: 1000, dropoff: 0 },
      { id: 'act', name: 'Activation', value: 600, dropoff: 40 },
      { id: 'eng', name: 'Engagement', value: 200, dropoff: 66 },
      { id: 'ret', name: 'Retention', value: 50, dropoff: 75 },
      { id: 'rev', name: 'Revenue', value: 10, dropoff: 80 },
    ],
  },
  {
    segmentId: 'seg-003',
    stages: [
      { id: 'acq', name: 'Acquisition', value: 1000, dropoff: 0 },
      { id: 'act', name: 'Activation', value: 800, dropoff: 20 },
      { id: 'eng', name: 'Engagement', value: 750, dropoff: 6 },
      { id: 'ret', name: 'Retention', value: 100, dropoff: 86 },
      { id: 'rev', name: 'Revenue', value: 80, dropoff: 20 },
    ],
  },
];

export const churnSeries: ChurnSeries[] = [
  {
    segmentId: 'seg-001',
    points: [
      { month: 'Jan', probability: 0.02 },
      { month: 'Feb', probability: 0.02 },
      { month: 'Mar', probability: 0.01 },
      { month: 'Apr', probability: 0.03 },
      { month: 'May', probability: 0.02 },
      { month: 'Jun', probability: 0.01 },
    ],
  },
  {
    segmentId: 'seg-002',
    points: [
      { month: 'Jan', probability: 0.15 },
      { month: 'Feb', probability: 0.25 },
      { month: 'Mar', probability: 0.40 },
      { month: 'Apr', probability: 0.55 },
      { month: 'May', probability: 0.65 },
      { month: 'Jun', probability: 0.72 },
    ],
  },
  {
    segmentId: 'seg-003',
    points: [
      { month: 'Jan', probability: 0.10 },
      { month: 'Feb', probability: 0.12 },
      { month: 'Mar', probability: 0.15 },
      { month: 'Apr', probability: 0.20 },
      { month: 'May', probability: 0.22 },
      { month: 'Jun', probability: 0.25 },
    ],
  },
];

export const ltvSeries: LTVSeries[] = [
  {
    segmentId: 'seg-001',
    points: [
      { month: 'Jan', value: 2100 },
      { month: 'Feb', value: 2150 },
      { month: 'Mar', value: 2200 },
      { month: 'Apr', value: 2300 },
      { month: 'May', value: 2350 },
      { month: 'Jun', value: 2400 },
    ],
  },
  {
    segmentId: 'seg-002',
    points: [
      { month: 'Jan', value: 90 },
      { month: 'Feb', value: 95 },
      { month: 'Mar', value: 105 },
      { month: 'Apr', value: 110 },
      { month: 'May', value: 115 },
      { month: 'Jun', value: 120 },
    ],
  },
  {
    segmentId: 'seg-003',
    points: [
      { month: 'Jan', value: 335 },
      { month: 'Feb', value: 338 },
      { month: 'Mar', value: 340 },
      { month: 'Apr', value: 339 },
      { month: 'May', value: 340 },
      { month: 'Jun', value: 340 },
    ],
  },
];

export const snapshots: JourneySnapshot[] = [
  {
    segmentId: 'seg-001',
    recentTouchpoints: [
      { id: 't1', name: 'Daily Streak Bonus', engagementScore: 95, category: 'app' },
      { id: 't2', name: 'Community Post', engagementScore: 88, category: 'web' },
      { id: 't3', name: 'Pro Feature Usage', engagementScore: 92, category: 'app' },
    ],
  },
  {
    segmentId: 'seg-002',
    recentTouchpoints: [
      { id: 't1', name: 'Onboarding Email 2', engagementScore: 20, category: 'email' },
      { id: 't2', name: 'Profile Setup', engagementScore: 45, category: 'app' },
      { id: 't3', name: 'Welcome Tour', engagementScore: 30, category: 'app' },
    ],
  },
  {
    segmentId: 'seg-003',
    recentTouchpoints: [
      { id: 't1', name: 'Re-engagement Email', engagementScore: 10, category: 'email' },
      { id: 't2', name: 'Push Notification', engagementScore: 5, category: 'app' },
      { id: 't3', name: 'Billing Update', engagementScore: 80, category: 'support' },
    ],
  },
];

export const recommendations: Recommendation[] = [
  {
    segmentId: 'seg-001',
    title: 'Increase ARPU',
    description: 'Segment has high LTV:CAC. Cross-sell "Enterprise" module to increase ARPU by 15%.',
    projectedLift: 15.0,
    actionType: 'feature',
  },
  {
    segmentId: 'seg-002',
    title: 'Fix "Leaky Bucket"',
    description: 'High Churn is destroying LTV. Implement "Day 1" concierge onboarding to reduce early dropoff.',
    projectedLift: 25.5,
    actionType: 'campaign',
  },
  {
    segmentId: 'seg-003',
    title: 'Reduce CAC Waste',
    description: 'LTV is low. Stop paid acquisition for this profile and move to organic-only channels.',
    projectedLift: 10.0,
    actionType: 'discount',
  },
];

export const customerDashboardData = {
  segments,
  journeys,
  churnSeries,
  ltvSeries,
  recommendations,
  snapshots,
};