import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import en from './languages/en/en.json';
import fi from './languages/fi/fi.json';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: en
      },
	  fi: {
		translation: fi
	  }
	},
    lng: 'en', // default language
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // react already safes from xss
    }
  });

export default i18n;
