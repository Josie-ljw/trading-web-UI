import { useTranslation } from 'react-i18next'

import type { AppLocale } from '../i18n/config'
import { LOCALE_CODES } from '../i18n/config'

const LABEL_KEYS: Record<AppLocale, 'app.locale_zh' | 'app.locale_en'> = {
  'zh-CN': 'app.locale_zh',
  en: 'app.locale_en',
}

function normalizeLang(raw: string): AppLocale {
  if (LOCALE_CODES.includes(raw as AppLocale)) return raw as AppLocale
  if (raw.startsWith('zh')) return 'zh-CN'
  return 'en'
}

export function LocaleSwitcher() {
  const { i18n, t } = useTranslation()
  const value = normalizeLang(i18n.language)

  return (
    <label className="locale-select-wrap">
      <span className="visually-hidden">{t('app.languageLabel')}</span>
      <select
        className="locale-select"
        value={value}
        aria-label={t('app.languageLabel')}
        onChange={(e) => {
          const code = e.target.value as AppLocale
          void i18n.changeLanguage(code)
          document.documentElement.lang = code
        }}
      >
        {LOCALE_CODES.map((code) => (
          <option key={code} value={code}>
            {t(LABEL_KEYS[code])}
          </option>
        ))}
      </select>
    </label>
  )
}
