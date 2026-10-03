import React, { useState } from 'react';
import { Search, Sparkles, AlertTriangle } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const SearchBox = ({ onSearch, onOpenEmergency }) => {
  const [query, setQuery] = useState('');
  const { t } = useLanguage();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleChipClick = (text) => {
    setQuery(text);
    onSearch(text);
  };

  const chips = [
    "Mujhe aaj cardiologist chahiye",
    "Orthopedic consultation",
    "X-ray test",
    "Blood test",
    "Emergency care"
  ];

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-4 sm:p-6 mb-6">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
          <Sparkles className="w-5 h-5 text-setu-600" />
          <span>What healthcare help do you need?</span>
        </h2>

        {/* Prominent Emergency Button */}
        <button
          onClick={onOpenEmergency}
          className="bg-red-600 hover:bg-red-700 text-white font-bold text-xs sm:text-sm px-4 py-2 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center space-x-1.5 animate-restrained-pulse cursor-pointer"
        >
          <AlertTriangle className="w-4 h-4 fill-white" />
          <span>{t('emergencyButton')}</span>
        </button>
      </div>

      <form onSubmit={handleSearchSubmit} className="relative mb-3">
        <div className="relative flex items-center">
          <Search className="w-5 h-5 text-slate-400 absolute left-4" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t('searchPlaceholder')}
            className="w-full pl-12 pr-32 py-3.5 bg-slate-50 border border-slate-300 focus:border-setu-600 focus:bg-white rounded-xl text-sm font-medium text-slate-900 placeholder-slate-400 focus:outline-none transition-all shadow-inner"
          />
          <button
            type="submit"
            className="absolute right-2 bg-setu-600 hover:bg-setu-700 text-white font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg transition-colors shadow-sm cursor-pointer"
          >
            {t('searchButton')}
          </button>
        </div>
      </form>

      {/* Quick Example Chips */}
      <div className="flex items-center space-x-2 overflow-x-auto pt-1 pb-1">
        <span className="text-xs font-semibold text-slate-400 whitespace-nowrap">Try:</span>
        {chips.map((chip, idx) => (
          <button
            key={idx}
            onClick={() => handleChipClick(chip)}
            className="bg-slate-100 hover:bg-setu-50 hover:text-setu-700 hover:border-setu-300 text-slate-600 border border-slate-200 text-xs px-3 py-1 rounded-full whitespace-nowrap transition-colors cursor-pointer"
          >
            {chip}
          </button>
        ))}
      </div>
    </div>
  );
};
