'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';

import en from '@/locales/en.json';
import fr from '@/locales/fr.json';
import ar from '@/locales/ar.json';

type Language = 'EN' | 'FR' | 'AR';
type UserInterest = 'creator' | 'brand' | null;

const translations = {
  EN: en,
  FR: fr,
  AR: ar,
};

type Translations = { [key: string]: any };

interface LanguageContextType {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string, options?: { [key: string]: string | number, returnObjects?: boolean }) => any;
  dir: 'ltr' | 'rtl';
  userInterest: UserInterest;
  setUserInterest: (interest: 'creator' | 'brand') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<Language>('EN');
  const [userInterest, setUserInterestState] = useState<UserInterest>(null);

  useEffect(() => {
    const savedLanguage = localStorage.getItem('vibematch-language') as Language;
    if (savedLanguage && ['EN', 'FR', 'AR'].includes(savedLanguage)) {
      setLanguageState(savedLanguage);
    }
    const savedInterest = localStorage.getItem('userInterest') as UserInterest;
    if (savedInterest && ['creator', 'brand'].includes(savedInterest)) {
        setUserInterestState(savedInterest);
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('vibematch-language', lang);
  };

  const setUserInterest = (interest: 'creator' | 'brand') => {
    setUserInterestState(interest);
    localStorage.setItem('userInterest', interest);
  };
  
  const dir = useMemo(() => language === 'AR' ? 'rtl' : 'ltr', [language]);

  useEffect(() => {
    document.documentElement.lang = language.toLowerCase();
    document.documentElement.dir = dir;
    if (language === 'AR') {
      document.documentElement.style.setProperty('--font-body', "'Tajawal', sans-serif");
      document.documentElement.style.setProperty('--font-headline', "'Tajawal', sans-serif");
    } else {
      document.documentElement.style.setProperty('--font-body', "'Inter', sans-serif");
      document.documentElement.style.setProperty('--font-headline', "'Poppins', sans-serif");
    }
  }, [language, dir]);


  const t = (key: string, options?: { [key: string]: string | number, returnObjects?: boolean }): any => {
    const keys = key.split('.');
    let result = translations[language] as Translations;

    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        // Fallback to English if key not found
        let fallbackResult = translations['EN'] as Translations;
        for (const fk of keys) {
            fallbackResult = fallbackResult?.[fk];
            if(fallbackResult === undefined) return key;
        }
        result = fallbackResult;
        break;
      }
    }
    
    if (typeof result === 'object' && options?.returnObjects) {
      return result;
    }

    if (typeof result === 'string' && options) {
      Object.keys(options).forEach(optKey => {
        if(optKey !== 'returnObjects') {
            result = (result as string).replace(`{{${optKey}}}`, String(options[optKey]));
        }
      });
    }

    return result || key;
  };

  const value = {
    language,
    setLanguage,
    t,
    dir,
    userInterest,
    setUserInterest,
  };

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = (): LanguageContextType => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

    