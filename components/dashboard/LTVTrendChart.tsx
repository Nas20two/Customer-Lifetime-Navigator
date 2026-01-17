import React from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LTVSeries } from '../../types';
import { TrendingUp } from 'lucide-react';

interface LTVTrendChartProps {
  series?: LTVSeries;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-white/10 p-3 rounded-xl shadow-xl backdrop-blur-md">
        <p className="text-slate-400 text-xs mb-1">{label}</p>
        <p className="text-white font-bold text-sm">
          Avg LTV: ${payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const LTVTrendChart: React.FC<LTVTrendChartProps> = ({ series }) => {
  if (!series) return <div className="h-full flex items-center justify-center text-slate-500 bg-slate-900/30 rounded-3xl border border-dashed border-white/10">No LTV Data</div>;

  const data = series.points;
  const currentLTV = data[data.length - 1].value;
  const previousLTV = data[0].value;
  const growth = ((currentLTV - previousLTV) / previousLTV) * 100;
  
  return (
    <div className="bg-slate-900/50 rounded-3xl border border-white/5 p-6 backdrop-blur-sm h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-white font-semibold text-lg flex items-center gap-2">
            Historical LTV
          </h3>
          <p className="text-xs text-slate-400 mt-1">6-month trend analysis</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-white">
            ${currentLTV}
          </p>
          <p className={`text-[10px] uppercase tracking-wider font-medium flex items-center justify-end gap-1 ${growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
            <TrendingUp size={12} />
            {growth >= 0 ? '+' : ''}{growth.toFixed(1)}% Growth
          </p>
        </div>
      </div>

      <div className="flex-1 w-full min-h-[150px]">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorLtv" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#ffffff20', strokeWidth: 1 }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#818cf8" 
              strokeWidth={3}
              fillOpacity={1} 
              fill="url(#colorLtv)" 
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default LTVTrendChart;