import React, { useState, useEffect } from 'react';
import { RecommendationCard } from '../components/RecommendationCard';
import { NearestVsSetuCard } from '../components/NearestVsSetuCard';
import { AmbulanceCard } from '../components/AmbulanceCard';
import { MapView } from '../components/MapView';
import { AuditTimeline } from '../components/AuditTimeline';
import { api } from '../services/api';
import { Activity, AlertTriangle, Truck, Building2, CheckCircle2, ShieldAlert } from 'lucide-react';

export const DispatcherPage = ({ activeTab }) => {
  const [emergencies, setEmergencies] = useState([]);
  const [selectedEmergency, setSelectedEmergency] = useState(null);
  const [detailData, setDetailData] = useState(null);
  const [ambulances, setAmbulances] = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [selectedHospitalId, setSelectedHospitalId] = useState(null);
  const [selectedAmbulanceId, setSelectedAmbulanceId] = useState(null);
  const [isOverride, setIsOverride] = useState(false);
  const [loading, setLoading] = useState(true);
  const [assignedMsg, setAssignedMsg] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const ems = await api.getDispatcherEmergencies();
      setEmergencies(ems);
      const hosps = await api.getHospitals();
      setHospitals(hosps);
      const ambs = await api.getAmbulances(23.2599, 77.4126);
      setAmbulances(ambs);

      if (ems.length > 0) {
        selectEmergencyItem(ems[0].id);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const selectEmergencyItem = async (id) => {
    try {
      const data = await api.getDispatcherEmergencyDetail(id);
      setSelectedEmergency(data.emergency);
      setDetailData(data);

      if (data.top_3_recommendations && data.top_3_recommendations.length > 0) {
        setSelectedHospitalId(data.top_3_recommendations[0].hospital_id);
      }
      if (ambulances.length > 0) {
        setSelectedAmbulanceId(ambulances[0].id);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleAssignHospital = (hospitalId, overrideFlag = false) => {
    setSelectedHospitalId(hospitalId);
    setIsOverride(overrideFlag);
  };

  const handleConfirmAssignment = async () => {
    if (!selectedEmergency || !selectedHospitalId) return;

    try {
      const res = await api.assignEmergency({
        emergency_id: selectedEmergency.id,
        hospital_id: selectedHospitalId,
        ambulance_id: selectedAmbulanceId,
        is_override: isOverride,
        override_reason: isOverride ? "Dispatcher manual decision override" : null
      });
      setAssignedMsg(res.message);
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading Dispatcher Control Room...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Top Notification Banner */}
      {assignedMsg && (
        <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-md text-xs font-bold flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{assignedMsg}</span>
          </div>
          <button onClick={() => setAssignedMsg(null)} className="text-white/80 hover:text-white">Dismiss</button>
        </div>
      )}

      {/* Control Room Main Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        
        {/* Left Column: Emergency Queue */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-sm space-y-3">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center">
              <AlertTriangle className="w-4 h-4 text-red-600 mr-1.5" />
              Emergency Queue ({emergencies.length})
            </h3>
          </div>

          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1">
            {emergencies.map((em) => {
              const isSelected = selectedEmergency?.id === em.id;

              return (
                <button
                  key={em.id}
                  onClick={() => selectEmergencyItem(em.id)}
                  className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-setu-50 border-setu-500 ring-1 ring-setu-500'
                      : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-extrabold text-xs text-slate-900">Emergency #{em.id}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                      em.severity === 'Critical' ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                    }`}>
                      {em.severity}
                    </span>
                  </div>
                  <div className="text-xs text-slate-700 font-medium">{em.incident_type} • {em.patient_count} patient(s)</div>
                  <div className="text-[11px] text-slate-400 mt-1 flex items-center justify-between">
                    <span>Status: {em.status}</span>
                    <span>{new Date(em.created_at).toLocaleTimeString()}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right 3 Columns: Selected Incident + Recommendations + Map */}
        <div className="lg:col-span-3 space-y-6">
          
          {selectedEmergency && detailData && (
            <>
              {/* Selected Incident Banner */}
              <div className="bg-slate-900 text-white p-4 rounded-2xl shadow-md border border-slate-800 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">SELECTED INCIDENT</span>
                  <h2 className="text-lg font-bold text-white">
                    Emergency #{selectedEmergency.id} — {selectedEmergency.incident_type} ({selectedEmergency.severity})
                  </h2>
                  <p className="text-xs text-slate-400 mt-0.5">Location: Bhopal Center • Patients: {selectedEmergency.patient_count}</p>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={handleConfirmAssignment}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md transition-colors cursor-pointer"
                  >
                    [ Confirm Hospital & Ambulance Assignment ]
                  </button>
                </div>
              </div>

              {/* NEAREST VS SETU COMPARISON CARD */}
              <NearestVsSetuCard comparison={detailData.comparison} />

              {/* TOP 3 SETU RECOMMENDATIONS */}
              <RecommendationCard
                recommendations={detailData.top_3_recommendations}
                onAssignHospital={handleAssignHospital}
                selectedHospitalId={selectedHospitalId}
              />

              {/* Ambulance Matching List */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                <h3 className="text-sm font-extrabold text-slate-900 mb-3 uppercase tracking-wider flex items-center">
                  <Truck className="w-4 h-4 text-blue-600 mr-2" />
                  Available Ambulance Fleet Matching
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {ambulances.map((amb) => (
                    <AmbulanceCard
                      key={amb.id}
                      ambulance={amb}
                      isSelected={selectedAmbulanceId === amb.id}
                      onAssign={(id) => setSelectedAmbulanceId(id)}
                    />
                  ))}
                </div>
              </div>

              {/* Live Map */}
              <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-4 space-y-2">
                <h3 className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">
                  Live Dispatch Map Overview
                </h3>
                <MapView
                  incidentLocation={{ lat: selectedEmergency.latitude, lng: selectedEmergency.longitude }}
                  hospitals={hospitals}
                  ambulances={ambulances}
                  height="380px"
                />
              </div>
            </>
          )}

        </div>

      </div>
    </div>
  );
};
