import { useTranslation } from 'react-i18next'

import { DEMO_CALENDAR, DEMO_NEWS, DEMO_SENTIMENT } from '../data/insights'
import type { AppLocale } from '../i18n/config'

export function InsightsPanel() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as AppLocale

  return (
    <section className="panel insights-panel">
      <div className="panel-head">
        <h2>{t('insights.title')}</h2>
      </div>
      <div className="insights-grid">
        <div className="insight-block">
          <h3>{t('insights.news')}</h3>
          <ul className="news-list">
            {DEMO_NEWS.map((n) => (
              <li key={n.id}>
                <span className="tag">{n.tag}</span>
                <p>{n.title[lang]}</p>
                <button type="button" className="linkish">
                  {t('insights.readMore')}
                </button>
              </li>
            ))}
          </ul>
        </div>
        <div className="insight-block">
          <h3>{t('insights.calendar')}</h3>
          <ul className="cal-list">
            {DEMO_CALENDAR.map((c) => (
              <li key={c.id} data-impact={c.impact}>
                <span className="cal-time">{c.time}</span>
                <span className="cal-event">{c.event[lang]}</span>
              </li>
            ))}
          </ul>
        </div>
        <div className="insight-block sentiment">
          <h3>{t('insights.sentiment')}</h3>
          <div className="meter-list">
            {Object.entries(DEMO_SENTIMENT).map(([k, v]) => (
              <div key={k} className="meter">
                <div className="meter-label">{v.label[lang]}</div>
                <div className="meter-track">
                  <div className="meter-fill" style={{ width: `${v.value}%` }} />
                </div>
                <div className="meter-val">{v.value}%</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
