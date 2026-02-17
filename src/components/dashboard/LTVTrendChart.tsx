import type { FC } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { LTVSeries } from '../../types';
import { TrendingUp } from 'lucide-react';

interface LTVTrendChartProps {
  series?: LTVSeries;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl">
        <p className="text-slate-400 text-xs mb-1 font-medium">{label}</p>
        <p className="text-white font-bold text-sm">
          Avg LTV: ${payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

const LTVTrendChart: FC<LTVTrendChartProps> = ({ series }) => {
  if (!series) return <div className="h-full flex items-center justify-center text-slate-500 bg-slate-900/50 rounded-2xl border border-indigo-500/20">No LTV Data</div>;

  const data = series.points;
  const currentLTV = data[data.length - 1].value;
  const previousLTV = data[0].value;
  const growth = ((currentLTV - previousLTV) / previousLTV) * 100;
  
  return (
    <div className="bg-slate-900/50 backdrop-blur-sm border border-indigo-500/20 rounded-2xl p-6 shadow-lg h-full flex flex-col">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            Historical LTV
          </h3>
          <p className="text-xs text-slate-400 mt-1 font-medium">6-month trend analysis</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-extrabold text-white">
            ${currentLTV}
          </p>
          <p className={`text-[10px] uppercase tracking-wider font-bold flex items-center justify-end gap-1 ${growth >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
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
                <stop offset="5%" stopColor="#6366f1" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
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
              tickFormatter={(val) => `$${val}`}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#475569', strokeWidth: 1, strokeDasharray: '3 3' }} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#6366f1" 
              strokeWidth={2}
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