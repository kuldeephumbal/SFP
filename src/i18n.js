import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import Backend from 'i18next-http-backend';

// CRITICAL: Ensure Gujarati is the default if no preference is saved
if (!localStorage.getItem('i18nextLng')) {
    localStorage.setItem('i18nextLng', 'gu');
}

i18n
    .use(Backend)
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        // Only these three languages are supported
        supportedLngs: ['en', 'hi', 'gu'],
        // Set fixed starting language from localStorage or hardcoded default
        lng: localStorage.getItem('i18nextLng') || 'gu',
        fallbackLng: 'gu',
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
            // ONLY check localStorage to avoid automatic browser English detection
            order: ['localStorage'],
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
