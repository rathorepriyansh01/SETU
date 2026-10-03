import React, { useState, useEffect } from 'react';
import { ResilienceCard } from '../components/ResilienceCard';
import { RedistributionCard } from '../components/RedistributionCard';
import { SimulationPanel } from '../components/SimulationPanel';
import { AuditTimeline } from '../components/AuditTimeline';
import { api } from '../services/api';
import { BarChart3, AlertTriangle, ShieldCheck, RefreshCw, Activity, CheckCircle2, FileText, Layers, Clock } from 'lucide-react';

export const AdminPage = ({ activeTab }) => {
  const [command, setCommand] = useState(null);
  const [freshnessData, setFreshnessData] = useState([]);
  const [redistOpps, setRedistOpps] = useState([]);
  const [evaluation, setEvaluation] = useState(null);
  const [auditEvents, setAuditEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionMsg, setActionMsg] = useState(null);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    try {
      const cmd = await api.getCommandCenter();
      setCommand(cmd);

      const fresh = await api.getDataFreshnessCenter();
      setFreshnessData(fresh);

      const opps = await api.getRedistributionOpps();
      setRedistOpps(opps);

      const ev = await api.getEvaluation();
      setEvaluation(ev);

      const audit = await api.getAuditTrail();
      setAuditEvents(audit);

      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const handleApproveRedistribution = async (id) => {
    try {
      const res = await api.approveRedistribution(id);
      setActionMsg(res.message);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectRedistribution = async (id) => {
    try {
      const res = await api.rejectRedistribution(id);
      setActionMsg(res.message);
      fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-center text-slate-500 font-medium">Loading Health Officer Command Center...</div>;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Header Banner */}
      <div className="bg-slate-900 text-white p-5 rounded-2xl shadow-md border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-amber-400 uppercase tracking-wider">NETWORK COMMAND BRIDGE</span>
          <h2 className="text-xl font-bold text-white mt-0.5">Bhopal City Healthcare Command Center</h2>
          <p className="text-xs text-slate-400">Monitoring network pressure, resource imbalances & mass-casualty surge scenarios</p>
        </div>

        <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-3 py-1 rounded-full font-medium">
          Demo Network / Simulated Data
        </span>
      </div>

      {actionMsg && (
        <div className="bg-emerald-600 text-white p-3 rounded-xl shadow-md text-xs font-bold">
          {actionMsg}
        </div>
      )}

      {/* KPI Overview Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Active Emergencies</span>
          <strong className="text-2xl font-black text-slate-900">{command?.active_emergencies_count || 0}</strong>
          <span className="text-[11px] text-emerald-600 block mt-0.5">Live queue active</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Network ICU Load</span>
          <strong className="text-2xl font-black text-slate-900">{command?.network_icu_utilization_percent || 0}%</strong>
          <span className="text-[11px] text-slate-500 block mt-0.5">5 Bhopal Hospitals</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Under Pressure</span>
          <strong className="text-2xl font-black text-amber-600">{command?.hospitals_under_pressure_count || 0}</strong>
          <span className="text-[11px] text-amber-700 block mt-0.5">ICU occupancy &gt; 75%</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Stockout Risks</span>
          <strong className="text-2xl font-black text-red-600">{command?.stockout_risks_count || 0}</strong>
          <span className="text-[11px] text-red-700 block mt-0.5">&lt; 5 days remaining</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
          <span className="text-slate-400 text-[10px] font-bold uppercase tracking-wider block">Avg Response Time</span>
          <strong className="text-2xl font-black text-setu-700">{command?.average_response_time_min || 8.4} m</strong>
          <span className="text-[11px] text-emerald-600 block mt-0.5">Bhopal grid avg</span>
        </div>
      </div>

      {/* Resource Resilience Matrix for Connected Hospitals */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center">
          <ShieldCheck className="w-4 h-4 text-emerald-600 mr-1.5" />
          Network Hospital Resilience Cards
        </h3>

        {freshnessData.map((fItem) => (
          <ResilienceCard key={fItem.hospital_id} resilience={fItem.resilience} />
        ))}
      </div>

      {/* Redistribution Opportunities Section */}
      <div className="space-y-4">
        <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider flex items-center">
          <RefreshCw className="w-4 h-4 text-setu-600 mr-1.5" />
          Network Inventory Redistribution Opportunities ({redistOpps.length})
        </h3>

        {redistOpps.map((opp) => (
          <RedistributionCard
            key={opp.id}
            opportunity={opp}
            onApprove={handleApproveRedistribution}
            onReject={handleRejectRedistribution}
          />
        ))}
      </div>

      {/* Mass Casualty Simulator Panel */}
      <SimulationPanel />

      {/* Evaluation Dashboard: SETU vs Nearest Baseline */}
      {evaluation && (
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
          <div className="flex items-center justify-between mb-3 border-b border-slate-100 pb-2">
            <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
              <BarChart3 className="w-5 h-5 text-setu-600" />
              <span>SETU vs Nearest Hospital Evaluation Metrics</span>
            </h3>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-3 text-xs">
            <div>
              <span className="text-slate-500 text-[10px] block">Nearest Avg ETA</span>
              <strong className="text-sm font-bold text-slate-900">{evaluation.metrics.average_eta_baseline_min} min</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">SETU Avg ETA</span>
              <strong className="text-sm font-bold text-emerald-700">{evaluation.metrics.average_eta_setu_min} min</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">Nearest Critical Overloads</span>
              <strong className="text-sm font-bold text-red-600">{evaluation.metrics.critical_overloads_baseline}</strong>
            </div>
            <div>
              <span className="text-slate-500 text-[10px] block">SETU Critical Overloads</span>
              <strong className="text-sm font-bold text-emerald-600">{evaluation.metrics.critical_overloads_setu} (0 Overload)</strong>
            </div>
          </div>

          <p className="text-xs text-slate-600 italic leading-relaxed">
            "{evaluation.metrics.methodology}"
          </p>
        </div>
      )}

      {/* Audit Timeline */}
      <AuditTimeline auditEvents={auditEvents} />

    </div>
  );
};
