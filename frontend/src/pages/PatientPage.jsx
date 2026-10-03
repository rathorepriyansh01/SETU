import React, { useState, useEffect } from 'react';
import { SearchBox } from '../components/SearchBox';
import { IntentCard } from '../components/IntentCard';
import { HospitalCard } from '../components/HospitalCard';
import { MapView } from '../components/MapView';
import { EmergencyModal } from '../components/EmergencyModal';
import { EmergencyTracker } from '../components/EmergencyTracker';
import { api } from '../services/api';

export const PatientPage = ({ activeTab }) => {
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchIntent, setSearchIntent] = useState(null);
  const [isEmergencyOpen, setIsEmergencyOpen] = useState(false);
  const [activeEmergencyId, setActiveEmergencyId] = useState(null);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    try {
      const data = await api.getHospitals();
      setHospitals(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleSearch = async (query) => {
    try {
      const res = await api.searchHealthcare(query);
      setSearchIntent(res);
      setHospitals(res.matching_hospitals || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEmergencySubmit = async (formData) => {
    try {
      const res = await api.createEmergency(formData);
      setIsEmergencyOpen(false);
      setActiveEmergencyId(res.emergency_id);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading Bhopal Healthcare Grid...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Active Emergency Tracker */}
      {activeEmergencyId && (
        <EmergencyTracker
          emergencyId={activeEmergencyId}
          onClose={() => setActiveEmergencyId(null)}
        />
      )}

      {/* Main Search & Intent Understanding */}
      <SearchBox
        onSearch={handleSearch}
        onOpenEmergency={() => setIsEmergencyOpen(true)}
      />

      {/* AI Intent Card */}
      {searchIntent && <IntentCard intentResult={searchIntent} />}

      {/* Main Content Grid: Map & Hospital Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Leaflet Map (Left 2 cols) */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              Live Bhopal Healthcare Map
            </h3>
            <span className="text-xs text-slate-500 font-medium">Showing {hospitals.length} connected hospitals</span>
          </div>
          <MapView
            hospitals={hospitals}
            incidentLocation={{ lat: 23.2599, lng: 77.4126 }}
            height="460px"
          />
        </div>

        {/* Hospital Results Cards Column */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
              {searchIntent ? 'Matched Hospitals' : 'Available Hospitals'}
            </h3>
          </div>

          <div className="space-y-4 max-h-[600px] overflow-y-auto pr-1">
            {hospitals.map((hosp) => (
              <HospitalCard
                key={hosp.id}
                hospital={hosp}
                onSelect={(h) => alert(`Selected hospital: ${h.name}`)}
                onShowRoute={(h) => alert(`Showing route to ${h.name}`)}
              />
            ))}
          </div>
        </div>

      </div>

      {/* Emergency Request Modal */}
      <EmergencyModal
        isOpen={isEmergencyOpen}
        onClose={() => setIsEmergencyOpen(false)}
        onSubmitEmergency={handleEmergencySubmit}
      />
    </div>
  );
};
