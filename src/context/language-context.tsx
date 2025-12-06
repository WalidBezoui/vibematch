
'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, ReactNode } from 'react';
import { IntlMessageFormat } from 'intl-messageformat';

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

const messageCache = new Map<string, IntlMessageFormat>();

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
    messageCache.clear(); // Clear cache on language change
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


  const t = (key: string, options?: { [key: string]: any, returnObjects?: boolean }): any => {
    const keys = key.split('.');
    let result: any = translations[language];

    for (const k of keys) {
      result = result?.[k];
      if (result === undefined) {
        let fallbackResult: any = translations['EN'];
        for (const fk of keys) {
          fallbackResult = fallbackResult?.[fk];
          if (fallbackResult === undefined) return key;
        }
        result = fallbackResult;
        break;
      }
    }

    if (typeof result === 'object' && options?.returnObjects) {
      return result;
    }

    // Determine if the result is a string that needs formatting or a pluralization object
    const message = typeof result === 'object' ? JSON.stringify(result) : String(result);
    
    if (options && Object.keys(options).filter(k => k !== 'returnObjects').length > 0) {
      // Check for simple {{variable}} replacement first
      if (typeof result === 'string' && /\{\{.*\}\}/.test(result)) {
        let tempResult = result;
        for (const [optKey, optValue] of Object.entries(options)) {
          tempResult = tempResult.replace(`{{${optKey}}}`, String(optValue));
        }
        return tempResult;
      }

      // Handle ICU message format for pluralization
      const cacheKey = `${key}_${language}`;
      let msgFormat = messageCache.get(cacheKey);

      if (!msgFormat) {
        try {
          msgFormat = new IntlMessageFormat(message, language);
          messageCache.set(cacheKey, msgFormat);
        } catch (e) {
          console.error(`Error compiling message for key "${key}":`, e);
          return message; // Return the raw string on error
        }
      }
      
      try {
          return msgFormat.format(options);
      } catch (e) {
          console.error(`Error formatting message for key "${key}" with options:`, e);
          return message; // Return raw string on formatting error
      }
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
