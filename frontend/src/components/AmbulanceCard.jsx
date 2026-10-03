import React from 'react';
import { Truck, Clock, MapPin, CheckCircle2 } from 'lucide-react';

export const AmbulanceCard = ({ ambulance, onAssign, isSelected }) => {
  return (
    <div className={`p-3.5 rounded-xl border transition-all flex items-center justify-between ${
      isSelected
        ? 'bg-blue-50 border-blue-500 ring-1 ring-blue-500 shadow-sm'
        : 'bg-white border-slate-200 hover:bg-slate-50'
    }`}>
      <div className="flex items-center space-x-3">
        <div className="bg-blue-100 text-blue-800 p-2 rounded-lg">
          <Truck className="w-5 h-5" />
        </div>
        <div>
          <strong className="text-sm font-bold text-slate-900 block">{ambulance.identifier}</strong>
          <div className="flex items-center space-x-2 text-xs text-slate-500 mt-0.5">
            <span className="bg-slate-100 px-1.5 py-0.5 rounded font-semibold text-slate-700">{ambulance.equipment}</span>
            <span>•</span>
            <span>{ambulance.distance_km} km away</span>
            <span>•</span>
            <span className="text-emerald-700 font-semibold flex items-center">
              <Clock className="w-3 h-3 mr-0.5" />
              ETA {ambulance.eta_minutes} min
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={() => onAssign(ambulance.id)}
        className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors cursor-pointer ${
          isSelected
            ? 'bg-blue-600 text-white'
            : 'bg-slate-100 hover:bg-blue-600 hover:text-white text-slate-800'
        }`}
      >
        {isSelected ? '✓ Assigned' : '[ Assign ]'}
      </button>
    </div>
  );
};
