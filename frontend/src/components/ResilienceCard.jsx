import React from 'react';
import { ShieldCheck, AlertTriangle, Activity, Building2, CheckCircle2 } from 'lucide-react';

export const ResilienceCard = ({ resilience }) => {
  if (!resilience) return null;

  const score = resilience.resilience_score || 80;
  const state = resilience.overall_state || 'HEALTHY';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[10px] font-bold text-setu-600 uppercase tracking-wider bg-setu-50 px-2 py-0.5 rounded border border-setu-100">
            Operational Readiness Matrix
          </span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center space-x-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <span>Resource Resilience Card — {resilience.hospital_name}</span>
          </h3>
        </div>

        <div className="text-right">
          <span className="text-[10px] text-slate-400 uppercase tracking-wider block">Resilience Score</span>
          <div className="text-2xl font-black text-slate-900 flex items-center justify-end space-x-1">
            <span className={score >= 80 ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-red-600'}>
              {score}
            </span>
            <span className="text-xs text-slate-400 font-normal">/100</span>
          </div>
        </div>
      </div>

      {/* 6 Dimensions Matrix */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-4">
        {[
          { label: 'Critical Capacity', status: resilience.capacity_health },
          { label: 'Inventory Health', status: resilience.inventory_health },
          { label: 'Oxygen Reserves', status: resilience.oxygen_health },
          { label: 'Specialist Coverage', status: resilience.specialist_health },
          { label: 'Forecast Pressure', status: resilience.forecast_pressure },
          { label: 'Data Quality', status: resilience.data_freshness }
        ].map((dim, idx) => (
          <div key={idx} className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-center">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">{dim.label}</span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full inline-block ${
              dim.status === 'Healthy' || dim.status === 'Fresh' ? 'bg-emerald-100 text-emerald-800' :
              dim.status === 'Warning' || dim.status === 'Aging' ? 'bg-amber-100 text-amber-800' :
              'bg-red-100 text-red-800'
            }`}>
              {dim.status}
            </span>
          </div>
        ))}
      </div>

      {/* Overall Operational State */}
      <div className={`p-3 rounded-xl border text-xs flex items-center justify-between font-bold ${
        state === 'HEALTHY' ? 'bg-emerald-50 text-emerald-900 border-emerald-300' :
        state === 'ATTENTION REQUIRED' ? 'bg-amber-50 text-amber-900 border-amber-300' :
        'bg-red-50 text-red-900 border-red-300'
      }`}>
        <div className="flex items-center space-x-2">
          <Activity className="w-4 h-4" />
          <span>OVERALL OPERATIONAL STATE: {state}</span>
        </div>
        <span className="text-[11px] font-normal underline">Operational Readiness Indicator (Not clinical rating)</span>
      </div>

    </div>
  );
};
