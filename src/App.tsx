import { useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { AIAssistantFloat } from './components/AIAssistantFloat'
import { CandlestickChart } from './components/CandlestickChart'
import { LocaleSwitcher } from './components/LocaleSwitcher'
import { ThemeToggle } from './components/ThemeToggle'
import { MarketScopeBar } from './components/MarketScopeBar'
import { MarketTable } from './components/MarketTable'
import { PortfolioPanel } from './components/PortfolioPanel'
import { TradePanel } from './components/TradePanel'
import { QuoteProvider } from './context/QuoteProvider'
import { ThemeProvider } from './context/ThemeProvider'
import type { ChartTimeframe } from './data/chartTimeframe'
import { CHART_TIMEFRAMES } from './data/chartTimeframe'
import { computeSMA, generateCandles } from './data/generateCandles'
import { getInstrumentsForTab, type MarketTabId } from './data/marketCategories'
import { INSTRUMENTS } from './data/instruments'
import { useWatchlist } from './hooks/useWatchlist'

import './App.css'

function Shell() {
  const { t } = useTranslation()
  const [selectedSymbol, setSelectedSymbol] = useState('EURUSD')
  const [timeframe, setTimeframe] = useState<ChartTimeframe>('H1')
  const [showMa, setShowMa] = useState(true)
  const [aiOpen, setAiOpen] = useState(false)
  const [marketTab, setMarketTab] = useState<MarketTabId>('hot')
  const { toggle, has } = useWatchlist()

  const tabInstruments = useMemo(() => getInstrumentsForTab(marketTab), [marketTab])

  useEffect(() => {
    if (tabInstruments.length === 0) return
    const inTab = tabInstruments.some((i) => i.symbol === selectedSymbol)
    if (!inTab) {
      setSelectedSymbol(tabInstruments[0]!.symbol)
    }
  }, [marketTab, tabInstruments, selectedSymbol])

  const selectedInst = useMemo(
    () => INSTRUMENTS.find((i) => i.symbol === selectedSymbol) ?? INSTRUMENTS[0]!,
    [selectedSymbol],
  )

  const chartData = useMemo(
    () => generateCandles(selectedInst.symbol, selectedInst.baseBid, timeframe),
    [selectedInst.symbol, selectedInst.baseBid, timeframe],
  )

  const maData = useMemo(() => {
    if (!showMa) return undefined
    return computeSMA(chartData, 20)
  }, [chartData, showMa])

  const secondsVisible = timeframe === 'M1' || timeframe === 'M5'

  return (
    <div className="nebula-terminal">
      <header className="top-bar">
        <div className="brand">
          <span className="logo nebula-logo">{t('app.brandLogo')}</span>
          <div className="titles">
            <h1>{t('app.title')}</h1>
            <p className="disclaimer">{t('app.subtitle')}</p>
          </div>
        </div>
        <div className="top-actions">
          <div className="top-actions-row">
            <ThemeToggle />
            <LocaleSwitcher />
          </div>
        </div>
      </header>

      <section className="account-strip" aria-label="Demo account">
        <div className="metric">
          <span className="m-label">{t('account.equity')}</span>
          <span className="m-val">$10,428.61</span>
        </div>
        <div className="metric">
          <span className="m-label">{t('account.margin')}</span>
          <span className="m-val">$1,204.00</span>
        </div>
        <div className="metric">
          <span className="m-label">{t('account.pl')}</span>
          <span className="m-val chg-up">+$128.40</span>
        </div>
        <p className="sync-note">{t('app.syncHint')}</p>
      </section>

      <MarketScopeBar value={marketTab} onChange={setMarketTab} />

      <div className="terminal-workspace">
        <aside className="col-watchlist">
          <MarketTable
            instruments={tabInstruments}
            selectedSymbol={selectedSymbol}
            onSelectSymbol={setSelectedSymbol}
            hasWatch={has}
            onToggleWatch={toggle}
          />
        </aside>

        <main className="col-chart">
          <section className="panel chart-panel chart-panel--main">
            <div className="panel-head chart-toolbar">
              <div>
                <h2>{t('chart.title')}</h2>
                <p className="sub chart-symbol">
                  {selectedSymbol} · {t(`markets.tabs.${marketTab}`)} · {t('chart.engine')}
                </p>
              </div>
              <div className="chart-toolbar-actions">
                <div className="tf-group" role="group" aria-label={t('chart.timeframe')}>
                  {CHART_TIMEFRAMES.map((tf) => (
                    <button
                      key={tf}
                      type="button"
                      className={`tf-btn ${timeframe === tf ? 'on' : ''}`}
                      onClick={() => setTimeframe(tf)}
                    >
                      {tf}
                    </button>
                  ))}
                </div>
                <label className="ma-toggle">
                  <input
                    type="checkbox"
                    checked={showMa}
                    onChange={(e) => setShowMa(e.target.checked)}
                  />
                  <span>{t('chart.ma20')}</span>
                </label>
              </div>
            </div>
            <p className="chart-hint">{t('chart.hint')}</p>
            <div className="chart-frame chart-frame--main">
              <CandlestickChart
                symbol={selectedSymbol}
                data={chartData}
                maData={maData}
                secondsVisible={secondsVisible}
              />
            </div>
          </section>
        </main>

        <aside className="col-trade">
          <TradePanel key={selectedInst.symbol} instrument={selectedInst} />
        </aside>
      </div>

      <PortfolioPanel />

      <AIAssistantFloat
        symbol={selectedSymbol}
        digits={selectedInst.digits}
        open={aiOpen}
        onToggle={() => setAiOpen((v) => !v)}
      />
    </div>
  )
}

export default function App() {
  return (
    <ThemeProvider>
      <QuoteProvider>
        <Shell />
      </QuoteProvider>
    </ThemeProvider>
  )
}
