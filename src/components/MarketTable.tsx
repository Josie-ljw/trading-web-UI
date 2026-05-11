import { useVirtualizer } from '@tanstack/react-virtual'
import { memo, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { useQuotes } from '../hooks/useQuotes'
import { categoryDisplayName, instrumentDisplayName } from '../data/labels'
import type { Instrument } from '../data/instruments'
import type { AppLocale } from '../i18n/config'

import { MarketNewsStrip } from './MarketNewsStrip'

type RowProps = {
  inst: Instrument
  bid: number
  ask: number
  selected: boolean
  watched: boolean
  lang: AppLocale
  onSelect: (s: string) => void
  onToggleWatch: (s: string) => void
}

const MarketRow = memo(function MarketRow({
  inst,
  bid,
  ask,
  selected,
  watched,
  lang,
  onSelect,
  onToggleWatch,
}: RowProps) {
  const { t } = useTranslation()
  const spread = ask - bid
  const changePct = ((bid - inst.baseBid) / inst.baseBid) * 100
  const fmt = (n: number) => n.toFixed(inst.digits)
  const chClass = changePct >= 0 ? 'chg-up' : 'chg-down'

  return (
    <div
      className={`market-row ${selected ? 'selected' : ''}`}
      onClick={() => onSelect(inst.symbol)}
      role="row"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onSelect(inst.symbol)
        }
      }}
    >
      <div className="cell sym">
        <button
          type="button"
          className={`watch-btn ${watched ? 'on' : ''}`}
          aria-pressed={watched}
          title={t('table.watch')}
          onClick={(e) => {
            e.stopPropagation()
            onToggleWatch(inst.symbol)
          }}
        >
          ★
        </button>
        <div>
          <div className="sym-code">{inst.symbol}</div>
          <div className="sym-name">
            {instrumentDisplayName(inst.symbol, lang)}
          </div>
        </div>
      </div>
      <div className="cell cat">{categoryDisplayName(inst.categoryKey, lang)}</div>
      <div className="cell num">{fmt(bid)}</div>
      <div className="cell num">{fmt(ask)}</div>
      <div className="cell num dim">{fmt(spread)}</div>
      <div className={`cell num ${chClass}`}>{changePct.toFixed(2)}%</div>
    </div>
  )
}, areRowPropsEqual)

function areRowPropsEqual(a: RowProps, b: RowProps) {
  return (
    a.inst.symbol === b.inst.symbol &&
    a.bid === b.bid &&
    a.ask === b.ask &&
    a.selected === b.selected &&
    a.watched === b.watched &&
    a.lang === b.lang
  )
}

type Props = {
  instruments: Instrument[]
  selectedSymbol: string
  onSelectSymbol: (s: string) => void
  hasWatch: (s: string) => boolean
  onToggleWatch: (s: string) => void
}

export function MarketTable({
  instruments,
  selectedSymbol,
  onSelectSymbol,
  hasWatch,
  onToggleWatch,
}: Props) {
  const { t, i18n } = useTranslation()
  const quotes = useQuotes()
  const lang = i18n.language as AppLocale
  const parentRef = useRef<HTMLDivElement>(null)
  const [filter, setFilter] = useState('')

  const filtered = useMemo(() => {
    const q = filter.trim().toLowerCase()
    if (!q) return instruments
    return instruments.filter(
      (i) =>
        i.symbol.toLowerCase().includes(q) ||
        instrumentDisplayName(i.symbol, lang).toLowerCase().includes(q),
    )
  }, [filter, instruments, lang])

  /* eslint-disable react-hooks/incompatible-library -- virtualizer API; visible rows stay bounded */
  const rowVirtualizer = useVirtualizer({
    count: filtered.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 44,
    overscan: 8,
  })
  /* eslint-enable react-hooks/incompatible-library */

  return (
    <section className="panel market-panel">
      <div className="panel-head market-panel-head">
        <h2>{t('table.watchlistTitle')}</h2>
        <input
          className="filter-input"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          placeholder={t('table.search')}
          aria-label={t('table.search')}
        />
      </div>

      <MarketNewsStrip />

      <div className="market-header" role="rowgroup">
        <div className="cell sym">{t('table.symbol')}</div>
        <div className="cell cat">{t('table.category')}</div>
        <div className="cell num">{t('table.bid')}</div>
        <div className="cell num">{t('table.ask')}</div>
        <div className="cell num">{t('table.spread')}</div>
        <div className="cell num">{t('table.change')}</div>
      </div>
      <div className="market-scroll" ref={parentRef}>
        {filtered.length === 0 ? (
          <p className="market-empty">{t('markets.emptyCategory')}</p>
        ) : (
          <div
            className="market-vinner"
            style={{ height: `${rowVirtualizer.getTotalSize()}px`, position: 'relative' }}
          >
            {rowVirtualizer.getVirtualItems().map((vi) => {
              const inst = filtered[vi.index]!
              const q = quotes[inst.symbol] ?? {
                bid: inst.baseBid,
                ask: inst.baseBid + inst.pipSize,
              }
              return (
                <div
                  key={inst.symbol}
                  className="vrow"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${vi.start}px)`,
                  }}
                >
                  <MarketRow
                    inst={inst}
                    bid={q.bid}
                    ask={q.ask}
                    selected={inst.symbol === selectedSymbol}
                    watched={hasWatch(inst.symbol)}
                    lang={lang}
                    onSelect={onSelectSymbol}
                    onToggleWatch={onToggleWatch}
                  />
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
