
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
  t: (key: string, options?: { [key: string]: any, returnObjects?: boolean, defaultValue?: string }) => any;
  dir: 'ltr' | 'rtl';
  userInterest: UserInterest;
  setUserInterest: (interest: 'creator' | 'brand') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const messageCache = new Map<string, IntlMessageFormat>();

function getNestedTranslation(translations: Translations, key: string): any {
  return key.split('.').reduce((obj, k) => (obj && obj[k] !== 'undefined') ? obj[k] : undefined, translations);
}

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


  const t = (key: string, options?: { [key: string]: any, returnObjects?: boolean, defaultValue?: string }): any => {
    const currentTranslations = translations[language];
    const englishTranslations = translations['EN'];
    
    let result = getNestedTranslation(currentTranslations, key);

    if (result === undefined) {
      result = getNestedTranslation(englishTranslations, key);
    }
    
    if (result === undefined) {
        return options?.defaultValue !== undefined ? options.defaultValue : key;
    }

    if (typeof result === 'object' && options?.returnObjects) {
      return result;
    }
    
    if (typeof result !== 'string') {
        return result;
    }

    const message = result;
    
    // Check if there are any actual values to format, ignoring our custom options
    const formatOptions = options ? Object.keys(options).filter(k => k !== 'returnObjects' && k !== 'defaultValue') : [];

    if (formatOptions.length > 0) {
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
          console.error(`Error formatting message for key "${key}" with options:`, e, options);
          return message; // Return raw string on formatting error
      }
    }
    
    return result;
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
