import React, { useMemo, useState } from 'react';
import { JourneyFlow } from '../../types';
import * as d3 from 'd3';

interface JourneysSankeyProps {
  journey?: JourneyFlow;
}

const JourneysSankey: React.FC<JourneysSankeyProps> = ({ journey }) => {
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: any } | null>(null);

  if (!journey) return <div className="h-64 flex items-center justify-center text-slate-500">No Journey Data</div>;

  const width = 800;
  const height = 240;
  const nodeWidth = 100;
  const gap = (width - (journey.stages.length * nodeWidth)) / (journey.stages.length - 1);

  // Calculate coordinates for nodes
  const nodes = useMemo(() => {
    const maxValue = Math.max(...journey.stages.map(s => s.value));
    
    return journey.stages.map((stage, index) => {
      const x = index * (nodeWidth + gap);
      // Scale height relative to max value, centered vertically, ensure min height for visibility
      const h = Math.max((stage.value / maxValue) * (height * 0.7), 40); 
      const y = (height - h) / 2;
      return { ...stage, x, y, h, maxH: h };
    });
  }, [journey, gap]);

  // Create smooth paths between nodes
  const links = useMemo(() => {
    const paths = [];
    for (let i = 0; i < nodes.length - 1; i++) {
      const source = nodes[i];
      const target = nodes[i + 1];

      // We want to connect the right side of source to left side of target
      const sourceYCenter = source.y + source.h / 2;
      const targetYCenter = target.y + target.h / 2;

      // The flow should 'shrink' towards the target size
      const linkGenerator = d3.linkHorizontal()
        .x((d: any) => d.x)
        .y((d: any) => d.y);
        
      const pathData = linkGenerator({
        source: { x: source.x + nodeWidth, y: sourceYCenter },
        target: { x: target.x, y: targetYCenter }
      });

      // Calculate midpoint for label positioning
      const midX = (source.x + nodeWidth + target.x) / 2;
      const midY = (sourceYCenter + targetYCenter) / 2;

      paths.push({ 
        d: pathData, 
        sourceValue: source.value, 
        targetValue: target.value,
        dropoff: source.dropoff,
        midX,
        midY
      });
    }
    return paths;
  }, [nodes]);

  return (
    <div className="w-full bg-slate-900/50 rounded-3xl border border-white/5 p-6 backdrop-blur-sm relative group/container">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-white font-semibold flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
          Journey Flow
        </h3>
        <span className="text-xs text-slate-400 bg-slate-800/50 px-2 py-1 rounded-lg border border-white/5">
          Live View
        </span>
      </div>

      <div className="relative w-full overflow-x-auto no-scrollbar pb-2">
        <div style={{ width: '100%', minWidth: '800px' }} className="relative">
            <svg width="100%" height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
            {/* Defs for gradients */}
            <defs>
                <linearGradient id="linkGradient" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#6366f1" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
                </linearGradient>
            </defs>

            {/* Links (Paths) */}
            {links.map((link, i) => (
                <g key={`link-${i}`}>
                {/* Thick semi-transparent path representing flow volume */}
                <path 
                    d={link.d || ''} 
                    fill="none" 
                    stroke="url(#linkGradient)" 
                    strokeWidth={Math.max(link.targetValue / 10, 2)} 
                    className="transition-all duration-500"
                />
                
                {/* Dropoff indicator on the link itself */}
                {link.dropoff > 0 && (
                    <g transform={`translate(${link.midX}, ${link.midY})`}>
                        <rect 
                            x="-24" y="-11" 
                            width="48" height="22" 
                            rx="11" 
                            className="fill-slate-950 stroke-red-500/20 stroke-1 shadow-sm" 
                        />
                        <text 
                            textAnchor="middle" 
                            dy="4" 
                            className="fill-red-400 text-[10px] font-bold font-mono"
                        >
                        -{link.dropoff}%
                        </text>
                    </g>
                )}
                </g>
            ))}

            {/* Nodes */}
            {nodes.map((node, i) => (
                <g 
                    key={node.id} 
                    className="group cursor-pointer"
                    onMouseEnter={() => setTooltip({ x: node.x + nodeWidth / 2, y: node.y, data: node })}
                    onMouseLeave={() => setTooltip(null)}
                >
                {/* Node Rect */}
                <rect
                    x={node.x}
                    y={node.y}
                    width={nodeWidth}
                    height={node.h}
                    rx={12}
                    className="fill-slate-800 stroke-indigo-500/30 stroke-1 transition-all duration-300 group-hover:fill-indigo-900/40 group-hover:stroke-indigo-400 group-hover:shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                />
                
                {/* Label */}
                <foreignObject x={node.x} y={node.y} width={nodeWidth} height={node.h}>
                    <div className="w-full h-full flex flex-col items-center justify-center pointer-events-none p-1">
                    <span className="text-[10px] uppercase tracking-wider text-slate-400 mb-1 text-center leading-tight">{node.name}</span>
                    <span className="text-sm font-bold text-white">{node.value}</span>
                    </div>
                </foreignObject>
                
                {/* Hover Effect Line */}
                <line 
                    x1={node.x + 20} y1={node.y + 2} 
                    x2={node.x + nodeWidth - 20} y2={node.y + 2} 
                    stroke="#818cf8" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    className="opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
                </g>
            ))}
            </svg>

            {/* Custom Tooltip Overlay */}
            {tooltip && (
                <div 
                    className="absolute z-50 pointer-events-none bg-slate-900/95 border border-white/10 rounded-xl p-3 shadow-2xl backdrop-blur-md w-48 transition-opacity duration-200 animate-in fade-in zoom-in-95"
                    style={{ 
                        left: tooltip.x, 
                        top: tooltip.y - 12, 
                        transform: 'translate(-50%, -100%)' 
                    }}
                >
                    <div className="flex items-center gap-2 mb-2 pb-2 border-b border-white/5">
                        <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                        <span className="text-white font-bold text-sm">{tooltip.data.name}</span>
                    </div>
                    
                    <div className="space-y-1.5">
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Total Users</span>
                            <span className="text-white font-mono font-medium">{tooltip.data.value.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between text-xs">
                            <span className="text-slate-400">Drop-off Rate</span>
                            <span className={`${tooltip.data.dropoff > 20 ? 'text-red-400' : 'text-emerald-400'} font-mono font-medium`}>
                                {tooltip.data.dropoff}%
                            </span>
                        </div>
                    </div>
                    
                    {/* Tiny arrow at bottom */}
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-full w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-t-[6px] border-t-slate-900/95"></div>
                </div>
            )}
        </div>
      </div>
    </div>
  );
};

export default JourneysSankey;