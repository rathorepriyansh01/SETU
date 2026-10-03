import React, { createContext, useContext, useState } from 'react';
import { translations } from '../utils/i18n';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [lang, setLang] = useState(localStorage.getItem('setu_lang') || 'en');

  const toggleLanguage = () => {
    const nextLang = lang === 'en' ? 'hi' : 'en';
    setLang(nextLang);
    localStorage.setItem('setu_lang', nextLang);
  };

  const t = (keyPath) => {
    const keys = keyPath.split('.');
    let current = translations[lang] || translations.en;
    for (const key of keys) {
      if (current[key] !== undefined) {
        current = current[key];
      } else {
        // Fallback to English
        let fallback = translations.en;
        for (const k of keys) {
          if (fallback[k] !== undefined) fallback = fallback[k];
          else return keyPath;
        }
        return fallback;
      }
    }
    return current;
  };

  return (
    <LanguageContext.Provider value={{ lang, setLang, toggleLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);
