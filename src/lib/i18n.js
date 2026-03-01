import esTranslations from '@/locales/es.json';
import enTranslations from '@/locales/en.json';
import frTranslations from '@/locales/fr.json';
import thTranslations from '@/locales/th.json';
import viTranslations from '@/locales/vi.json';

export const translations = {
  es: esTranslations,
  en: enTranslations,
  fr: frTranslations,
  th: thTranslations,
  vi: viTranslations,
};

export const supportedLanguages = Object.keys(translations);
export const defaultLanguage = 'es';

export const languageNames = {
  es: 'Español',
  en: 'English',
  fr: 'Français',
  th: 'ไทย',
  vi: 'Tiếng Việt',
};

export const toolKeys = Object.keys(translations.es.tools);

const langSlugToKeyMaps = {};
for (const lang of supportedLanguages) {
  langSlugToKeyMaps[lang] = {};
  for (const key of toolKeys) {
    const slug = translations[lang]?.tools[key]?.slug;
    if (slug) {
        langSlugToKeyMaps[lang][slug] = key;
    }
  }
}

export const getToolKeyFromSlug = (slug, lang) => {
    return langSlugToKeyMaps[lang]?.[slug];
};