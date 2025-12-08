
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
  t: (key: string, options?: Record<string, any>) => any;
  dir: 'ltr' | 'rtl';
  userInterest: UserInterest;
  setUserInterest: (interest: 'creator' | 'brand') => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const messageCache = new Map<string, IntlMessageFormat>();

function getNestedTranslation(translations: Translations, key: string): any {
  return key.split('.').reduce((obj, k) => (obj && obj[k] !== undefined) ? obj[k] : undefined, translations);
}

// Function to convert a string from CAMEL_CASE or PASCAL_CASE to "Title Case"
function formatKey(key: string) {
    if (!key || typeof key !== 'string') return '';
    const lastPart = key.split('.').pop() || '';
    const words = lastPart.replace(/_/g, ' ').split(/(?=[A-Z])/);
    return words
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
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


  const t = (key: string, options?: Record<string, any>): any => {
    const returnObjects = options?.returnObjects;
    
    const formatOptions = options ? Object.fromEntries(
        Object.entries(options).filter(([k]) => k !== 'returnObjects')
    ) : {};

    const currentTranslations = translations[language];
    let message = getNestedTranslation(currentTranslations, key);

    // Fallback to English if the key is not found in the current language
    if (message === undefined) {
      message = getNestedTranslation(translations['EN'], key);
    }
    
    // If still not found, return a formatted, safe version of the key itself.
    if (message === undefined) {
        return formatKey(key);
    }

    // If the message is an object and the caller wants the object (e.g., for arrays in JSON)
    if (typeof message === 'object' && returnObjects) {
      return message;
    }
    
    // If the message is not a string, it's likely an object or array that wasn't meant to be formatted.
    if (typeof message !== 'string') {
      return formatKey(key);
    }

    // Check if there are any actual values to format
    const hasFormatOptions = Object.keys(formatOptions).length > 0;

    if (hasFormatOptions) {
      const cacheKey = `${key}_${language}`;
      let msgFormat = messageCache.get(cacheKey);

      if (!msgFormat) {
        try {
          msgFormat = new IntlMessageFormat(message, language);
          messageCache.set(cacheKey, msgFormat);
        } catch (e) {
          console.error(`Error compiling message for key "${key}" with message "${message}":`, e);
          return formatKey(key);
        }
      }
      
      try {
        const parts = msgFormat.formatToParts(formatOptions);
        return parts.map((part, index) => {
            if (part.type === 'literal') {
                return part.value;
            }
            // The key for the rich text component is the `value` of the part.
            const richTextElement = (formatOptions as any)[part.value];
            if (typeof richTextElement === 'function') {
                // Ensure a unique key is passed to the component
                return React.cloneElement(richTextElement(part.value), { key: index });
            }
            return part.value;
        });
      } catch (e) {
          console.error(`Error formatting message for key "${key}" with options:`, e, formatOptions);
          return formatKey(key);
      }
    }
    
    return message;
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
