import { ColorType, createChart, HistogramSeries, type HistogramData } from 'lightweight-charts'
import { useLayoutEffect, useMemo, useRef, useState } from 'react'

import { useTheme } from '../context/ThemeProvider'
import { chartInteractionZoomFriendly } from '../data/chartInteraction'

const PALETTE = {
  dark: {
    bg: '#0a0b0f',
    text: '#64748b',
    grid: '#1a1f2e',
    crosshair: '#334155',
    crosshairLabel: '#1e293b',
    scaleBorder: '#252a33',
  },
  light: {
    bg: '#ffffff',
    text: '#64748b',
    grid: '#e2e8f0',
    crosshair: '#94a3b8',
    crosshairLabel: '#f1f5f9',
    scaleBorder: '#e2e8f0',
  },
} as const

type Props = {
  data: HistogramData[]
  ariaLabel: string
}

const fmtTime = (time: HistogramData['time']) => {
  if (typeof time === 'number') {
    return new Date(time * 1000).toLocaleString()
  }
  return 'time' in time ? `${time.year}-${String(time.month).padStart(2, '0')}-${String(time.day).padStart(2, '0')}` : 'time'
}

export function VolumeHistogramChart({ data, ariaLabel }: Props) {
  const { theme } = useTheme()
  const wrapRef = useRef<HTMLDivElement>(null)
  const [selectedIndex, setSelectedIndex] = useState<number>(data.length - 1)
  const p = PALETTE[theme]

  const selected = useMemo(() => data[Math.min(selectedIndex, data.length - 1)] ?? null, [data, selectedIndex])

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el || data.length === 0) return

    const chart = createChart(el, {
      ...chartInteractionZoomFriendly,
      layout: {
        background: { type: ColorType.Solid, color: p.bg },
        textColor: p.text,
        fontSize: 10,
      },
      grid: {
        vertLines: { color: p.grid },
        horzLines: { color: p.grid },
      },
      crosshair: {
        vertLine: { color: p.crosshair, labelBackgroundColor: p.crosshairLabel },
        horzLine: { color: p.crosshair, labelBackgroundColor: p.crosshairLabel },
      },
      rightPriceScale: { borderColor: p.scaleBorder },
      timeScale: { borderColor: p.scaleBorder, timeVisible: true, secondsVisible: false },
      width: el.clientWidth,
      height: el.clientHeight,
    })

    const series = chart.addSeries(HistogramSeries, {
      priceFormat: { type: 'volume' },
      priceLineVisible: false,
    })
    series.setData(data)
    chart.timeScale().fitContent()

    const onClick = (param: { time?: unknown }) => {
      if (param.time == null) return
      const idx = data.findIndex((item) => String(item.time) === String(param.time))
      if (idx >= 0) setSelectedIndex(idx)
    }
    chart.subscribeClick(onClick)

    const ro = new ResizeObserver(() => {
      if (!wrapRef.current) return
      const { clientWidth, clientHeight } = wrapRef.current
      chart.applyOptions({ width: clientWidth, height: clientHeight })
    })
    ro.observe(el)

    return () => {
      chart.unsubscribeClick(onClick)
      ro.disconnect()
      chart.remove()
    }
  }, [data, p])

  return (
    <div className="volume-histogram-shell">
      <div className="chart-mount chart-mount--compact" ref={wrapRef} aria-label={ariaLabel} />
      <div className="volume-histogram-detail" role="status" aria-live="polite">
        {selected ? (
          <>
            <span className="mono volume-histogram-detail__value">{selected.value?.toLocaleString?.() ?? selected.value}</span>
            <span className="volume-histogram-detail__time">{fmtTime(selected.time)}</span>
          </>
        ) : (
          <span className="volume-histogram-detail__empty">Click a bar to inspect volume</span>
        )}
      </div>
    </div>
  )
}
