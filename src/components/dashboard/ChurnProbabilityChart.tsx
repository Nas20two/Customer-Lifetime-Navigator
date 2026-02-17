import type { FC } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { ChurnSeries } from '../../types';

interface ChurnProbabilityChartProps {
  series?: ChurnSeries;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-slate-400 text-xs mb-1 font-medium">{label}</p>
        <p className="text-white font-bold text-sm">
          Churn Prob: {(payload[0].value * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

const ChurnProbabilityChart: FC<ChurnProbabilityChartProps> = ({ series }) => {
  if (!series) return <div className="h-48 flex items-center justify-center text-slate-500 bg-slate-900/50 rounded-2xl border border-indigo-500/20">No Churn Data</div>;

  const data = series.points;
  const currentProb = data[data.length - 1].probability;
  const isHighRisk = currentProb > 0.5;

  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-6 shadow-lg">
      <div className="flex justify-between items-end mb-6">
        <div>
          <h3 className="text-white font-bold text-lg">Churn Probability</h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">6-month forecast model</p>
        </div>
        <div className="text-right">
          <p className={`text-3xl font-extrabold ${isHighRisk ? 'text-red-500' : 'text-emerald-400'}`}>
            {(currentProb * 100).toFixed(1)}%
          </p>
          <p className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Current Risk</p>
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
                <stop offset="5%" stopColor={isHighRisk ? "#ef4444" : "#10b981"} stopOpacity={0.2} />
                <stop offset="95%" stopColor={isHighRisk ? "#ef4444" : "#10b981"} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
            <XAxis 
              dataKey="month" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#64748b', fontSize: 11, fontWeight: 500 }} 
              tickFormatter={(val) => `${(val * 100).toFixed(0)}%`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Area 
              type="monotone" 
              dataKey="probability" 
              stroke={isHighRisk ? "#ef4444" : "#10b981"} 
              strokeWidth={2}
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