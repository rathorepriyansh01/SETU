import React, { useState } from 'react';
import { Layers, Play, AlertTriangle, CheckCircle2, ShieldCheck, Activity, BarChart2 } from 'lucide-react';
import { api } from '../services/api';

export const SimulationPanel = () => {
  const [patientCount, setPatientCount] = useState(15);
  const [criticalCount, setCriticalCount] = useState(5);
  const [highCount, setHighCount] = useState(6);
  const [moderateCount, setModerateCount] = useState(4);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleRunSimulation = async () => {
    setLoading(true);
    try {
      const res = await api.runSimulation({
        patient_count: patientCount,
        critical_count: criticalCount,
        high_count: highCount,
        moderate_count: moderateCount
      });
      setResult(res);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-md p-5 mb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div>
          <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
            Simulated Scenario Engine
          </span>
          <h3 className="text-base font-extrabold text-slate-900 mt-1 flex items-center space-x-2">
            <Layers className="w-5 h-5 text-setu-600" />
            <span>Mass-Casualty Surge Simulator</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Test network resilience during major accidents or disaster events in Bhopal</p>
        </div>

        <button
          onClick={handleRunSimulation}
          disabled={loading}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-2 cursor-pointer"
        >
          <Play className="w-4 h-4 fill-white" />
          <span>{loading ? 'Simulating Surge...' : '[ Start Simulation ]'}</span>
        </button>
      </div>

      {/* Inputs Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-5 text-xs">
        <div>
          <label className="text-slate-500 text-[10px] block font-bold uppercase">Total Patients</label>
          <input
            type="number"
            value={patientCount}
            onChange={(e) => setPatientCount(Number(e.target.value))}
            className="w-full bg-white border border-slate-300 rounded p-1 font-bold text-slate-900 text-sm mt-0.5"
          />
        </div>
        <div>
          <label className="text-red-600 text-[10px] block font-bold uppercase">Critical Patients</label>
          <input
            type="number"
            value={criticalCount}
            onChange={(e) => setCriticalCount(Number(e.target.value))}
            className="w-full bg-white border border-red-300 rounded p-1 font-bold text-red-700 text-sm mt-0.5"
          />
        </div>
        <div>
          <label className="text-amber-600 text-[10px] block font-bold uppercase">High Severity</label>
          <input
            type="number"
            value={highCount}
            onChange={(e) => setHighCount(Number(e.target.value))}
            className="w-full bg-white border border-amber-300 rounded p-1 font-bold text-amber-700 text-sm mt-0.5"
          />
        </div>
        <div>
          <label className="text-slate-600 text-[10px] block font-bold uppercase">Moderate</label>
          <input
            type="number"
            value={moderateCount}
            onChange={(e) => setModerateCount(Number(e.target.value))}
            className="w-full bg-white border border-slate-300 rounded p-1 font-bold text-slate-900 text-sm mt-0.5"
          />
        </div>
      </div>

      {/* Results Display */}
      {result && (
        <div className="space-y-4 animate-in fade-in duration-300">
          
          <div className="bg-slate-900 text-white p-4 rounded-xl text-xs flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
              <div>
                <strong className="text-sm font-bold text-white block">Simulation Results — Surge Distributed</strong>
                <span className="text-slate-300">{result.evaluation_metrics.summary}</span>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Critical Overloads Avoided</span>
              <strong className="text-lg font-black text-emerald-400">
                {result.evaluation_metrics.overload_avoided} Hospital(s)
              </strong>
            </div>
          </div>

          {/* Utilization Comparison Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* Baseline Nearest */}
            <div className="p-4 rounded-xl bg-red-50/70 border border-red-200 text-xs">
              <h4 className="font-extrabold text-red-900 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span>Baseline Nearest Allocation</span>
                <span className="text-[10px] bg-red-200 text-red-900 px-1.5 py-0.5 rounded font-bold">Unbalanced</span>
              </h4>
              <p className="text-slate-600 mb-3">All patients directed to nearest hospital regardless of ICU capacity.</p>
              
              <div className="space-y-2">
                {Object.entries(result.baseline_nearest.utilization_after).map(([hName, pct]) => (
                  <div key={hName}>
                    <div className="flex justify-between text-[11px] font-semibold mb-0.5">
                      <span>{hName}</span>
                      <span className={pct >= 90 ? 'text-red-700 font-extrabold' : 'text-slate-700'}>{pct}%</span>
                    </div>
                    <div className="w-full bg-red-100 rounded-full h-2 overflow-hidden">
                      <div
                        className={`h-2 rounded-full ${pct >= 90 ? 'bg-red-600' : 'bg-slate-400'}`}
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* SETU Allocation */}
            <div className="p-4 rounded-xl bg-emerald-50/80 border border-emerald-300 text-xs">
              <h4 className="font-extrabold text-emerald-950 mb-2 uppercase tracking-wider flex items-center justify-between">
                <span>SETU Resilience Allocation</span>
                <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded font-bold">Optimal Grid</span>
              </h4>
              <p className="text-slate-600 mb-3">Surge distributed across Top 3 hospitals based on available ICU capacity.</p>

              <div className="space-y-2">
                {Object.entries(result.setu_allocation.utilization_after).map(([hName, pct]) => (
                  <div key={hName}>
                    <div className="flex justify-between text-[11px] font-semibold mb-0.5">
                      <span>{hName}</span>
                      <span className="text-emerald-800 font-bold">{pct}%</span>
                    </div>
                    <div className="w-full bg-emerald-100 rounded-full h-2 overflow-hidden">
                      <div
                        className="h-2 rounded-full bg-emerald-600"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};
