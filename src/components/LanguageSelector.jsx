import React from 'react';
import { useTranslation, languageNames } from '@/lib/i18n.jsx';

const languageFlags = {
  es: '🇪🇸',
  en: '🇬🇧',
  fr: '🇫🇷',
  th: '🇹🇭',
  vi: '🇻🇳',
};

const LanguageSelector = () => {
  const { language, changeLanguage, supportedLanguages } = useTranslation();

  return (
    <div className="flex items-center justify-center gap-3 md:gap-5 flex-wrap">
      {supportedLanguages.map((lang) => (
        <button
          key={lang}
          onClick={() => changeLanguage(lang)}
          className={`flex flex-col items-center gap-2 p-2 rounded-lg transition-all duration-300 transform hover:scale-110 ${language === lang ? 'bg-blue-500/50' : 'hover:bg-blue-500/20'}`}
          aria-label={`Changer la langue en ${languageNames[lang]}`}
        >
          <span className="text-3xl">{languageFlags[lang]}</span>
          <span className={`text-sm font-bold transition-colors ${language === lang ? 'text-white' : 'text-blue-200 group-hover:text-white'}`}>
            {languageNames[lang] || lang.toUpperCase()}
          </span>
        </button>
      ))}
    </div>
  );
};

export default LanguageSelector;