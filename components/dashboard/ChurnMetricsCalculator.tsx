import React, { useState } from 'react';
import { CustomerSegment, ChurnSeries } from '../../types';
import { Calculator, ChevronDown, Info } from 'lucide-react';

interface ChurnMetricsCalculatorProps {
  segment: CustomerSegment;
  churnSeries: ChurnSeries;
}

type MetricType = 'customer_churn' | 'gross_mrr_churn' | 'net_mrr_churn';

const ChurnMetricsCalculator: React.FC<ChurnMetricsCalculatorProps> = ({ segment, churnSeries }) => {
  const [selectedMetric, setSelectedMetric] = useState<MetricType>('customer_churn');

  // Logic to pull/calculate the data
  const currentProbability = churnSeries.points[churnSeries.points.length - 1]?.probability || 0;
  
  // 1. Customer Churn Rate (Basic logo churn)
  const customerChurnRate = currentProbability;

  // 2. Gross MRR Churn Rate 
  const grossMrrChurnRate = currentProbability;

  // 3. Net MRR Churn Rate = (Churn MRR - Expansion MRR) / Total MRR
  const netMrrChurnRate = grossMrrChurnRate - segment.expansionRate;

  // Helper to format percentage
  const formatPct = (val: number) => `${(val * 100).toFixed(2)}%`;

  const renderContent = () => {
    switch (selectedMetric) {
      case 'customer_churn':
        return {
          label: 'Customer Churn Rate',
          value: formatPct(customerChurnRate),
          formula: '(Churned Customers / Total Customers)',
          desc: 'The percentage of customers who cancelled their subscription during the period. Also known as "Logo Churn".',
          isGood: customerChurnRate < 0.05,
          color: customerChurnRate < 0.05 ? 'text-emerald-400' : 'text-red-400'
        };
      case 'gross_mrr_churn':
        return {
          label: 'Gross MRR Churn Rate',
          value: formatPct(grossMrrChurnRate),
          formula: '(Churned MRR / Total MRR)',
          desc: 'The percentage of revenue lost due to cancellations and downgrades, excluding any expansion revenue.',
          isGood: grossMrrChurnRate < 0.02,
          color: grossMrrChurnRate < 0.02 ? 'text-emerald-400' : 'text-red-400'
        };
      case 'net_mrr_churn':
        const isNegativeChurn = netMrrChurnRate < 0;
        return {
          label: 'Net MRR Churn Rate',
          value: formatPct(netMrrChurnRate),
          formula: '(Gross MRR Churn - Expansion MRR) / Total MRR',
          desc: isNegativeChurn 
            ? 'Fantastic! You have "Net Negative Churn". Expansion revenue from existing customers exceeds revenue lost from churn.'
            : 'The net percentage of revenue lost after accounting for upsells and cross-sells.',
          isGood: isNegativeChurn,
          color: isNegativeChurn ? 'text-emerald-400' : 'text-amber-400'
        };
      default:
        return { label: '', value: '', formula: '', desc: '', isGood: false, color: '' };
    }
  };

  const content = renderContent();

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-6 shadow-lg h-full flex flex-col">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
            <Calculator size={18} />
        </div>
        <div>
            <h3 className="text-white font-bold">The Metrics for Churn</h3>
            <p className="text-xs text-slate-400 font-medium">Calculator & Definitions</p>
        </div>
      </div>

      {/* Dropdown Selector */}
      <div className="relative mb-6">
        <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value as MetricType)}
            className="w-full appearance-none bg-slate-900 border border-indigo-500/20 text-slate-300 text-sm font-medium rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500 hover:border-indigo-500/40 transition-colors cursor-pointer"
        >
            <option value="customer_churn">Customer Churn Rate</option>
            <option value="gross_mrr_churn">Gross MRR Churn Rate</option>
            <option value="net_mrr_churn">Net MRR Churn Rate</option>
        </select>
        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
      </div>

      {/* Content Display */}
      <div className="flex-1 flex flex-col justify-center bg-slate-800/30 rounded-xl p-6 border border-white/5 relative overflow-hidden">
        
        <div className={`text-4xl font-extrabold mb-2 ${content.color}`}>
            {content.value}
        </div>
        
        <div className="text-xs font-mono text-slate-400 mb-4 bg-slate-900 inline-block px-2 py-1 rounded border border-slate-700 self-start">
            Formula: {content.formula}
        </div>

        <p className="text-sm text-slate-300 leading-relaxed">
            {content.desc}
        </p>

        {/* Status Indicator */}
        <div className={`mt-4 flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${content.isGood ? 'text-emerald-400' : 'text-amber-400'}`}>
            <Info size={14} />
            {content.isGood ? 'Healthy Metric' : 'Needs Attention'}
        </div>
      </div>
    </div>
  );
};

export default ChurnMetricsCalculator;