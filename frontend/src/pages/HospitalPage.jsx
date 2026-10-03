import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { PreAlertCard } from '../components/PreAlertCard';
import { ForecastChart } from '../components/ForecastChart';
import { InventoryTable } from '../components/InventoryTable';
import { StatusBadge, FreshnessBadge } from '../components/Badges';
import { api } from '../services/api';
import { Building2, Activity, Save, RefreshCw, AlertTriangle, ShieldCheck } from 'lucide-react';

export const HospitalPage = ({ activeTab }) => {
  const { activeHospitalId } = useAuth();
  const [dashboard, setDashboard] = useState(null);
  const [prealerts, setPrealerts] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [forecast, setForecast] = useState(null);
  const [loading, setLoading] = useState(true);

  // Capacity Form State
  const [icuAvail, setIcuAvail] = useState(5);
  const [icuTotal, setIcuTotal] = useState(20);
  const [wardAvail, setWardAvail] = useState(30);
  const [wardTotal, setWardTotal] = useState(100);
  const [oxygen, setOxygen] = useState(85);
  const [updateMsg, setUpdateMsg] = useState(null);

  useEffect(() => {
    fetchHospitalData();
  }, [activeHospitalId]);

  const fetchHospitalData = async () => {
    try {
      const dash = await api.getHospitalDashboard(activeHospitalId);
      setDashboard(dash);
      if (dash.capacity) {
        setIcuAvail(dash.capacity.icu_available);
        setIcuTotal(dash.capacity.icu_total);
        setWardAvail(dash.capacity.ward_available);
        setWardTotal(dash.capacity.ward_total);
        setOxygen(dash.capacity.oxygen_level);
      }
      setForecast(dash.forecast);

      const pres = await api.getPrealerts(activeHospitalId);
      setPrealerts(pres);

      const inv = await api.getInventory(activeHospitalId);
      setInventory(inv);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleUpdateCapacity = async (e) => {
    e.preventDefault();
    try {
      await api.updateHospitalCapacity(activeHospitalId, {
        icu_available: Number(icuAvail),
        icu_total: Number(icuTotal),
        ward_available: Number(wardAvail),
        ward_total: Number(wardTotal),
        oxygen_level: Number(oxygen)
      });
      setUpdateMsg("Hospital capacity updated successfully!");
      fetchHospitalData();
      setTimeout(() => setUpdateMsg(null), 3000);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAcceptPrealert = async (id) => {
    await api.acceptPrealert(id);
    fetchHospitalData();
  };

  const handleRejectPrealert = async (id, reason) => {
    await api.rejectPrealert(id, reason);
    fetchHospitalData();
  };

  const handlePatientReceived = async (id) => {
    await api.patientReceived(id);
    fetchHospitalData();
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading Hospital Admin Portal...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-teal-400 uppercase tracking-wider">HOSPITAL OPERATOR BRIDGE</span>
          <h2 className="text-xl font-bold text-white mt-0.5">{dashboard?.hospital_name || 'Hospital Admin'}</h2>
          <p className="text-xs text-slate-400">Manage live beds, oxygen, medicine inventory & incoming pre-alerts</p>
        </div>

        <div className="flex items-center space-x-3">
          <FreshnessBadge status={dashboard?.data_freshness || 'Fresh'} lastUpdated={dashboard?.last_updated} />
          <button
            onClick={fetchHospitalData}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold px-3 py-2 rounded-xl border border-slate-700 flex items-center space-x-1"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {updateMsg && (
        <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-md text-xs font-bold">
          {updateMsg}
        </div>
      )}

      {/* Main Grid: Prealerts & Capacity Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Incoming Prealerts Column */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center">
              <AlertTriangle className="w-4 h-4 text-amber-600 mr-1.5" />
              Incoming Emergency Pre-alerts ({prealerts.length})
            </h3>
          </div>

          <div className="space-y-3">
            {prealerts.length > 0 ? (
              prealerts.map((pre) => (
                <PreAlertCard
                  key={pre.id}
                  prealert={pre}
                  onAccept={handleAcceptPrealert}
                  onReject={handleRejectPrealert}
                  onReceived={handlePatientReceived}
                />
              ))
            ) : (
              <div className="bg-white p-6 rounded-2xl border border-slate-200 text-center text-slate-500 text-xs italic">
                No incoming emergency pre-alerts at this time.
              </div>
            )}
          </div>

          {/* 24-Hour Forecast Chart */}
          <ForecastChart forecastData={forecast} />

          {/* Inventory Table */}
          <InventoryTable inventory={inventory} />
        </div>

        {/* Capacity Update Side Form */}
        <div className="space-y-6">
          
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
            <h3 className="text-sm font-extrabold text-slate-900 mb-3 uppercase tracking-wider flex items-center">
              <Building2 className="w-4 h-4 text-setu-600 mr-1.5" />
              Update Hospital Capacity
            </h3>
            
            <form onSubmit={handleUpdateCapacity} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">ICU Beds (Available / Total)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={icuAvail}
                    onChange={(e) => setIcuAvail(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                    placeholder="Free ICU"
                  />
                  <input
                    type="number"
                    value={icuTotal}
                    onChange={(e) => setIcuTotal(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-600"
                    placeholder="Total ICU"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Ward Beds (Available / Total)</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    value={wardAvail}
                    onChange={(e) => setWardAvail(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                    placeholder="Free Ward"
                  />
                  <input
                    type="number"
                    value={wardTotal}
                    onChange={(e) => setWardTotal(e.target.value)}
                    className="bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-semibold text-slate-600"
                    placeholder="Total Ward"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Oxygen Reserves Level (%)</label>
                <input
                  type="number"
                  value={oxygen}
                  onChange={(e) => setOxygen(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg p-2 text-xs font-bold text-slate-900"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-setu-600 hover:bg-setu-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl shadow transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>[ Save Capacity Update ]</span>
              </button>
            </form>
          </div>

        </div>

      </div>
    </div>
  );
};
