import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Hospital, Truck, MapPin, Activity } from 'lucide-react';

// Bhopal default center
const BHOPAL_CENTER = [23.2599, 77.4126];

// Custom HTML Markers using Leaflet divIcon for smooth SVG rendering
const createHospitalIcon = (status) => {
  let colorClass = 'bg-emerald-500 border-emerald-700';
  if (status === 'Limited' || status === 'Busy') colorClass = 'bg-amber-500 border-amber-700';
  if (status === 'Critical') colorClass = 'bg-red-500 border-red-700';
  if (status === 'Stale' || status === 'Offline') colorClass = 'bg-slate-500 border-slate-700';

  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `<div class="w-8 h-8 rounded-full ${colorClass} border-2 text-white flex items-center justify-center shadow-lg font-bold text-xs transform transition-transform hover:scale-110">🏥</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32]
  });
};

const ambulanceIcon = L.divIcon({
  className: 'custom-leaflet-ambulance',
  html: `<div class="w-8 h-8 rounded-full bg-blue-600 border-2 border-white text-white flex items-center justify-center shadow-lg transform transition-all animate-pulse">🚑</div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32]
});

const incidentIcon = L.divIcon({
  className: 'custom-leaflet-incident',
  html: `<div class="w-9 h-9 rounded-full bg-red-600 border-2 border-white text-white flex items-center justify-center shadow-xl animate-bounce">🚨</div>`,
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36]
});

// Helper component to auto-recenter map when center prop changes
function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

export const MapView = ({
  hospitals = [],
  ambulances = [],
  incidentLocation = null,
  selectedHospital = null,
  routePolyline = [],
  height = "450px",
  onSelectHospital
}) => {
  const mapCenter = incidentLocation ? [incidentLocation.lat, incidentLocation.lng] : BHOPAL_CENTER;

  return (
    <div style={{ height }} className="w-full relative rounded-xl overflow-hidden shadow-inner border border-slate-200">
      <MapContainer center={mapCenter} zoom={12} scrollWheelZoom={true} className="w-full h-full">
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <RecenterMap center={mapCenter} />

        {/* Hospitals Markers */}
        {hospitals.map((h) => (
          <Marker
            key={h.id}
            position={[h.latitude, h.longitude]}
            icon={createHospitalIcon(h.status)}
            eventHandlers={{
              click: () => onSelectHospital && onSelectHospital(h)
            }}
          >
            <Popup className="custom-popup">
              <div className="p-1 max-w-xs">
                <div className="flex items-center justify-between font-bold text-sm text-slate-900 border-b pb-1 mb-2">
                  <span>{h.name}</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                    h.status === 'Available' ? 'bg-emerald-100 text-emerald-800' :
                    h.status === 'Busy' ? 'bg-amber-100 text-amber-800' : 'bg-red-100 text-red-800'
                  }`}>
                    {h.status}
                  </span>
                </div>
                <p className="text-xs text-slate-600 mb-1">{h.address}</p>
                {h.capacity && (
                  <div className="grid grid-cols-2 gap-1 text-[11px] bg-slate-50 p-1.5 rounded border border-slate-200 mb-2">
                    <div>ICU Free: <strong className="text-emerald-700">{h.capacity.icu_available}</strong> / {h.capacity.icu_total}</div>
                    <div>Oxygen: <strong className="text-blue-700">{intVal(h.capacity.oxygen_level)}%</strong></div>
                    <div>Ward Free: <strong>{h.capacity.ward_available}</strong></div>
                    <div>Vents Free: <strong>{h.capacity.ventilators_available}</strong></div>
                  </div>
                )}
                {onSelectHospital && (
                  <button
                    onClick={() => onSelectHospital(h)}
                    className="w-full bg-setu-600 hover:bg-setu-700 text-white font-medium text-xs py-1 px-2 rounded transition-colors"
                  >
                    Select Hospital
                  </button>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Ambulances Markers */}
        {ambulances.map((amb) => (
          <Marker
            key={amb.id}
            position={[amb.latitude, amb.longitude]}
            icon={ambulanceIcon}
          >
            <Popup>
              <div className="text-xs font-semibold p-1">
                <div>Ambulance {amb.identifier}</div>
                <div className="text-slate-500 font-normal">Type: {amb.equipment}</div>
                <div className="text-emerald-600">Status: {amb.status}</div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* Incident Marker */}
        {incidentLocation && (
          <Marker position={[incidentLocation.lat, incidentLocation.lng]} icon={incidentIcon}>
            <Popup>
              <div className="text-xs font-bold text-red-600 p-1">
                🚨 Emergency Incident Location
              </div>
            </Popup>
          </Marker>
        )}

        {/* Route Polyline if present */}
        {routePolyline.length > 1 && (
          <Polyline positions={routePolyline} color="#0284c7" weight={5} opacity={0.8} dashArray="8, 8" />
        )}
      </MapContainer>

      {/* Map Legend Overlay */}
      <div className="absolute bottom-3 left-3 z-[400] bg-white/95 backdrop-blur-sm p-2 rounded-lg shadow-md border border-slate-200 text-[11px] font-medium flex items-center space-x-3 text-slate-700">
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
          <span>Available</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
          <span>Limited</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-red-500"></span>
          <span>Critical</span>
        </div>
        <div className="flex items-center space-x-1">
          <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span>
          <span>Ambulance</span>
        </div>
      </div>
    </div>
  );
};

function intVal(val) {
  return typeof val === 'number' ? Math.round(val) : val;
}
