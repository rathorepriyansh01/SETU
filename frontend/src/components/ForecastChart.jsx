import React from 'react';
import { ResponsiveContainer as RC, AreaChart as AC, Area as A, XAxis as XA, YAxis as YA, CartesianGrid as CG, Tooltip as TT } from 'recharts';
import { TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

export const ForecastChart = ({ forecastData }) => {
  if (!forecastData) return null;

  const data = [
    { time: 'Now', icu: forecastData.current_icu_utilization, ward: forecastData.current_ward_utilization },
    { time: '+6 Hours', icu: forecastData.icu_forecast_6h, ward: forecastData.current_ward_utilization + 5 },
    { time: '+12 Hours', icu: forecastData.icu_forecast_12h, ward: forecastData.current_ward_utilization + 10 },
    { time: '+24 Hours', icu: forecastData.icu_forecast_24h, ward: forecastData.ward_forecast_24h }
  ];

  const risk = forecastData.risk_level || 'Low';

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <TrendingUp className="w-5 h-5 text-setu-600" />
            <span>24-Hour Hospital Capacity Forecast</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Deterministic moving-average + emergency pressure trend calculation</p>
        </div>

        <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
          risk === 'Critical' ? 'bg-red-100 text-red-800 border-red-300' :
          risk === 'High' ? 'bg-amber-100 text-amber-800 border-amber-300' :
          'bg-emerald-100 text-emerald-800 border-emerald-300'
        }`}>
          Risk: {risk}
        </span>
      </div>

      {/* Utilization Key Metrics Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200 mb-4 text-xs">
        <div>
          <span className="text-slate-500 text-[10px] block">Current ICU Load</span>
          <strong className="text-sm font-extrabold text-slate-900">{forecastData.current_icu_utilization}%</strong>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">6-Hour ICU Forecast</span>
          <strong className="text-sm font-extrabold text-amber-700">{forecastData.icu_forecast_6h}%</strong>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">24-Hour ICU Forecast</span>
          <strong className={`text-sm font-extrabold ${forecastData.icu_forecast_24h >= 85 ? 'text-red-600' : 'text-slate-900'}`}>
            {forecastData.icu_forecast_24h}%
          </strong>
        </div>
        <div>
          <span className="text-slate-500 text-[10px] block">Threshold Crossing</span>
          <strong className="text-sm font-extrabold text-setu-700">
            {forecastData.time_to_critical_hours ? `In ~${forecastData.time_to_critical_hours}h` : 'No Critical Surge'}
          </strong>
        </div>
      </div>

      {/* Chart */}
      <div className="h-56 w-full mb-3">
        <RC width="100%" height="100%">
          <AC data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CG strokeDasharray="3 3" stroke="#f1f5f9" />
            <XA dataKey="time" tick={{ fontSize: 11, fill: '#64748b' }} />
            <YA domain={[0, 100]} tick={{ fontSize: 11, fill: '#64748b' }} />
            <TT contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#fff', borderRadius: '8px', fontSize: '12px' }} />
            <A type="monotone" dataKey="icu" stroke="#ef4444" fill="#fca5a5" fillOpacity={0.4} name="ICU Load %" />
            <A type="monotone" dataKey="ward" stroke="#0284c7" fill="#bae6fd" fillOpacity={0.3} name="Ward Load %" />
          </AC>
        </RC>
      </div>

      {/* AI Explanation Callout */}
      <div className="bg-slate-900 text-white p-3 rounded-xl text-xs flex items-start space-x-2">
        <ShieldCheck className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
        <div>
          <strong className="text-teal-300 font-semibold block mb-0.5">Forecast Insight:</strong>
          <p className="text-slate-300 leading-relaxed">{forecastData.explanation}</p>
        </div>
      </div>

    </div>
  );
};
