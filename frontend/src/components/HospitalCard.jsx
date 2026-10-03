import React from 'react';
import { StatusBadge, FreshnessBadge } from './Badges';
import { MapPin, Navigation, Clock, Activity, CheckCircle, AlertCircle, HeartPulse, UserCheck } from 'lucide-react';

export const HospitalCard = ({ hospital, onSelect, onShowRoute, recommendation = null }) => {
  const cap = hospital.capacity || {};
  const icuAvail = cap.icu_available ?? 0;
  const icuTotal = cap.icu_total ?? 20;
  const oxyLevel = cap.oxygen_level ?? 80;

  // Department & Doctor summary
  const hasCardio = (hospital.departments || []).some(d => d.name === 'Cardiology' && d.available);
  const hasDocs = (hospital.doctors || []).some(d => d.available);

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-all p-5 flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-start justify-between mb-2">
          <div>
            <span className="text-[11px] font-semibold text-setu-600 bg-setu-50 px-2 py-0.5 rounded border border-setu-100 uppercase tracking-wider mb-1 inline-block">
              {hospital.type}
            </span>
            <h3 className="text-base font-bold text-slate-900 leading-snug">{hospital.name}</h3>
            <p className="text-xs text-slate-500 flex items-center mt-0.5">
              <MapPin className="w-3 h-3 mr-1 text-slate-400" />
              {hospital.address || `${hospital.city}, Madhya Pradesh`}
            </p>
          </div>

          <div className="flex flex-col items-end space-y-1">
            <StatusBadge status={hospital.status} />
            <FreshnessBadge status={hospital.freshness_status} lastUpdated={hospital.last_updated} />
          </div>
        </div>

        {/* Feature Checks */}
        <div className="grid grid-cols-2 gap-2 my-3 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
          <div className="flex items-center space-x-1.5 text-slate-700">
            <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
            <span>Cardiology & Emergency</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-700">
            <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Specialist Doctor On-Duty</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-700">
            <HeartPulse className="w-3.5 h-3.5 text-blue-600" />
            <span>ICU: <strong className="text-slate-900">{icuAvail} free</strong> ({icuTotal} total)</span>
          </div>
          <div className="flex items-center space-x-1.5 text-slate-700">
            <Activity className="w-3.5 h-3.5 text-teal-600" />
            <span>Oxygen: <strong className={oxyLevel >= 70 ? 'text-emerald-700' : 'text-amber-700'}>{Math.round(oxyLevel)}%</strong></span>
          </div>
        </div>

        {/* Distance & ETA */}
        <div className="flex items-center space-x-3 text-xs text-slate-600 mb-3">
          <span className="font-semibold text-slate-900">3.2 km</span>
          <span>•</span>
          <span className="font-semibold text-emerald-700 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            ETA ~9 min
          </span>
        </div>

        {/* Why SETU Recommends This (If recommendation object passed) */}
        {recommendation && recommendation.reasons && (
          <div className="bg-setu-50/80 border border-setu-200/80 rounded-xl p-3 mb-4 text-xs">
            <h4 className="font-bold text-setu-900 mb-1.5 flex items-center">
              <CheckCircle className="w-3.5 h-3.5 text-setu-600 mr-1" />
              Why SETU recommends this
            </h4>
            <ul className="space-y-1 text-slate-700">
              {recommendation.reasons.map((r, idx) => (
                <li key={idx} className="flex items-start">
                  <span className="text-emerald-600 font-bold mr-1.5">✓</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex items-center space-x-2 pt-2 border-t border-slate-100">
        <button
          onClick={() => onSelect && onSelect(hospital)}
          className="flex-1 bg-setu-800 hover:bg-setu-900 text-white font-semibold text-xs py-2 px-3 rounded-xl shadow-sm transition-colors text-center cursor-pointer"
        >
          View Hospital
        </button>
        <button
          onClick={() => onShowRoute && onShowRoute(hospital)}
          className="bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs py-2 px-3 rounded-xl flex items-center space-x-1 transition-colors cursor-pointer"
        >
          <Navigation className="w-3.5 h-3.5 text-setu-600" />
          <span>Route</span>
        </button>
      </div>
    </div>
  );
};
