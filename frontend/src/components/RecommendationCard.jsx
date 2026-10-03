import React from 'react';
import { CheckCircle2, AlertTriangle, ShieldCheck, Trophy } from 'lucide-react';

export const RecommendationCard = ({ recommendations = [], onAssignHospital, selectedHospitalId }) => {
  if (!recommendations || recommendations.length === 0) return null;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 mb-6">
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <span>SETU Top 3 Hospital Recommendations</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Deterministic multi-factor score: Distance + ICU + Oxygen + Specialist + Load</p>
        </div>
        <span className="text-[11px] font-bold bg-setu-50 text-setu-800 px-2.5 py-1 rounded-full border border-setu-200">
          Human-in-the-Loop Decision
        </span>
      </div>

      <div className="space-y-3">
        {recommendations.map((rec) => {
          const isSelected = selectedHospitalId === rec.hospital_id;
          const isRank1 = rec.rank === 1;

          return (
            <div
              key={rec.hospital_id}
              className={`p-4 rounded-xl border transition-all ${
                isSelected
                  ? 'bg-setu-50 border-setu-500 shadow-sm ring-1 ring-setu-500'
                  : isRank1
                  ? 'bg-emerald-50/50 border-emerald-300'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100/80'
              }`}
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className={`w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center ${
                      isRank1 ? 'bg-amber-500 text-white' : 'bg-slate-300 text-slate-700'
                    }`}>
                      #{rec.rank}
                    </span>
                    <strong className="text-sm font-bold text-slate-900">{rec.hospital_name}</strong>
                    {isRank1 && (
                      <span className="text-[10px] font-bold bg-emerald-600 text-white px-2 py-0.5 rounded">
                        TOP MATCH
                      </span>
                    )}
                  </div>

                  <div className="flex items-center space-x-3 text-xs text-slate-600 mt-1">
                    <span>Score: <strong>{rec.score}</strong></span>
                    <span>•</span>
                    <span>Distance: <strong>{rec.distance_km} km</strong></span>
                    <span>•</span>
                    <span>ETA: <strong>{rec.eta_minutes} min</strong></span>
                    <span>•</span>
                    <span>ICU: <strong className="text-emerald-700">{rec.icu_available} free</strong></span>
                  </div>
                </div>

                <button
                  onClick={() => onAssignHospital(rec.hospital_id, isRank1 ? false : true)}
                  className={`text-xs font-bold px-3.5 py-2 rounded-xl transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-600 text-white'
                      : isRank1
                      ? 'bg-setu-600 hover:bg-setu-700 text-white'
                      : 'bg-slate-800 hover:bg-slate-900 text-white'
                  }`}
                >
                  {isSelected ? '✓ Selected' : isRank1 ? '[ Assign Recommended ]' : '[ Select & Override ]'}
                </button>
              </div>

              {/* Reasons List */}
              <div className="mt-3 pt-2 border-t border-slate-200/60">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  WHY SETU RECOMMENDS THIS
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1 text-xs text-slate-700">
                  {rec.reasons.map((reason, idx) => (
                    <div key={idx} className="flex items-center space-x-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      <span>{reason}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
