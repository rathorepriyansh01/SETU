import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { Activity, ShieldAlert, Globe, User, Radio, Hospital } from 'lucide-react';

export const Header = () => {
  const { role, switchRole, activeHospitalId, setActiveHospitalId } = useAuth();
  const { lang, toggleLanguage, t } = useLanguage();

  return (
    <header className="bg-slate-900 text-white border-b border-slate-800 sticky top-0 z-50 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo & Vision */}
        <div className="flex items-center space-x-3">
          <div className="bg-setu-600 p-2 rounded-lg flex items-center justify-center text-white shadow-inner">
            <Activity className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-bold text-xl tracking-tight text-white font-sans">{t('title')}</span>
              <span className="bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs px-2 py-0.5 rounded font-medium">
                {t('demoNotice')}
              </span>
            </div>
            <p className="text-xs text-slate-400 font-normal hidden sm:block">
              {t('tagline')} • <span className="text-teal-400 font-medium">{t('city')}</span>
            </p>
          </div>
        </div>

        {/* Live Network & Language & Role Switcher */}
        <div className="flex items-center space-x-3">
          
          {/* Live Network Status */}
          <div className="hidden lg:flex items-center space-x-1.5 bg-slate-800/80 px-3 py-1.5 rounded-full border border-slate-700 text-xs text-slate-300">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="font-medium">Live Grid • Bhopal</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={toggleLanguage}
            className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-semibold text-slate-200 transition-colors"
            title="Switch Language"
          >
            <Globe className="w-3.5 h-3.5 text-teal-400" />
            <span>{lang === 'en' ? ' हिंदी' : ' English'}</span>
          </button>

          {/* Role Switcher (Unified Shell Requirement) */}
          <div className="flex items-center bg-slate-800 border border-slate-700 rounded-lg p-1 text-xs">
            <User className="w-3.5 h-3.5 text-setu-500 ml-1.5 mr-1 hidden sm:block" />
            <select
              value={role}
              onChange={(e) => switchRole(e.target.value)}
              className="bg-transparent text-slate-200 font-medium focus:outline-none cursor-pointer pr-1 text-xs"
            >
              <option value="PATIENT" className="bg-slate-900 text-slate-100">1. {t('roles.patient')}</option>
              <option value="DISPATCHER" className="bg-slate-900 text-slate-100">2. {t('roles.dispatcher')}</option>
              <option value="HOSPITAL_ADMIN" className="bg-slate-900 text-slate-100">3. {t('roles.hospital')}</option>
              <option value="HEALTH_OFFICER" className="bg-slate-900 text-slate-100">4. {t('roles.admin')}</option>
            </select>
          </div>

          {/* Hospital Switcher if Hospital Admin */}
          {role === 'HOSPITAL_ADMIN' && (
            <select
              value={activeHospitalId}
              onChange={(e) => setActiveHospitalId(Number(e.target.value))}
              className="bg-teal-900/60 border border-teal-600/50 text-teal-200 font-medium focus:outline-none cursor-pointer px-2 py-1.5 rounded-lg text-xs"
            >
              <option value={1}>AIIMS Bhopal</option>
              <option value={2}>Hamidia Hospital</option>
              <option value={3}>Bansal Hospital</option>
              <option value={4}>Chirayu Health City</option>
              <option value={5}>Peoples Hospital</option>
            </select>
          )}

        </div>

      </div>
    </header>
  );
};
