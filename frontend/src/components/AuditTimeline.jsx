import React from 'react';
import { History, User, Activity, AlertTriangle, CheckCircle2, Truck, ShieldCheck } from 'lucide-react';

export const AuditTimeline = ({ auditEvents = [] }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 mb-6">
      
      {/* Header */}
      <div className="flex items-center justify-between mb-4 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-extrabold text-slate-900 flex items-center space-x-2">
            <History className="w-5 h-5 text-setu-600" />
            <span>Operational Audit Trail & Action Log</span>
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">Immutable record of emergency dispatches, dispatcher overrides, and hospital actions</p>
        </div>
      </div>

      {/* Timeline Steps */}
      <div className="relative border-l-2 border-slate-200 ml-3 space-y-4 my-2">
        {auditEvents.map((evt, idx) => {
          const createdTime = evt.created_at ? new Date(evt.created_at).toLocaleTimeString() : '12:42 PM';
          const role = evt.actor_role;

          let badgeColor = 'bg-slate-100 text-slate-700';
          if (role === 'DISPATCHER') badgeColor = 'bg-setu-100 text-setu-800';
          if (role === 'HOSPITAL_ADMIN') badgeColor = 'bg-teal-100 text-teal-800';
          if (role === 'HEALTH_OFFICER') badgeColor = 'bg-purple-100 text-purple-800';
          if (role === 'PATIENT') badgeColor = 'bg-amber-100 text-amber-800';

          return (
            <div key={evt.id || idx} className="mb-4 ml-6">
              <span className="absolute -left-2.5 mt-1.5 w-5 h-5 rounded-full bg-slate-900 border-2 border-white flex items-center justify-center text-[10px] text-white">
                •
              </span>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center space-x-2">
                    <span className="font-extrabold text-slate-900">{createdTime}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${badgeColor}`}>
                      {role}
                    </span>
                    <strong className="text-setu-800 uppercase tracking-wider text-[11px]">{evt.event_type}</strong>
                  </div>
                  <span className="text-[10px] text-slate-400">Entity: #{evt.entity_id || 'N/A'}</span>
                </div>

                {evt.metadata_json && Object.keys(evt.metadata_json).length > 0 && (
                  <div className="bg-white p-2 rounded border border-slate-200/80 text-[11px] text-slate-600 mt-1.5 font-mono">
                    {JSON.stringify(evt.metadata_json, null, 1)}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
