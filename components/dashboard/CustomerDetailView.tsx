import React, { useState } from 'react';
import { X, Calendar, TrendingUp, DollarSign, Activity } from 'lucide-react';
import { Customer } from '../../types';

interface Props {
  segmentId: string;
  segmentName: string;
  customers: Customer[];
  onClose: () => void;
}

export default function CustomerDetailView({ segmentId, segmentName, customers, onClose }: Props) {
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(customers[0] || null);

  const statusColors = {
    active: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    churned: 'bg-red-500/20 text-red-300 border-red-500/30',
    at_risk: 'bg-amber-500/20 text-amber-300 border-amber-500/30'
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div>
            <h2 className="text-2xl font-semibold text-white">{segmentName}</h2>
            <p className="text-sm text-slate-400 mt-1">{customers.length} customers</p>
          </div>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          
          {/* Customer List */}
          <div className="w-80 border-r border-slate-700 overflow-y-auto">
            {customers.map((customer) => (
              <button
                key={customer.id}
                onClick={() => setSelectedCustomer(customer)}
                className={`w-full p-4 border-b border-slate-800 hover:bg-slate-800/50 transition-colors text-left ${
                  selectedCustomer?.id === customer.id ? 'bg-slate-800' : ''
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">{customer.name}</p>
                    <p className="text-xs text-slate-400 truncate">{customer.email}</p>
                  </div>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium border ${statusColors[customer.status]}`}>
                    {customer.status}
                  </span>
                </div>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center gap-1">
                    <DollarSign size={12} />
                    ${customer.ltv.toLocaleString(undefined, {maximumFractionDigits: 0})}
                  </span>
                  <span className="flex items-center gap-1">
                    <Activity size={12} />
                    {customer.touchpoints.length} events
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Customer Timeline */}
          <div className="flex-1 overflow-y-auto p-6">
            {selectedCustomer ? (
              <div>
                <div className="mb-6">
                  <h3 className="text-xl font-semibold text-white mb-2">{selectedCustomer.name}</h3>
                  <div className="flex items-center gap-4 text-sm text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={14} />
                      Joined {new Date(selectedCustomer.signupDate).toLocaleDateString()}
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp size={14} />
                      LTV: ${selectedCustomer.ltv.toLocaleString(undefined, {maximumFractionDigits: 0})}
                    </span>
                  </div>
                </div>

                {/* Journey Timeline */}
                <div className="space-y-4">
                  <h4 className="text-sm font-semibold text-slate-300 uppercase tracking-wider">Journey Timeline</h4>
                  <div className="relative border-l-2 border-slate-700 pl-6 space-y-6">
                    {selectedCustomer.touchpoints.map((touchpoint, idx) => (
                      <div key={idx} className="relative">
                        <div className="absolute -left-[27px] w-4 h-4 bg-indigo-500 rounded-full border-4 border-slate-900" />
                        <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-white">{touchpoint.action}</span>
                            <span className="text-xs text-slate-400">
                              {new Date(touchpoint.date).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-400">
                            <span className="px-2 py-1 bg-slate-700/50 rounded">
                              {touchpoint.channel}
                            </span>
                            {touchpoint.outcome && (
                              <span className="text-emerald-400">→ {touchpoint.outcome}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-500">
                Select a customer to view their journey
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
