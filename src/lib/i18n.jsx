import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { translations, supportedLanguages, defaultLanguage, getToolKeyFromSlug, toolKeys, languageNames } from './i18n.js';

export { translations, supportedLanguages, defaultLanguage, getToolKeyFromSlug, toolKeys, languageNames };

export const LanguageContext = createContext();

const getLanguageFromPath = (path) => {
  const lang = path.split('/')[1];
  return supportedLanguages.includes(lang) ? lang : defaultLanguage;
};

export const LanguageProvider = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [language, setLanguage] = useState(() => getLanguageFromPath(location.pathname));

  useEffect(() => {
    const detectedLang = getLanguageFromPath(location.pathname);
    if (detectedLang !== language) {
      setLanguage(detectedLang);
    }
  }, [location.pathname, language]);

  const changeLanguage = useCallback((newLang) => {
    if (supportedLanguages.includes(newLang)) {
      const pathParts = location.pathname.split('/').filter(p => p);
      let currentSlug, currentToolKey;
      
      const currentLangInPath = supportedLanguages.includes(pathParts[0]) ? pathParts[0] : defaultLanguage;
      
      if (supportedLanguages.includes(pathParts[0])) {
          currentSlug = pathParts[1];
      } else if (pathParts.length > 0) {
          currentSlug = pathParts[0];
      }

      if (currentSlug) {
        currentToolKey = getToolKeyFromSlug(currentSlug, currentLangInPath);
      }
      
      let newPath;
      if (currentToolKey && translations[newLang]?.tools[currentToolKey]?.slug) {
        const newSlug = translations[newLang].tools[currentToolKey].slug;
        newPath = newLang === defaultLanguage ? `/${newSlug}` : `/${newLang}/${newSlug}`;
      } else {
        newPath = newLang === defaultLanguage ? '/' : `/${newLang}`;
      }
      
      if (newPath !== location.pathname) {
          setLanguage(newLang);
          navigate(newPath);
      }
    }
  }, [location.pathname, navigate]);

  const t = useCallback((key, options = {}) => {
    const keys = key.split('.');
    let result = translations[language] || translations[defaultLanguage];
    for (const k of keys) {
      result = result?.[k];
    }

    if (result === undefined) {
      let fallbackResult = translations[defaultLanguage];
      for (const fk of keys) {
        fallbackResult = fallbackResult?.[fk];
      }
      if (fallbackResult !== undefined) {
        result = fallbackResult;
      } else {
        console.warn(`Translation key not found in any language: ${key}`);
        return key;
      }
    }
    
    if (typeof result === 'string' && options) {
      Object.keys(options).forEach(optKey => {
        result = result.replace(new RegExp(`\\{${optKey}\\}`, 'g'), options[optKey]);
      });
    }

    return result;
  }, [language]);
  

  return (
    <LanguageContext.Provider value={{ language, changeLanguage, t, supportedLanguages, defaultLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useTranslation must be used within a LanguageProvider');
  }
  return context;
};