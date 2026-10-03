import React, { useEffect, useState } from 'react';
import { MapView } from './MapView';
import { CheckCircle2, Clock, Truck, Building2, AlertTriangle, ShieldCheck } from 'lucide-react';
import { api } from '../services/api';

export const EmergencyTracker = ({ emergencyId, onClose }) => {
  const [trackData, setTrackData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Simulated ambulance movement step
  const [ambPos, setAmbPos] = useState([23.2332, 77.4343]);

  useEffect(() => {
    let interval;
    const fetchTracking = async () => {
      try {
        const data = await api.trackEmergency(emergencyId);
        setTrackData(data);
        setLoading(false);
      } catch (err) {
        setError("Failed to track emergency status");
        setLoading(false);
      }
    };

    fetchTracking();
    interval = setInterval(fetchTracking, 3000);

    return () => clearInterval(interval);
  }, [emergencyId]);

  // Simulate progress movement on map
  useEffect(() => {
    const timer = setInterval(() => {
      setAmbPos(prev => [
        prev[0] + (Math.random() - 0.45) * 0.001,
        prev[1] + (Math.random() - 0.45) * 0.001
      ]);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading emergency tracking data...</div>;
  if (error) return <div className="p-4 bg-red-50 text-red-600 rounded-xl">{error}</div>;

  const steps = [
    { label: 'Request sent', done: true },
    { label: 'Ambulance assigned', done: trackData?.ambulance !== null },
    { label: 'En route', active: trackData?.status === 'ASSIGNED' || trackData?.status === 'EN_ROUTE' || trackData?.status === 'PREALERT_ACCEPTED' },
    { label: 'Hospital arrival', done: trackData?.status === 'ARRIVED' }
  ];

  const destHospital = trackData?.destination_hospital;
  const ambulance = trackData?.ambulance;

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-xl overflow-hidden mb-8">
      
      {/* Tracker Banner */}
      <div className="bg-slate-900 text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-800">
        <div>
          <div className="flex items-center space-x-2">
            <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded">
              EMERGENCY #{trackData.id}
            </span>
            <span className="text-xs text-slate-400">Incident: {trackData.incident_type}</span>
          </div>
          <h2 className="text-base font-bold text-white mt-1">Live Emergency Dispatch Tracker</h2>
        </div>

        <button
          onClick={onClose}
          className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-200 px-3 py-1.5 rounded-lg border border-slate-700 transition-colors"
        >
          Close Tracker
        </button>
      </div>

      {/* 4-Step Progress Bar */}
      <div className="bg-slate-50 border-b border-slate-200 p-4">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          {steps.map((st, idx) => (
            <div
              key={idx}
              className={`p-2.5 rounded-xl border text-xs font-semibold flex items-center justify-center space-x-1.5 transition-all ${
                st.done
                  ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                  : st.active
                  ? 'bg-amber-50 text-amber-700 border-amber-300 animate-pulse'
                  : 'bg-white text-slate-400 border-slate-200'
              }`}
            >
              {st.done ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              ) : st.active ? (
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              ) : (
                <span className="w-2.5 h-2.5 rounded-full bg-slate-300"></span>
              )}
              <span>{st.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Live Map & Dispatch Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-4 sm:p-6">
        
        {/* Map View */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Live Ambulance Position</span>
            <span className="text-[11px] text-teal-700 bg-teal-50 px-2 py-0.5 rounded font-medium border border-teal-200">
              Simulated movement
            </span>
          </div>
          <MapView
            incidentLocation={{ lat: 23.2599, lng: 77.4126 }}
            ambulances={ambulance ? [{ id: ambulance.id, identifier: ambulance.identifier, latitude: ambPos[0], longitude: ambPos[1], status: 'EN_ROUTE', equipment: ambulance.equipment }] : []}
            hospitals={destHospital ? [{ id: destHospital.id, name: destHospital.name, latitude: destHospital.latitude, longitude: destHospital.longitude, status: 'Available' }] : []}
            height="360px"
          />
        </div>

        {/* Details Panel */}
        <div className="space-y-4">
          
          {/* Destination Hospital Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
              <Building2 className="w-4 h-4 mr-1 text-setu-600" />
              Destination Hospital
            </h4>
            {destHospital ? (
              <div>
                <strong className="text-sm font-bold text-slate-900 block">{destHospital.name}</strong>
                <p className="text-xs text-slate-500 mt-0.5">Phone: {destHospital.phone || '+91-755-2900000'}</p>
                <div className="mt-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded border border-emerald-200 inline-block">
                  ✓ Emergency Pre-alert Sent & Accepted
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic">Waiting for dispatcher hospital assignment...</span>
            )}
          </div>

          {/* Assigned Ambulance Card */}
          <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center">
              <Truck className="w-4 h-4 mr-1 text-blue-600" />
              Assigned Ambulance
            </h4>
            {ambulance ? (
              <div>
                <strong className="text-sm font-bold text-slate-900 block">Vehicle {ambulance.identifier}</strong>
                <div className="flex items-center space-x-2 text-xs text-slate-600 mt-1">
                  <span>Capability: <strong>{ambulance.equipment}</strong></span>
                  <span>•</span>
                  <span>Driver: {ambulance.phone}</span>
                </div>
              </div>
            ) : (
              <span className="text-xs text-slate-500 italic">Assigning nearest ambulance...</span>
            )}
          </div>

          {/* Live ETA Card */}
          <div className="bg-setu-50 p-4 rounded-xl border border-setu-200 text-center">
            <span className="text-xs font-semibold text-setu-800 uppercase tracking-wider block">Estimated Hospital Arrival</span>
            <div className="text-2xl font-extrabold text-setu-900 my-1 flex items-center justify-center space-x-1">
              <Clock className="w-6 h-6 text-setu-600 mr-1" />
              <span>~{trackData.eta_minutes || 7} min</span>
            </div>
            <p className="text-[11px] text-setu-700">Calculated via OSRM city routing engine</p>
          </div>

        </div>

      </div>
    </div>
  );
};
