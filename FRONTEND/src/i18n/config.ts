import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import enTranslation from './locales/en.json';
import jaTranslation from './locales/ja.json';
import viTranslation from './locales/vi.json';

const resources = {
  en: { translation: enTranslation },
  ja: { translation: jaTranslation },
  vi: { translation: viTranslation },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem('language') || 'en',
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
