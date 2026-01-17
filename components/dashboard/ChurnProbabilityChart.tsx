import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChurnSeries } from '../../types';

interface ChurnProbabilityChartProps {
  series?: ChurnSeries;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white font-bold text-sm">
          Churn Prob: {(payload[0].value * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const ChurnProbabilityChart: React.FC<ChurnProbabilityChartProps> = ({ series }) => {
  if (!series) return <div className="h-48 flex items-center justify-center text-slate-500">No Churn Data</div>;

  const data = series.points;
  const currentProb = data[data.length - 1].probability;
  const isHighRisk = currentProb > 0.5;

  return (
    <div className="bg-slate-900/50 rounded-3xl border border-white/5 p-6 backdrop-blur-sm">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-white font-semibold text-lg">Churn Probability</h3>
          <p className="text-xs text-slate-400 mt-1">6-month forecast model</p>
        </div>
        <div className="text-right">
          <p className={`text-2xl font-bold ${isHighRisk ? 'text-red-400' : 'text-emerald-400'}`}>
            {(currentProb * 100).toFixed(1)}%
          </p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider">Current Risk</p>
        </div>
      </div>

      <div className="h-48 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={isHighRisk ? "#f87171" : "#34d399"} stopOpacity={0.3} />
                <stop offset="95%" stopColor={isHighRisk ? "#f87171" : "#34d399"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#ffffff10" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 10 }} 
              tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
            <Area 
              type="monotone" 
              dataKey="probability" 
              stroke={isHighRisk ? "#f87171" : "#34d399"} 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorProb)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChurnProbabilityChart;