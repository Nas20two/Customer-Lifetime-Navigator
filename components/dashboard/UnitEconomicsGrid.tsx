import React from 'react';
import { CustomerSegment } from '../../types';
import { Scale, DollarSign, Clock, Activity, HelpCircle } from 'lucide-react';

interface UnitEconomicsGridProps {
  segment: CustomerSegment;
}

const MetricCard = ({ 
  label, 
  value, 
  subtext, 
  icon: Icon, 
  status = 'neutral',
  tooltip 
}: { 
  label: string; 
  value: string; 
  subtext: string; 
  icon: any; 
  status?: 'good' | 'warning' | 'bad' | 'neutral';
  tooltip?: string;
}) => {
  const statusColors = {
    good: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    warning: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    bad: 'text-red-400 bg-red-500/10 border-red-500/20',
    neutral: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-md border border-white/5 rounded-3xl p-5 flex flex-col relative group">
      <div className="flex justify-between items-start mb-2">
        <div className={`p-2 rounded-xl ${statusColors[status].split(' ')[1]} ${statusColors[status].split(' ')[0]}`}>
          <Icon size={20} />
        </div>
        {tooltip && (
          <div className="relative group/tooltip">
             <HelpCircle size={14} className="text-slate-600 cursor-help" />
             <div className="absolute right-0 top-6 w-48 bg-slate-800 text-slate-300 text-[10px] p-2 rounded shadow-xl border border-white/10 opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-50">
               {tooltip}
             </div>
          </div>
        )}
      </div>
      
      <span className="text-xs text-slate-400 font-medium uppercase tracking-wider mb-1">{label}</span>
      <span className={`text-2xl font-bold ${statusColors[status].split(' ')[0]}`}>{value}</span>
      <span className="text-[11px] text-slate-500 mt-2 border-t border-white/5 pt-2">{subtext}</span>
    </div>
  );
};

const UnitEconomicsGrid: React.FC<UnitEconomicsGridProps> = ({ segment }) => {
  const ltvCacRatio = segment.averageLifetimeValue / segment.cac;
  const paybackPeriod = segment.cac / segment.arpu;

  // SaaS Benchmarks logic
  const getLtvCacStatus = (ratio: number) => {
    if (ratio >= 3) return 'good';
    if (ratio >= 1.5) return 'warning';
    return 'bad';
  };

  const getPaybackStatus = (months: number) => {
    if (months <= 12) return 'good';
    if (months <= 18) return 'warning';
    return 'bad';
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {/* 1. LTV:CAC Ratio (The Golden Metric) */}
      <MetricCard 
        label="LTV : CAC Ratio"
        value={`${ltvCacRatio.toFixed(1)}x`}
        subtext={ltvCacRatio >= 3 ? "Healthy (Above 3x)" : "Needs Optimization (< 3x)"}
        icon={Scale}
        status={getLtvCacStatus(ltvCacRatio)}
        tooltip="Lifetime Value divided by Customer Acquisition Cost. A ratio > 3:1 is generally considered healthy for SaaS."
      />

      {/* 2. Payback Period (Time to Recover CAC) */}
      <MetricCard 
        label="CAC Payback"
        value={`${paybackPeriod.toFixed(1)} mo`}
        subtext={`Recover $${segment.cac} CAC`}
        icon={Clock}
        status={getPaybackStatus(paybackPeriod)}
        tooltip="The number of months it takes to earn back the cost of acquiring a customer (CAC / ARPU)."
      />

      {/* 3. ARPU (Revenue Velocity) */}
      <MetricCard 
        label="Monthly ARPU"
        value={`$${segment.arpu}`}
        subtext="Avg Revenue Per User"
        icon={DollarSign}
        status="neutral"
        tooltip="The average revenue generated per user per month."
      />

      {/* 4. Lifetime Value (The Ceiling) */}
      <MetricCard 
        label="Cust Lifetime Value"
        value={`$${segment.averageLifetimeValue.toLocaleString()}`}
        subtext="Projected total revenue"
        icon={Activity}
        status="neutral" // Usually relative, so neutral unless we have historical context
        tooltip="The total projected revenue from a single customer over their entire relationship."
      />
    </div>
  );
};

export default UnitEconomicsGrid;