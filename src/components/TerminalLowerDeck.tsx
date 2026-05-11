import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { instrumentDisplayName } from '../data/labels'
import type { AppLocale } from '../i18n/config'
import type { Instrument } from '../data/instruments'
import { INSTRUMENTS } from '../data/instruments'
import {
  generateCandles,
  generateVolatilityLine,
  histogramVolumeFromCandles,
} from '../data/generateCandles'
import { CandlestickChart } from './CandlestickChart'
import { DepthLadderDemo } from './DepthLadderDemo'
import { VolatilityLineChart } from './VolatilityLineChart'
import { VolumeHistogramChart } from './VolumeHistogramChart'

const COMPARE_IDS = ['EURUSD', 'XAUUSD', 'BTCUSD'] as const

type Props = {
  instrument: Instrument
}

export function TerminalLowerDeck({ instrument }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as AppLocale

  const h1Candles = useMemo(
    () => generateCandles(instrument.symbol, instrument.baseBid, 'H1'),
    [instrument.symbol, instrument.baseBid],
  )

  const histData = useMemo(
    () => histogramVolumeFromCandles(h1Candles.slice(-180)),
    [h1Candles],
  )

  const volLine = useMemo(
    () => generateVolatilityLine(`${instrument.symbol}|iv`),
    [instrument.symbol],
  )

  const compareBlocks = useMemo(() => {
    return COMPARE_IDS.map((sym) => {
      const inst = INSTRUMENTS.find((i) => i.symbol === sym)
      if (!inst) return null
      const data = generateCandles(sym, inst.baseBid, 'H1').slice(-120)
      return { sym, data, name: instrumentDisplayName(sym, lang) }
    }).filter((x): x is NonNullable<typeof x> => x != null)
  }, [lang])

  const mid = useMemo(() => {
    const last = h1Candles[h1Candles.length - 1]
    return last?.close ?? instrument.baseBid
  }, [h1Candles, instrument.baseBid])

  return (
    <div className="terminal-lower-deck" aria-label={t('lowerDeck.regionLabel')}>
      <section className="panel lower-deck-section">
        <div className="panel-head lower-deck-head">
          <div>
            <h2>{t('lowerDeck.volumeTitle')}</h2>
            <p className="sub">{t('lowerDeck.volumeSub')}</p>
          </div>
          <span className="lower-deck-tag mono">{instrument.symbol} · H1</span>
        </div>
        <div className="lower-deck-chart-frame">
          <VolumeHistogramChart data={histData} ariaLabel={t('lowerDeck.volumeAria')} />
        </div>
      </section>

      <div className="lower-deck-grid2">
        <section className="panel lower-deck-section">
          <div className="panel-head lower-deck-head">
            <div>
              <h2>{t('lowerDeck.depthTitle')}</h2>
              <p className="sub">{t('lowerDeck.depthSub')}</p>
            </div>
          </div>
          <DepthLadderDemo
            midPrice={mid}
            digits={instrument.digits}
            bidColLabel={t('lowerDeck.depthBid')}
            askColLabel={t('lowerDeck.depthAsk')}
            priceLabel={t('lowerDeck.depthPrice')}
          />
        </section>

        <section className="panel lower-deck-section">
          <div className="panel-head lower-deck-head">
            <div>
              <h2>{t('lowerDeck.volatilityTitle')}</h2>
              <p className="sub">{t('lowerDeck.volatilitySub')}</p>
            </div>
          </div>
          <div className="lower-deck-chart-frame lower-deck-chart-frame--vol">
            <VolatilityLineChart data={volLine} ariaLabel={t('lowerDeck.volatilityAria')} />
          </div>
        </section>
      </div>

      <section className="panel lower-deck-section">
        <div className="panel-head lower-deck-head">
          <div>
            <h2>{t('lowerDeck.compareTitle')}</h2>
            <p className="sub">{t('lowerDeck.compareSub')}</p>
          </div>
        </div>
        <div className="lower-deck-compare-grid">
          {compareBlocks.map(({ sym, data, name }) => (
            <div key={sym} className="lower-deck-mini-panel">
              <div className="lower-deck-mini-head">
                <span className="mono sym-code">{sym}</span>
                <span className="sym-name">
                  {name} · {t('lowerDeck.miniBlurb')}
                </span>
              </div>
              <div className="chart-frame chart-frame--mini">
                <CandlestickChart symbol={sym} data={data} secondsVisible={false} />
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="panel lower-deck-section lower-deck-section--metrics">
        <div className="panel-head lower-deck-head">
          <div>
            <h2>{t('lowerDeck.flowTitle')}</h2>
            <p className="sub">{t('lowerDeck.flowSub')}</p>
          </div>
        </div>
        <div className="flow-meters">
          <div className="flow-meter">
            <span className="flow-meter-label">{t('lowerDeck.flowRetail')}</span>
            <div className="flow-meter-track">
              <div className="flow-meter-fill flow-meter-fill--sell" style={{ width: '62%' }} />
            </div>
            <span className="flow-meter-val mono">62%</span>
          </div>
          <div className="flow-meter">
            <span className="flow-meter-label">{t('lowerDeck.flowInst')}</span>
            <div className="flow-meter-track">
              <div className="flow-meter-fill flow-meter-fill--buy" style={{ width: '54%' }} />
            </div>
            <span className="flow-meter-val mono">54%</span>
          </div>
          <div className="flow-meter">
            <span className="flow-meter-label">{t('lowerDeck.flowHedge')}</span>
            <div className="flow-meter-track">
              <div className="flow-meter-fill flow-meter-fill--buy" style={{ width: '41%' }} />
            </div>
            <span className="flow-meter-val mono">41%</span>
          </div>
        </div>
        <p className="lower-deck-note">{t('lowerDeck.flowNote')}</p>
      </section>
    </div>
  )
}
