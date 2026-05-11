import { ColorType, createChart, HistogramSeries, type HistogramData } from 'lightweight-charts'
import { useLayoutEffect, useRef } from 'react'

import { useTheme } from '../context/ThemeProvider'
import { chartInteractionPageScrollFriendly } from '../data/chartInteraction'

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

export function VolumeHistogramChart({ data, ariaLabel }: Props) {
  const { theme } = useTheme()
  const wrapRef = useRef<HTMLDivElement>(null)
  const p = PALETTE[theme]

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el || data.length === 0) return

    const chart = createChart(el, {
      ...chartInteractionPageScrollFriendly,
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
  }, [data, p])

  return <div className="chart-mount chart-mount--compact" ref={wrapRef} aria-label={ariaLabel} />
}
