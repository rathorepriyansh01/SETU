import React from 'react';
import { AlertCircle, CheckCircle2, ShieldAlert, ArrowRight, Activity, Clock, MapPin, Sparkles } from 'lucide-react';

export const NearestVsSetuCard = ({ comparison }) => {
  if (!comparison || !comparison.nearest_hospital || !comparison.setu_recommendation) return null;

  const nearest = comparison.nearest_hospital;
  const setu = comparison.setu_recommendation;

  const isDifferent = nearest.name !== setu.name;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 mb-6">
      
      {/* Title */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-setu-600 bg-setu-50 px-2 py-0.5 rounded border border-setu-100">
            Hackathon Key Demo Moment
          </span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center space-x-2">
            <span>NEAREST VS SETU RECOMMENDATION</span>
          </h3>
        </div>
        <div className="bg-amber-50 text-amber-800 text-xs font-semibold px-2.5 py-1 rounded-lg border border-amber-200 flex items-center space-x-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Capacity-Aware Allocation</span>
        </div>
      </div>

      {/* Side by Side Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
        
        {/* Nearest Hospital Card */}
        <div className={`p-4 rounded-xl border transition-all ${
          isDifferent ? 'bg-amber-50/70 border-amber-200 text-slate-900' : 'bg-slate-50 border-slate-200'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-800 uppercase tracking-wider flex items-center">
              <MapPin className="w-3.5 h-3.5 mr-1 text-amber-600" />
              NEAREST HOSPITAL (Distance Baseline)
            </span>
            {isDifferent && (
              <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-1.5 py-0.5 rounded">
                High Overload Risk
              </span>
            )}
          </div>
          <strong className="text-base font-extrabold block text-slate-900 mb-2">{nearest.name}</strong>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between border-b border-amber-200/50 pb-1">
              <span>Distance:</span>
              <strong className="text-slate-900">{nearest.distance_km} km</strong>
            </div>
            <div className="flex justify-between border-b border-amber-200/50 pb-1">
              <span>ETA:</span>
              <strong>{nearest.eta_minutes} min</strong>
            </div>
            <div className="flex justify-between border-b border-amber-200/50 pb-1">
              <span>Free ICU Beds:</span>
              <strong className={nearest.icu_available <= 1 ? 'text-red-600 font-bold' : 'text-slate-900'}>
                {nearest.icu_available} free
              </strong>
            </div>
            <div className="flex justify-between border-b border-amber-200/50 pb-1">
              <span>Predicted 1h Load:</span>
              <strong className={nearest.predicted_load_percent >= 85 ? 'text-red-600 font-bold' : 'text-slate-900'}>
                {nearest.predicted_load_percent}%
              </strong>
            </div>
            <div className="flex justify-between">
              <span>Oxygen Level:</span>
              <strong className={nearest.oxygen_level < 50 ? 'text-amber-700' : 'text-slate-900'}>
                {Math.round(nearest.oxygen_level)}%
              </strong>
            </div>
          </div>
        </div>

        {/* SETU Recommended Hospital Card */}
        <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-300 text-slate-900 relative shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider flex items-center">
              <CheckCircle2 className="w-4 h-4 mr-1 text-emerald-600" />
              SETU RECOMMENDATION (Optimal Capacity)
            </span>
            <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded shadow-sm">
              RECOMMENDED
            </span>
          </div>
          <strong className="text-base font-extrabold block text-emerald-950 mb-2">{setu.name}</strong>

          <div className="space-y-1.5 text-xs text-slate-700">
            <div className="flex justify-between border-b border-emerald-200 pb-1">
              <span>Distance:</span>
              <strong className="text-slate-900">{setu.distance_km} km</strong>
            </div>
            <div className="flex justify-between border-b border-emerald-200 pb-1">
              <span>ETA:</span>
              <strong>{setu.eta_minutes} min</strong>
            </div>
            <div className="flex justify-between border-b border-emerald-200 pb-1">
              <span>Free ICU Beds:</span>
              <strong className="text-emerald-700 font-extrabold">{setu.icu_available} free</strong>
            </div>
            <div className="flex justify-between border-b border-emerald-200 pb-1">
              <span>Predicted 1h Load:</span>
              <strong className="text-emerald-700 font-bold">{setu.predicted_load_percent}% (Safe)</strong>
            </div>
            <div className="flex justify-between">
              <span>Oxygen Level:</span>
              <strong className="text-emerald-700 font-bold">{Math.round(setu.oxygen_level)}% (Available)</strong>
            </div>
          </div>
        </div>

      </div>

      {/* Decision Reasoning Box */}
      <div className="bg-slate-900 text-white p-3.5 rounded-xl text-xs flex items-start space-x-2">
        <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-amber-300 font-bold block mb-0.5">Decision Support Rationale:</strong>
          <p className="text-slate-300 leading-relaxed">{comparison.decision_reasoning}</p>
        </div>
      </div>

    </div>
  );
};
