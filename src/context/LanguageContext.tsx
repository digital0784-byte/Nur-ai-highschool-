import React, { createContext, useContext, useState, useEffect } from 'react';
import { LanguageCode, LanguageMeta, UITranslations } from '../types';
import { supportedLanguages, translations } from '../i18n/translations';

interface LanguageContextType {
  language: LanguageCode;
  setLanguage: (lang: LanguageCode) => void;
  t: UITranslations;
  meta: LanguageMeta;
  languages: LanguageMeta[];
  isRtl: boolean;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState<LanguageCode>(() => {
    const saved = localStorage.getItem('app_tutorial_language');
    if (saved && ['am', 'en', 'ti', 'om', 'ar', 'so'].includes(saved)) {
      return saved as LanguageCode;
    }
    return 'am';
  });

  const setLanguage = (lang: LanguageCode) => {
    setLanguageState(lang);
    localStorage.setItem('app_tutorial_language', lang);
  };

  const currentMeta = supportedLanguages.find((l) => l.code === language) || supportedLanguages[0];
  const currentTranslations = translations[language] || translations.am;
  const isRtl = currentMeta.dir === 'rtl';

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = isRtl ? 'rtl' : 'ltr';
  }, [language, isRtl]);

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t: currentTranslations,
        meta: currentMeta,
        languages: supportedLanguages,
        isRtl,
      }}
    >
      <div dir={isRtl ? 'rtl' : 'ltr'} className={isRtl ? 'font-arabic' : ''}>
        {children}
      </div>
    </LanguageContext.Provider>
  );
};

export function useLanguage(): LanguageContextType {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
