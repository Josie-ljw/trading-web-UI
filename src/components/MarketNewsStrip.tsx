import { useTranslation } from 'react-i18next'

import { DEMO_NEWS } from '../data/insights'
import type { AppLocale } from '../i18n/config'

export function MarketNewsStrip() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as AppLocale

  return (
    <div className="market-news-strip" aria-label={t('markets.newsTitle')}>
      <div className="market-news-strip-head">
        <span className="market-news-strip-title">{t('markets.newsTitle')}</span>
      </div>
      <ul className="market-news-list">
        {DEMO_NEWS.map((n) => (
          <li key={n.id} className="market-news-item">
            <span className="market-news-tag">{n.tag}</span>
            <p className="market-news-text">{n.title[lang]}</p>
          </li>
        ))}
      </ul>
    </div>
  )
}
