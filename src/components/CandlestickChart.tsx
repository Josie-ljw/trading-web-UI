import {
  CandlestickSeries,
  ColorType,
  createChart,
  LineSeries,
  type CandlestickData,
  type LineData,
} from 'lightweight-charts'
import { useLayoutEffect, useRef } from 'react'

import { useTheme } from '../context/ThemeProvider'
import { chartInteractionZoomFriendly } from '../data/chartInteraction'

const PALETTE = {
  dark: {
    bg: '#0a0b0f',
    text: '#94a3b8',
    grid: '#1a1f2e',
    crosshair: '#334155',
    crosshairLabel: '#1e293b',
    scaleBorder: '#252a33',
    ma: '#38bdf8',
  },
  light: {
    bg: '#ffffff',
    text: '#64748b',
    grid: '#e2e8f0',
    crosshair: '#94a3b8',
    crosshairLabel: '#f1f5f9',
    scaleBorder: '#e2e8f0',
    ma: '#0284c7',
  },
} as const

type Props = {
  symbol: string
  data: CandlestickData[]
  maData?: LineData[]
  /** Show seconds on time axis for very fine intraday bars */
  secondsVisible?: boolean
}

export function CandlestickChart({ symbol, data, maData, secondsVisible = false }: Props) {
  const { theme } = useTheme()
  const wrapRef = useRef<HTMLDivElement>(null)
  const p = PALETTE[theme]

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el) return

    const chart = createChart(el, {
      ...chartInteractionZoomFriendly,
      layout: {
        background: { type: ColorType.Solid, color: p.bg },
        textColor: p.text,
        fontSize: 11,
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
      timeScale: { borderColor: p.scaleBorder, timeVisible: true, secondsVisible },
      width: el.clientWidth,
      height: el.clientHeight,
    })

    const series = chart.addSeries(CandlestickSeries, {
      upColor: '#22c55e',
      downColor: '#ef4444',
      borderUpColor: '#22c55e',
      borderDownColor: '#ef4444',
      wickUpColor: '#22c55e',
      wickDownColor: '#ef4444',
    })
    series.setData(data)

    if (maData && maData.length > 0) {
      const ma = chart.addSeries(LineSeries, {
        color: p.ma,
        lineWidth: 2,
        priceLineVisible: false,
        lastValueVisible: true,
      })
      ma.setData(maData)
    }

    chart.timeScale().fitContent()

    const ro = new ResizeObserver(() => {
      if (!wrapRef.current) return
      const { clientWidth, clientHeight } = wrapRef.current
      chart.applyOptions({ width: clientWidth, height: clientHeight })
    })
    ro.observe(el)

    return () => {
      ro.disconnect()
      chart.remove()
    }
  }, [data, maData, p, secondsVisible])

  return <div className="chart-mount" ref={wrapRef} aria-label={`K-line ${symbol}`} />
}
