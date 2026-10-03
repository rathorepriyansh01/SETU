import React, { useState } from 'react';
import { AlertTriangle, MapPin, User, Heart, Activity, Car, Baby, Plus, Minus, X } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const EmergencyModal = ({ isOpen, onClose, onSubmitEmergency }) => {
  const { t } = useLanguage();
  const [incidentType, setIncidentType] = useState('Accident');
  const [severity, setSeverity] = useState('Critical');
  const [patientCount, setPatientCount] = useState(1);
  const [patientName, setPatientName] = useState('');
  const [useMyLocation, setUseMyLocation] = useState(true);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmitEmergency({
      incident_type: incidentType,
      severity,
      patient_count: patientCount,
      patient_name: patientName || 'Anonymous Patient',
      // Default Bhopal coordinates
      latitude: 23.2599,
      longitude: 77.4126
    });
  };

  const incidentOptions = [
    { label: 'Accident', icon: Car },
    { label: 'Heart', icon: Heart },
    { label: 'Breathing', icon: Activity },
    { label: 'Pregnancy', icon: Baby },
    { label: 'Other', icon: AlertTriangle }
  ];

  return (
    <div className="fixed inset-0 z-[1000] bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl border border-red-200 overflow-hidden animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="bg-red-600 text-white p-4 sm:p-5 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <AlertTriangle className="w-6 h-6 animate-pulse" />
            <div>
              <h2 className="text-lg font-bold">Emergency Healthcare Care</h2>
              <p className="text-xs text-red-100">Immediate Allocation System • Bhopal</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1 rounded-lg hover:bg-red-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Demo Notice */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-2 text-xs font-semibold text-amber-800 flex items-center justify-between">
          <span>ℹ️ This is a simulated emergency workflow for Bhopal network.</span>
        </div>

        <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4">
          
          {/* Location */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Patient Location
            </label>
            <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
              <div className="flex items-center space-x-2 text-slate-700">
                <MapPin className="w-4 h-4 text-red-600" />
                <span>Bhopal Center (23.2599° N, 77.4126° E)</span>
              </div>
              <button
                type="button"
                onClick={() => setUseMyLocation(true)}
                className="text-setu-600 font-bold hover:underline"
              >
                [ Use my location ]
              </button>
            </div>
          </div>

          {/* Incident Type */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Incident Type
            </label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-2">
              {incidentOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = incidentType === opt.label;
                return (
                  <button
                    key={opt.label}
                    type="button"
                    onClick={() => setIncidentType(opt.label)}
                    className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-red-50 border-red-500 text-red-700 font-bold shadow-sm'
                        : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-4 h-4 mb-1 ${isSelected ? 'text-red-600' : 'text-slate-400'}`} />
                    <span>{opt.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Severity */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Severity Level
            </label>
            <div className="grid grid-cols-3 gap-2">
              {['Critical', 'High', 'Moderate'].map((sev) => {
                const isSelected = severity === sev;
                return (
                  <button
                    key={sev}
                    type="button"
                    onClick={() => setSeverity(sev)}
                    className={`py-2 rounded-xl border text-xs font-bold transition-all ${
                      isSelected
                        ? sev === 'Critical' ? 'bg-red-600 text-white border-red-600' : 'bg-amber-500 text-white border-amber-500'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {sev}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Patient Count Stepper */}
          <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-200">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Number of Patients</span>
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setPatientCount(Math.max(1, patientCount - 1))}
                className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 flex items-center justify-center font-bold"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="font-bold text-slate-900 text-base w-4 text-center">{patientCount}</span>
              <button
                type="button"
                onClick={() => setPatientCount(patientCount + 1)}
                className="w-8 h-8 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-800 flex items-center justify-center font-bold"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-bold text-sm py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transition-all cursor-pointer"
          >
            [ Send Emergency Request ]
          </button>
        </form>
      </div>
    </div>
  );
};
