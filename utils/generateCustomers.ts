import { CustomerSegment, Customer, CustomerTouchpoint } from '../types';

const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason', 'Isabella', 'William', 'James', 'Charlotte', 'Benjamin', 'Amelia', 'Lucas'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson'];

const channels = ['Email', 'In-App', 'Support', 'Webinar', 'Phone', 'Chat'];
const actions = [
  'Signed up for trial',
  'Completed onboarding',
  'Invited team member',
  'Upgraded to premium',
  'Contacted support',
  'Attended webinar',
  'Used advanced feature',
  'Requested demo',
  'Renewed subscription',
  'Downgraded plan',
  'Enabled integration',
  'Created first project',
  'Shared dashboard',
  'Customized settings'
];

export function generateCustomersForSegment(segment: CustomerSegment, count: number = 12): Customer[] {
  const customers: Customer[] = [];
  
  for (let i = 0; i < count; i++) {
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`;
    
    // Generate signup date within last 180 days
    const daysAgo = Math.floor(Math.random() * 180) + 30;
    const signupDate = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
    
    // LTV varies around segment average
    const ltv = segment.averageLifetimeValue * (0.7 + Math.random() * 0.6);
    
    // Status distribution based on segment churn risk
    const statusWeights = segment.churnRisk === 'low'
      ? { active: 0.85, at_risk: 0.12, churned: 0.03 }
      : segment.churnRisk === 'high'
      ? { active: 0.20, at_risk: 0.50, churned: 0.30 }
      : { active: 0.50, at_risk: 0.35, churned: 0.15 };
    
    const rand = Math.random();
    const status = rand < statusWeights.active 
      ? 'active' 
      : rand < statusWeights.active + statusWeights.at_risk 
      ? 'at_risk' 
      : 'churned';
    
    // Generate touchpoints (more for active users)
    const touchpointCount = status === 'active' 
      ? 5 + Math.floor(Math.random() * 10)
      : status === 'at_risk'
      ? 3 + Math.floor(Math.random() * 5)
      : 1 + Math.floor(Math.random() * 3);
    
    const touchpoints: CustomerTouchpoint[] = [];
    
    for (let j = 0; j < touchpointCount; j++) {
      const touchpointDaysAgo = Math.floor(Math.random() * daysAgo);
      const touchpointDate = new Date(Date.now() - touchpointDaysAgo * 24 * 60 * 60 * 1000).toISOString();
      
      touchpoints.push({
        date: touchpointDate,
        action: actions[Math.floor(Math.random() * actions.length)],
        channel: channels[Math.floor(Math.random() * channels.length)],
        outcome: Math.random() > 0.6 ? 'Converted' : Math.random() > 0.5 ? 'Engaged' : undefined
      });
    }
    
    // Sort touchpoints by date (most recent first)
    touchpoints.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    customers.push({
      id: `cust-${segment.id}-${i}`,
      name,
      email,
      signupDate,
      ltv,
      status,
      touchpoints
    });
  }
  
  return customers;
}
