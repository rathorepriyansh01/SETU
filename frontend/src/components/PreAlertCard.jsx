import React, { useState } from 'react';
import { AlertTriangle, CheckCircle, XCircle, UserCheck, Clock, Truck } from 'lucide-react';

export const PreAlertCard = ({ prealert, onAccept, onReject, onReceived }) => {
  const [showRejectReason, setShowRejectReason] = useState(false);
  const [reasonText, setReasonText] = useState('No ICU Bed Available');

  const status = prealert.status;

  return (
    <div className={`p-4 sm:p-5 rounded-2xl border transition-all ${
      status === 'PENDING'
        ? 'bg-amber-50/80 border-amber-300 shadow-md animate-pulse'
        : status === 'ACCEPTED'
        ? 'bg-emerald-50/60 border-emerald-300'
        : status === 'REJECTED'
        ? 'bg-red-50/60 border-red-300'
        : 'bg-slate-50 border-slate-200'
    }`}>
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center space-x-2">
          <AlertTriangle className={`w-5 h-5 ${status === 'PENDING' ? 'text-amber-600' : 'text-slate-600'}`} />
          <div>
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
              INCOMING EMERGENCY PRE-ALERT
            </span>
            <h4 className="text-sm font-extrabold text-slate-900">
              Emergency #{prealert.emergency_id} • {prealert.incident_type} ({prealert.severity})
            </h4>
          </div>
        </div>

        <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
          status === 'PENDING' ? 'bg-amber-200 text-amber-900 border-amber-300' :
          status === 'ACCEPTED' ? 'bg-emerald-200 text-emerald-900 border-emerald-300' :
          status === 'RECEIVED' ? 'bg-blue-200 text-blue-900 border-blue-300' :
          'bg-red-200 text-red-900 border-red-300'
        }`}>
          {status}
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-white p-2.5 rounded-xl border border-slate-200/80 mb-3">
        <div>
          <span className="text-slate-400 block text-[10px]">Patients</span>
          <strong className="text-slate-900">{prealert.patient_count} patient(s)</strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Ambulance</span>
          <strong className="text-blue-700 flex items-center">
            <Truck className="w-3 h-3 mr-1" />
            {prealert.ambulance_code || 'N/A'}
          </strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">ETA</span>
          <strong className="text-emerald-700 flex items-center">
            <Clock className="w-3 h-3 mr-1" />
            ~7 min
          </strong>
        </div>
        <div>
          <span className="text-slate-400 block text-[10px]">Sent At</span>
          <strong className="text-slate-700">
            {prealert.sent_at ? new Date(prealert.sent_at).toLocaleTimeString() : 'Now'}
          </strong>
        </div>
      </div>

      {/* Rejection reason if rejected */}
      {status === 'REJECTED' && prealert.rejection_reason && (
        <div className="text-xs text-red-700 bg-red-100/80 p-2 rounded-lg border border-red-200 mb-3">
          Rejection Reason: <strong>{prealert.rejection_reason}</strong>
        </div>
      )}

      {/* Actions */}
      {status === 'PENDING' && (
        <div>
          {!showRejectReason ? (
            <div className="flex items-center space-x-2">
              <button
                onClick={() => onAccept(prealert.id)}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <CheckCircle className="w-4 h-4" />
                <span>[ Accept Pre-alert ]</span>
              </button>
              <button
                onClick={() => setShowRejectReason(true)}
                className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-1 cursor-pointer"
              >
                <XCircle className="w-4 h-4" />
                <span>[ Reject ]</span>
              </button>
            </div>
          ) : (
            <div className="bg-white p-3 rounded-xl border border-red-200 space-y-2">
              <label className="text-xs font-bold text-red-800 block">Select Rejection Reason:</label>
              <select
                value={reasonText}
                onChange={(e) => setReasonText(e.target.value)}
                className="w-full text-xs p-2 bg-slate-50 border border-slate-300 rounded-lg"
              >
                <option value="No ICU Bed Available">No ICU Bed Available</option>
                <option value="Specialist Doctor Unavailable">Specialist Doctor Unavailable</option>
                <option value="Oxygen Supply Low">Oxygen Supply Low</option>
                <option value="Emergency Department Full">Emergency Department Full</option>
              </select>
              <div className="flex space-x-2">
                <button
                  onClick={() => {
                    onReject(prealert.id, reasonText);
                    setShowRejectReason(false);
                  }}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold text-xs py-1.5 rounded-lg"
                >
                  Confirm Reject
                </button>
                <button
                  onClick={() => setShowRejectReason(false)}
                  className="bg-slate-200 text-slate-700 text-xs px-3 py-1.5 rounded-lg"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {status === 'ACCEPTED' && (
        <button
          onClick={() => onReceived(prealert.id)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs py-2 px-3 rounded-xl shadow-sm transition-colors flex items-center justify-center space-x-1 cursor-pointer"
        >
          <UserCheck className="w-4 h-4" />
          <span>[ Patient Received at Hospital ]</span>
        </button>
      )}
    </div>
  );
};
