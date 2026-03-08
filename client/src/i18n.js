import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // Only these three languages are supported
        supportedLngs: ['en', 'hi', 'gu'],
        fallbackLng: 'en',
        // Strip region codes: 'en-US' → 'en', 'en-IN' → 'en'
        load: 'languageOnly',
        debug: false,
        interpolation: {
            escapeValue: false,
        },
        backend: {
            loadPath: '/locales/{{lng}}/translation.json',
        },
        detection: {
            // Check localStorage first, then browser language
            order: ['localStorage', 'navigator'],
            // Key used to store the language in localStorage
            lookupLocalStorage: 'i18nextLng',
            // Cache the chosen language back to localStorage
            caches: ['localStorage'],
        },
        react: {
            useSuspense: false
        }
    });

export default i18n;
