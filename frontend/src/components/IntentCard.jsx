import React from 'react';
import { CheckCircle2, Cpu, ShieldCheck } from 'lucide-react';

export const IntentCard = ({ intentResult }) => {
  if (!intentResult || !intentResult.understood_intent) return null;

  const { understood_intent, ai_explanation } = intentResult;

  return (
    <div className="bg-gradient-to-r from-slate-900 to-setu-900 text-white p-4 sm:p-5 rounded-2xl shadow-md border border-setu-700/50 mb-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <Cpu className="w-5 h-5 text-teal-400" />
          <h3 className="font-bold text-sm sm:text-base text-white">We understood your requirement</h3>
        </div>
        <span className="bg-teal-500/20 text-teal-300 text-[11px] font-semibold px-2.5 py-0.5 rounded-full border border-teal-500/30 flex items-center space-x-1">
          <ShieldCheck className="w-3 h-3" />
          <span>Backend Fact Grounded</span>
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 mb-3 text-xs">
        <div>
          <span className="text-slate-400 block text-[10px]">Department</span>
          <strong className="text-teal-300 font-semibold text-sm">{understood_intent.department || 'General'}</strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Service</span>
          <strong className="text-white font-semibold text-sm">{understood_intent.service || 'Consultation'}</strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Urgency</span>
          <strong className="text-amber-300 font-semibold text-sm">{understood_intent.urgency || 'Today'}</strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Emergency Flag</span>
          <strong className={`font-semibold text-sm ${understood_intent.emergency ? 'text-red-400' : 'text-emerald-400'}`}>
            {understood_intent.emergency ? 'Yes (Urgent)' : 'No (Routine)'}
          </strong>
        </div>
      </div>

      <p className="text-xs text-slate-300 leading-relaxed italic">
        "{ai_explanation}"
      </p>
    </div>
  );
};
