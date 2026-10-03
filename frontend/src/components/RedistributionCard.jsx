import React from 'react';
import { RefreshCw, ArrowRight, ShieldCheck, CheckCircle2, XCircle, Building2 } from 'lucide-react';

export const RedistributionCard = ({ opportunity, onApprove, onReject }) => {
  if (!opportunity) return null;

  const isApproved = opportunity.status === 'APPROVED';
  const isRejected = opportunity.status === 'REJECTED';

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
      isApproved ? 'bg-emerald-50/70 border-emerald-300' :
      isRejected ? 'bg-slate-100 border-slate-300 opacity-60' :
      'bg-white border-slate-200 shadow-md hover:shadow-lg'
    }`}>
      
      <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
        <div className="flex items-center space-x-2">
          <RefreshCw className="w-5 h-5 text-setu-600" />
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
            NETWORK REDISTRIBUTION OPPORTUNITY #{opportunity.id}
          </span>
        </div>

        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full border ${
          isApproved ? 'bg-emerald-200 text-emerald-900 border-emerald-300' :
          isRejected ? 'bg-slate-200 text-slate-700 border-slate-300' :
          'bg-amber-100 text-amber-900 border-amber-300'
        }`}>
          {opportunity.status}
        </span>
      </div>

      {/* Transfer Flow Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-center bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 text-xs">
        
        {/* Source */}
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">SOURCE (SURPLUS)</span>
          <strong className="text-sm font-bold text-slate-900 block mt-0.5">{opportunity.source_hospital_name}</strong>
          <span className="text-emerald-700 font-semibold text-xs mt-1 block">
            Surplus Available: {opportunity.available_quantity} {opportunity.unit}
          </span>
        </div>

        {/* Transfer Arrow */}
        <div className="text-center flex flex-col items-center justify-center my-1 md:my-0">
          <span className="text-[10px] font-bold text-setu-700 bg-setu-50 px-2 py-0.5 rounded border border-setu-200 mb-1">
            Transfer {opportunity.required_quantity} {opportunity.unit} of {opportunity.resource}
          </span>
          <ArrowRight className="w-5 h-5 text-setu-600 hidden md:block" />
        </div>

        {/* Target */}
        <div className="bg-white p-3 rounded-lg border border-slate-200">
          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">TARGET (DEFICIT)</span>
          <strong className="text-sm font-bold text-slate-900 block mt-0.5">{opportunity.target_hospital_name}</strong>
          <span className="text-red-600 font-semibold text-xs mt-1 block">
            Projected Deficit / Stockout Risk
          </span>
        </div>

      </div>

      {/* Human Approval Controls */}
      {opportunity.status === 'PROPOSED' && (
        <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
          <button
            onClick={() => onApprove(opportunity.id)}
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-1 cursor-pointer"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>[ Approve Stock Transfer ]</span>
          </button>
          <button
            onClick={() => onReject(opportunity.id)}
            className="bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs py-2 px-3 rounded-xl transition-colors cursor-pointer"
          >
            [ Reject ]
          </button>
        </div>
      )}

      {isApproved && (
        <div className="text-xs font-semibold text-emerald-800 bg-emerald-100/80 p-2 rounded-lg text-center border border-emerald-200">
          ✓ Stock transfer approved by Health Officer. Transit logistics initiated.
        </div>
      )}
    </div>
  );
};
