import React from 'react';
import { JourneySnapshot } from '../../types';
import { Mail, Smartphone, Globe, Headphones, Activity } from 'lucide-react';

interface JourneysSnapshotProps {
  snapshot?: JourneySnapshot;
}

const getIcon = (category: string) => {
  switch (category) {
    case 'email': return <Mail size={14} />;
    case 'app': return <Smartphone size={14} />;
    case 'web': return <Globe size={14} />;
    case 'support': return <Headphones size={14} />;
    default: return <Activity size={14} />;
  }
};

const JourneysSnapshot: React.FC<JourneysSnapshotProps> = ({ snapshot }) => {
  if (!snapshot) return null;

  return (
    <div className="bg-slate-900/50 rounded-3xl border border-white/5 p-6 backdrop-blur-sm flex flex-col h-full">
      <h3 className="text-white font-semibold mb-4 flex items-center justify-between">
        <span>Recent Engagement</span>
        <Activity size={16} className="text-slate-500" />
      </h3>

      <div className="space-y-4">
        {snapshot.recentTouchpoints.map((tp) => (
          <div key={tp.id} className="group">
            <div className="flex justify-between items-center mb-2">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg bg-slate-800 text-slate-400 group-hover:bg-slate-700 group-hover:text-white transition-colors`}>
                  {getIcon(tp.category)}
                </div>
                <div>
                  <p className="text-sm text-slate-200 font-medium">{tp.name}</p>
                  <p className="text-[10px] text-slate-500 uppercase">{tp.category}</p>
                </div>
              </div>
              <span className="text-sm font-mono font-bold text-slate-300">{tp.engagementScore}</span>
            </div>
            
            {/* Progress Bar */}
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div 
                className={`h-full rounded-full transition-all duration-1000 ${
                  tp.engagementScore > 80 ? 'bg-emerald-500' : 
                  tp.engagementScore > 50 ? 'bg-indigo-500' : 'bg-slate-600'
                }`}
                style={{ width: `${tp.engagementScore}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      
      <button className="mt-auto pt-6 text-xs text-center text-slate-400 hover:text-white transition-colors w-full">
        View full history
      </button>
    </div>
  );
};

export default JourneysSnapshot;