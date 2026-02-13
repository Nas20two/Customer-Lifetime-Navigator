import React, { useState } from 'react';
import { CustomerSegment } from '../../types';
import { Users, AlertTriangle, Filter, Building2, Globe2 } from 'lucide-react';

interface SegmentListProps {
  segments: CustomerSegment[];
  selectedSegmentId: string;
  onSelect: (id: string) => void;
}

const SegmentList: React.FC<SegmentListProps> = ({ segments, selectedSegmentId, onSelect }) => {
  const [riskFilter, setRiskFilter] = useState<string>('all');
  const [sizeFilter, setSizeFilter] = useState<string>('all');

  const filteredSegments = segments.filter((s) => {
    if (riskFilter !== 'all' && s.churnRisk !== riskFilter) return false;
    if (sizeFilter !== 'all' && s.orgSize !== sizeFilter) return false;
    return true;
  });

  return (
    <div className="flex flex-col gap-4">
      {/* Filters Toolbar */}
      <div className="flex items-center gap-3 overflow-x-auto pb-2 px-1 no-scrollbar">
        <div className="flex items-center gap-2 text-slate-400 mr-2">
            <Filter size={14} />
            <span className="text-xs font-semibold uppercase tracking-wider">Filters:</span>
        </div>

        {/* Risk Filter */}
        <div className="relative group">
            <select
                value={riskFilter}
                onChange={(e) => setRiskFilter(e.target.value)}
                className="appearance-none bg-slate-900 border border-indigo-500/20 hover:border-indigo-500/50 text-slate-300 text-xs font-medium rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer shadow-sm"
            >
                <option value="all">Any Risk</option>
                <option value="low">Low Risk</option>
                <option value="medium">Medium Risk</option>
                <option value="high">High Risk</option>
            </select>
            <AlertTriangle size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>

        {/* Org Size Filter */}
        <div className="relative group">
            <select
                value={sizeFilter}
                onChange={(e) => setSizeFilter(e.target.value)}
                className="appearance-none bg-slate-900 border border-indigo-500/20 hover:border-indigo-500/50 text-slate-300 text-xs font-medium rounded-lg py-2 pl-3 pr-8 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer shadow-sm"
            >
                <option value="all">Any Size</option>
                <option value="Small">Small Org</option>
                <option value="Medium">Medium Org</option>
                <option value="Large">Large Org</option>
            </select>
            <Building2 size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none" />
        </div>

        {/* Result Count Badge */}
        <span className="ml-auto text-xs text-slate-500 font-mono bg-slate-900/50 px-2 py-1 rounded-md border border-white/5">
            {filteredSegments.length} matches
        </span>
      </div>

      {/* Filtered List */}
      <div className="flex gap-4 overflow-x-auto pb-6 pt-2 px-1 snap-x no-scrollbar min-h-[200px]">
        {filteredSegments.length === 0 ? (
            <div className="w-full flex flex-col items-center justify-center text-slate-500 border-2 border-dashed border-slate-800 rounded-2xl h-48 bg-slate-900/20">
                <Filter size={24} className="mb-2 opacity-50" />
                <p className="text-sm">No segments match your filters</p>
                <button 
                    onClick={() => { setRiskFilter('all'); setSizeFilter('all'); }}
                    className="mt-3 text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
                >
                    Clear all filters
                </button>
            </div>
        ) : (
            filteredSegments.map((segment) => {
                const isSelected = selectedSegmentId === segment.id;
                
                return (
                <button
                    key={segment.id}
                    onClick={() => onSelect(segment.id)}
                    className={`
                    relative flex-shrink-0 w-64 p-5 rounded-2xl border text-left transition-all duration-300 snap-start
                    ${isSelected 
                        ? 'bg-indigo-500/10 ring-2 ring-indigo-500/50 border-transparent shadow-xl shadow-indigo-900/20 scale-[1.02] z-10' 
                        : 'bg-slate-900/40 border-slate-800 hover:border-indigo-500/30 hover:bg-slate-800/50'
                    }
                    `}
                >
                    <div className="flex items-start justify-between mb-4">
                        <div className={`p-2 rounded-lg ${isSelected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-slate-800 text-slate-400'}`}>
                            {segment.churnRisk === 'high' ? <AlertTriangle size={20} /> : <Users size={20} />}
                        </div>
                        <span className={`text-[10px] font-bold uppercase tracking-wider py-1 px-2 rounded-full border ${
                            segment.churnRisk === 'low' ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10' :
                            segment.churnRisk === 'medium' ? 'border-amber-500/30 text-amber-400 bg-amber-500/10' :
                            'border-red-500/30 text-red-400 bg-red-500/10'
                        }`}>
                            {segment.churnRisk} Risk
                        </span>
                    </div>
                    
                    <h3 className="text-lg font-bold text-white mb-1">{segment.name}</h3>
                    <p className="text-xs text-slate-400 mb-4 line-clamp-2 h-8 leading-relaxed">{segment.description}</p>
                    
                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 gap-y-3 gap-x-2 pt-4 border-t border-white/5">
                        <div>
                            <p className="text-[10px] uppercase text-slate-500 tracking-wider font-semibold">LTV</p>
                            <p className="text-sm font-bold text-slate-200">${segment.averageLifetimeValue}</p>
                        </div>
                        <div>
                            <p className="text-[10px] uppercase text-slate-500 tracking-wider font-semibold">Size</p>
                            <p className="text-sm font-bold text-slate-200">{segment.totalCustomers.toLocaleString()}</p>
                        </div>
                        
                        {/* New Metadata Display */}
                        <div className="col-span-2 flex items-center gap-2 pt-1">
                             <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                                <Building2 size={10} />
                                {segment.orgSize}
                             </div>
                             <div className="flex items-center gap-1 text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded border border-slate-700">
                                <Globe2 size={10} />
                                {segment.region}
                             </div>
                        </div>
                    </div>
                </button>
                );
            })
        )}
      </div>
    </div>
  );
};

export default SegmentList;