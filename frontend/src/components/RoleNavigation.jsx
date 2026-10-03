import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { 
  Search, AlertTriangle, ShieldCheck, Stethoscope, Activity, 
  Truck, Building2, Package, TrendingUp, BarChart3, RefreshCw, Layers, History
} from 'lucide-react';

export const RoleNavigation = ({ activeTab, setActiveTab }) => {
  const { role } = useAuth();
  const { t } = useLanguage();

  let tabs = [];

  if (role === 'PATIENT') {
    tabs = [
      { id: 'search', label: t('nav.findHealthcare'), icon: Search },
      { id: 'hospitals', label: t('nav.hospitals'), icon: Building2 },
      { id: 'emergency', label: t('nav.emergency'), icon: AlertTriangle, isDanger: true }
    ];
  } else if (role === 'DISPATCHER') {
    tabs = [
      { id: 'control-room', label: t('nav.controlRoom'), icon: Activity },
      { id: 'emergency-queue', label: t('nav.emergencyQueue'), icon: AlertTriangle },
      { id: 'hospitals', label: t('nav.hospitals'), icon: Building2 },
      { id: 'audit', label: t('nav.auditTrail'), icon: History }
    ];
  } else if (role === 'HOSPITAL_ADMIN') {
    tabs = [
      { id: 'dashboard', label: t('nav.dashboard'), icon: Activity },
      { id: 'capacity', label: t('nav.capacity'), icon: Building2 },
      { id: 'prealerts', label: t('nav.prealerts'), icon: AlertTriangle },
      { id: 'inventory', label: t('nav.inventory'), icon: Package },
      { id: 'forecast', label: t('nav.forecast'), icon: TrendingUp }
    ];
  } else if (role === 'HEALTH_OFFICER') {
    tabs = [
      { id: 'command-center', label: t('nav.commandCenter'), icon: BarChart3 },
      { id: 'redistribution', label: t('nav.redistribution'), icon: RefreshCw },
      { id: 'simulation', label: t('nav.simulation'), icon: Layers },
      { id: 'evaluation', label: t('nav.evaluation'), icon: ShieldCheck },
      { id: 'freshness', label: t('nav.dataFreshness'), icon: Activity },
      { id: 'audit', label: t('nav.auditTrail'), icon: History }
    ];
  }

  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex space-x-1 overflow-x-auto py-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                tab.isDanger
                  ? 'bg-red-600 hover:bg-red-700 text-white shadow-sm'
                  : isActive
                  ? 'bg-setu-800 text-white border border-setu-600 shadow-sm'
                  : 'hover:bg-slate-800 text-slate-300'
              }`}
            >
              <Icon className={`w-4 h-4 ${tab.isDanger ? 'text-white' : isActive ? 'text-teal-400' : 'text-slate-400'}`} />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
