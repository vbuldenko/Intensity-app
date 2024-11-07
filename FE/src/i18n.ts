import i18n from "i18next";
import { initReactI18next } from "react-i18next";
// import LanguageDetector from "i18next-browser-languagedetector";

import en from "./locales/en.json";
import ua from "./locales/ua.json";

i18n
  // .use(LanguageDetector) // Detects user language
  .use(initReactI18next) // Passes i18n instance to react-i18next
  .init({
    resources: {
      en: {
        translation: en,
      },
      ua: {
        translation: ua,
      },
    },
    fallbackLng: "ua", // Default language
    interpolation: {
      escapeValue: false, // React already escapes values
    },
    // detection: {
    //   // Options for language detection
    //   order: [
    //     "querystring",
    //     "cookie",
    //     "localStorage",
    //     "navigator",
    //     "htmlTag",
    //     "path",
    //     "subdomain",
    //   ],
    //   caches: ["localStorage", "cookie"],
    // },
  });

export default i18n;
