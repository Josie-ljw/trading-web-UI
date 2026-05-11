import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useQuotes } from '../hooks/useQuotes'
import type { Instrument } from '../data/instruments'

type Props = {
  instrument: Instrument
}

type SubmitDemo = 'idle' | 'pending' | 'done'

export function TradePanel({ instrument }: Props) {
  const { t } = useTranslation()
  const quotes = useQuotes()
  const q = quotes[instrument.symbol] ?? {
    bid: instrument.baseBid,
    ask: instrument.baseBid + instrument.pipSize,
  }
  const mid = (q.bid + q.ask) / 2

  const [side, setSide] = useState<'buy' | 'sell'>('buy')
  const [orderType, setOrderType] = useState<'market' | 'limit'>('market')
  const [volume, setVolume] = useState(0.1)
  const [leverage, setLeverage] = useState(100)
  const [limitPrice, setLimitPrice] = useState(mid)
  const [tp, setTp] = useState('')
  const [sl, setSl] = useState('')
  const [submitDemo, setSubmitDemo] = useState<SubmitDemo>('idle')
  const [demoTicket, setDemoTicket] = useState<string | null>(null)
  const demoTimers = useRef<ReturnType<typeof setTimeout>[]>([])

  const clearDemoTimers = useCallback(() => {
    demoTimers.current.forEach(clearTimeout)
    demoTimers.current = []
  }, [])

  useEffect(() => {
    return () => clearDemoTimers()
  }, [clearDemoTimers])

  useEffect(() => {
    clearDemoTimers()
    setSubmitDemo('idle')
    setDemoTicket(null)
  }, [instrument.symbol, clearDemoTimers])

  const contractUnit = 100000
  const notional = volume * contractUnit * mid
  const estMargin = notional / leverage

  const fmt = (n: number) => n.toFixed(instrument.digits)

  const execPrice = orderType === 'market' ? (side === 'buy' ? q.ask : q.bid) : limitPrice
  const execPriceStr = execPrice.toFixed(instrument.digits)

  const ticketHint = useMemo(
    () =>
      side === 'buy'
        ? t('trade.hintBuy', { price: execPriceStr })
        : t('trade.hintSell', { price: execPriceStr }),
    [side, execPriceStr, t],
  )

  const confirmationText =
    side === 'buy'
      ? t('trade.confirmBuy', { price: execPriceStr, volume })
      : t('trade.confirmSell', { price: execPriceStr, volume })

  const confirmStepText =
    side === 'buy'
      ? t('trade.confirmBuyStep2')
      : t('trade.confirmSellStep2')

  const runSubmitDemo = () => {
    if (submitDemo !== 'idle') return
    const firstCheck = window.confirm(confirmationText)
    if (!firstCheck) return
    const secondCheck = window.confirm(confirmStepText)
    if (!secondCheck) return

    clearDemoTimers()
    setSubmitDemo('pending')
    const tid = `DEMO-${Date.now().toString(36).toUpperCase().slice(-8)}`
    const t1 = setTimeout(() => {
      setSubmitDemo('done')
      setDemoTicket(
        side === 'buy'
          ? t('trade.toastBuy', { ticket: tid, vol: String(volume), price: execPriceStr })
          : t('trade.toastSell', { ticket: tid, vol: String(volume), price: execPriceStr }),
      )
    }, 420)
    const t2 = setTimeout(() => {
      setSubmitDemo('idle')
      setDemoTicket(null)
    }, 3200)
    demoTimers.current.push(t1, t2)
  }

  return (
    <section className="panel trade-panel" aria-label={t('trade.title')}>
      <div className="panel-head">
        <div>
          <h2>{t('trade.title')}</h2>
          <p className="sub trade-symbol">
            {instrument.symbol} · {t('trade.mid')} {fmt(mid)}
          </p>
        </div>
      </div>

      <div className="trade-side-toggle" role="group" aria-label={t('trade.direction')}>
        <button
          type="button"
          className={`trade-side buy ${side === 'buy' ? 'on' : ''}`}
          onClick={() => setSide('buy')}
        >
          {t('trade.buy')}
        </button>
        <button
          type="button"
          className={`trade-side sell ${side === 'sell' ? 'on' : ''}`}
          onClick={() => setSide('sell')}
        >
          {t('trade.sell')}
        </button>
      </div>

      <div className="trade-form">
        <label className="tf-row">
          <span>{t('trade.orderType')}</span>
          <div className="seg">
            <button
              type="button"
              className={orderType === 'market' ? 'on' : ''}
              onClick={() => setOrderType('market')}
            >
              {t('trade.market')}
            </button>
            <button
              type="button"
              className={orderType === 'limit' ? 'on' : ''}
              onClick={() => {
                setOrderType('limit')
                setLimitPrice(mid)
              }}
            >
              {t('trade.limit')}
            </button>
          </div>
        </label>

        {orderType === 'limit' ? (
          <label className="tf-row">
            <span>{t('trade.limitPrice')}</span>
            <input
              className="trade-input"
              type="number"
              step={instrument.pipSize}
              value={limitPrice}
              onChange={(e) => setLimitPrice(Number(e.target.value))}
            />
          </label>
        ) : null}

        <label className="tf-row">
          <span>{t('trade.volume')}</span>
          <input
            className="trade-input"
            type="number"
            min={0.01}
            step={0.01}
            value={volume}
            onChange={(e) => setVolume(Math.max(0.01, Number(e.target.value) || 0.01))}
          />
        </label>

        <label className="tf-row tf-leverage">
          <span>
            {t('trade.leverage')} <strong>1:{leverage}</strong>
          </span>
          <input
            type="range"
            min={20}
            max={500}
            step={10}
            value={leverage}
            onChange={(e) => setLeverage(Number(e.target.value))}
          />
        </label>

        <div className="tf-row tf-dual">
          <label>
            <span>{t('trade.tp')}</span>
            <input
              className="trade-input"
              placeholder="—"
              value={tp}
              onChange={(e) => setTp(e.target.value)}
            />
          </label>
          <label>
            <span>{t('trade.sl')}</span>
            <input
              className="trade-input"
              placeholder="—"
              value={sl}
              onChange={(e) => setSl(e.target.value)}
            />
          </label>
        </div>

        <div className="trade-margin-box">
          <div className="tm-row">
            <span>{t('trade.notional')}</span>
            <span className="mono">${notional.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
          </div>
          <div className="tm-row strong">
            <span>{t('trade.estMargin')}</span>
            <span className="mono accent">${estMargin.toLocaleString(undefined, { maximumFractionDigits: 2 })}</span>
          </div>
          <p className="trade-disclaimer">{t('trade.marginNote')}</p>
        </div>

        <p className="trade-ticket">{ticketHint}</p>

        {demoTicket ? <p className="trade-demo-toast" role="status">{demoTicket}</p> : null}

        <button
          type="button"
          className={`trade-submit ${side === 'sell' ? 'trade-submit--sell' : ''} ${
            submitDemo === 'pending' ? 'trade-submit--busy' : ''
          } ${submitDemo === 'done' ? 'trade-submit--ok' : ''}`}
          disabled={submitDemo !== 'idle'}
          onClick={runSubmitDemo}
        >
          {submitDemo === 'pending'
            ? t('trade.submitting')
            : submitDemo === 'done'
              ? t('trade.submittedDemo')
              : side === 'buy'
                ? t('trade.submitBuy')
                : t('trade.submitSell')}
        </button>
      </div>
    </section>
  )
}
