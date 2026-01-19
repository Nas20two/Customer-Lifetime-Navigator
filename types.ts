// Customer Detail Interfaces
export interface CustomerTouchpoint {
  date: string;
  action: string;
  channel: string;
  outcome?: string;
}

export interface Customer {
  id: string;
  name: string;
  email: string;
  signupDate: string;
  ltv: number;
  status: 'active' | 'churned' | 'at_risk';
  touchpoints: CustomerTouchpoint[];
}
