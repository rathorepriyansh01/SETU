import React from 'react';
import { Clock, ShieldAlert, CheckCircle, AlertTriangle } from 'lucide-react';

export const StatusBadge = ({ status = 'Available', showIcon = True }) => {
  let colorStyle = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let dotStyle = 'bg-emerald-500';
  let text = status;

  if (status === 'Limited' || status === 'Busy' || status === 'Warning') {
    colorStyle = 'bg-amber-50 text-amber-700 border-amber-200';
    dotStyle = 'bg-amber-500';
  } else if (status === 'Critical' || status === 'FULL') {
    colorStyle = 'bg-red-50 text-red-700 border-red-200';
    dotStyle = 'bg-red-500';
  }

  return (
    <span className={`inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${colorStyle}`}>
      <span className={`w-2 h-2 rounded-full ${dotStyle}`}></span>
      <span>{text}</span>
    </span>
  );
};

export const FreshnessBadge = ({ status = 'Fresh', lastUpdated }) => {
  let style = 'bg-emerald-50 text-emerald-700 border-emerald-200';
  let label = 'Fresh';

  if (status === 'Aging') {
    style = 'bg-amber-50 text-amber-700 border-amber-200';
    label = 'Aging (15m+)';
  } else if (status === 'Stale') {
    style = 'bg-orange-50 text-orange-700 border-orange-300';
    label = 'Stale (30m+)';
  } else if (status === 'Offline') {
    style = 'bg-red-50 text-red-700 border-red-300';
    label = 'Offline';
  }

  return (
    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[11px] font-medium border ${style}`} title={lastUpdated ? `Last updated: ${new Date(lastUpdated).toLocaleTimeString()}` : ''}>
      <Clock className="w-3 h-3" />
      <span>{label}</span>
    </span>
  );
};
