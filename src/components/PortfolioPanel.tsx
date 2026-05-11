import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { AppLocale } from '../i18n/config'
import {
  DEMO_FILLS,
  DEMO_ORDERS,
  DEMO_POSITIONS,
  historyLabels,
  orderLabels,
  positionLabels,
} from '../data/demoPortfolio'
import { EquityMiniChart, generateEquityCurve } from './EquityMiniChart'
import { InsightsPanel } from './InsightsPanel'

type Tab = 'positions' | 'orders' | 'history' | 'equity' | 'insights'

export function PortfolioPanel() {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as AppLocale
  const [tab, setTab] = useState<Tab>('positions')

  const pl = useMemo(
    () => DEMO_POSITIONS.reduce((s, p) => s + p.pl + p.swap, 0),
    [],
  )

  const equityData = useMemo(() => generateEquityCurve('demo-equity'), [])

  const posL = positionLabels(lang)
  const ordL = orderLabels(lang)
  const histL = historyLabels(lang)

  const tabs: { id: Tab; label: string }[] = [
    { id: 'positions', label: t('portfolio.positions') },
    { id: 'orders', label: t('portfolio.orders') },
    { id: 'history', label: t('portfolio.history') },
    { id: 'equity', label: t('portfolio.equity') },
    { id: 'insights', label: t('portfolio.insights') },
  ]

  return (
    <section className="panel portfolio-panel" aria-label={t('portfolio.title')}>
      <div className="portfolio-head">
        <div className="portfolio-title-block">
          <h2>{t('portfolio.title')}</h2>
          <p className="sub">{t('portfolio.subtitle')}</p>
        </div>
        <div className={`portfolio-pl ${pl >= 0 ? 'chg-up' : 'chg-down'}`}>
          <span className="pl-label">{t('portfolio.dayPl')}</span>
          <span className="pl-val mono">
            {pl >= 0 ? '+' : ''}
            {pl.toFixed(2)}
          </span>
        </div>
      </div>

      <div className="portfolio-tabs" role="tablist">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            role="tab"
            aria-selected={tab === id}
            className={tab === id ? 'on' : ''}
            onClick={() => setTab(id)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="portfolio-body" role="tabpanel">
        {tab === 'positions' ? (
          <div className="pf-table-wrap">
            <table className="pf-table">
              <thead>
                <tr>
                  <th>{posL.symbol}</th>
                  <th>{posL.side}</th>
                  <th className="num">{posL.vol}</th>
                  <th className="num">{posL.open}</th>
                  <th className="num">{posL.pl}</th>
                  <th className="num">{posL.swap}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_POSITIONS.map((p) => (
                  <tr key={p.id}>
                    <td className="mono">{p.symbol}</td>
                    <td className={p.side === 'buy' ? 'chg-up' : 'chg-down'}>
                      {p.side === 'buy' ? t('trade.buy') : t('trade.sell')}
                    </td>
                    <td className="num mono">{p.volume}</td>
                    <td className="num mono">{p.openPrice}</td>
                    <td className={`num mono ${p.pl >= 0 ? 'chg-up' : 'chg-down'}`}>
                      {p.pl >= 0 ? '+' : ''}
                      {p.pl.toFixed(2)}
                    </td>
                    <td className="num mono">{p.swap.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {tab === 'orders' ? (
          <div className="pf-table-wrap">
            <table className="pf-table">
              <thead>
                <tr>
                  <th>{ordL.symbol}</th>
                  <th>{ordL.side}</th>
                  <th>{ordL.type}</th>
                  <th className="num">{ordL.vol}</th>
                  <th className="num">{ordL.price}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_ORDERS.map((o) => (
                  <tr key={o.id}>
                    <td className="mono">{o.symbol}</td>
                    <td className={o.side === 'buy' ? 'chg-up' : 'chg-down'}>
                      {o.side === 'buy' ? t('trade.buy') : t('trade.sell')}
                    </td>
                    <td>{o.type === 'limit' ? t('trade.limit') : t('trade.stop')}</td>
                    <td className="num mono">{o.volume}</td>
                    <td className="num mono">{o.price}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {tab === 'history' ? (
          <div className="pf-table-wrap">
            <table className="pf-table">
              <thead>
                <tr>
                  <th>{histL.time}</th>
                  <th>{histL.symbol}</th>
                  <th>{histL.side}</th>
                  <th className="num">{histL.vol}</th>
                  <th className="num">{histL.price}</th>
                  <th className="num">{histL.fee}</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_FILLS.map((f) => (
                  <tr key={f.id}>
                    <td className="mono muted">{f.time}</td>
                    <td className="mono">{f.symbol}</td>
                    <td className={f.side === 'buy' ? 'chg-up' : 'chg-down'}>
                      {f.side === 'buy' ? t('trade.buy') : t('trade.sell')}
                    </td>
                    <td className="num mono">{f.volume}</td>
                    <td className="num mono">{f.price}</td>
                    <td className="num mono">{f.fee}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : null}

        {tab === 'equity' ? (
          <div className="equity-tab">
            <p className="equity-caption">{t('portfolio.equityCaption')}</p>
            <div className="equity-chart-shell">
              <EquityMiniChart data={equityData} />
            </div>
          </div>
        ) : null}

        {tab === 'insights' ? (
          <div className="insights-embed">
            <InsightsPanel />
          </div>
        ) : null}
      </div>
    </section>
  )
}
