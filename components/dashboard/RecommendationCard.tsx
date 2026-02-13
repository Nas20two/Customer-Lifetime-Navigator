import React from 'react';
import { Recommendation } from '../../types';
import { Sparkles, ArrowRight, Zap } from 'lucide-react';

interface RecommendationCardProps {
  recommendation?: Recommendation;
}

const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendation }) => {
  if (!recommendation) return null;

  return (
    <div className="relative group overflow-hidden rounded-2xl p-[2px] shadow-lg hover:shadow-indigo-500/20 transition-shadow">
      {/* Gradient Border Background */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 opacity-50 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Content Card */}
      <div className="relative bg-slate-900 rounded-[14px] p-6 h-full flex flex-col">
        <div className="flex items-center gap-2 mb-3">
            <div className="bg-gradient-to-br from-indigo-500 to-purple-600 w-8 h-8 rounded-full flex items-center justify-center shadow-lg shadow-indigo-500/30">
                <Sparkles size={16} className="text-white" />
            </div>
            <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">
                Top AI Play
            </span>
        </div>

        <h3 className="text-xl font-bold text-white mb-2 leading-tight">
            {recommendation.title}
        </h3>
        <p className="text-sm text-slate-400 mb-6 leading-relaxed">
            {recommendation.description}
        </p>

        <div className="mt-auto flex items-center justify-between border-t border-white/5 pt-4">
            <div className="flex flex-col">
                <span className="text-[10px] uppercase text-slate-500 font-bold">Projected Lift</span>
                <span className="text-lg font-bold text-emerald-400 flex items-center gap-1">
                    <Zap size={16} fill="currentColor" />
                    +{recommendation.projectedLift}%
                </span>
            </div>
            
            <button className="bg-white text-slate-900 px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-slate-200 transition-colors shadow-lg shadow-white/10">
                Activate
                <ArrowRight size={16} />
            </button>
        </div>
      </div>
    </div>
  );
};

export default RecommendationCard;