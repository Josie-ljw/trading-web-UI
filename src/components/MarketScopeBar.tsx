import { useTranslation } from 'react-i18next'

import { MARKET_TAB_IDS, type MarketTabId } from '../data/marketCategories'

type Props = {
  value: MarketTabId
  onChange: (tab: MarketTabId) => void
}

export function MarketScopeBar({ value, onChange }: Props) {
  const { t } = useTranslation()

  return (
    <section className="market-scope-bar" aria-label={t('markets.scopeLabel')}>
      <div className="market-scope-bar-inner">
        <span className="market-scope-title">{t('markets.scopeLabel')}</span>
        <div className="market-scope-tabs" role="tablist" aria-label={t('markets.categoryTabs')}>
          {MARKET_TAB_IDS.map((id) => (
            <button
              key={id}
              type="button"
              role="tab"
              aria-selected={value === id}
              className={`market-scope-tab ${value === id ? 'on' : ''}`}
              onClick={() => onChange(id)}
            >
              {t(`markets.tabs.${id}`)}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
