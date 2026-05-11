import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

import en from '../locales/en.json'
import zhCN from '../locales/zh-CN.json'

export const LOCALE_CODES = ['zh-CN', 'en'] as const
export type AppLocale = (typeof LOCALE_CODES)[number]

void i18n
  .use(initReactI18next)
  .init({
    resources: {
      'zh-CN': { translation: zhCN },
      en: { translation: en },
    },
    lng: 'zh-CN',
    fallbackLng: 'zh-CN',
    supportedLngs: ['zh-CN', 'en'],
    interpolation: { escapeValue: false },
  })
  .then(() => {
    try {
      const stored = localStorage.getItem('i18nextLng')
      if (stored === 'en-SG' || i18n.language === 'en-SG') {
        void i18n.changeLanguage('en')
        document.documentElement.lang = 'en'
      }
    } catch {
      /* ignore */
    }
  })

export default i18n
