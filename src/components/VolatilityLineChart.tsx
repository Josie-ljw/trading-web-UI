import { ColorType, createChart, LineSeries, type LineData } from 'lightweight-charts'
import { useLayoutEffect, useRef } from 'react'

import { useTheme } from '../context/ThemeProvider'
import { chartInteractionPageScrollFriendly } from '../data/chartInteraction'

const PALETTE = {
  dark: {
    bg: '#0a0b0f',
    text: '#64748b',
    grid: '#1a1f2e',
    line: '#a78bfa',
    crosshair: '#334155',
    crosshairLabel: '#1e293b',
    scaleBorder: '#252a33',
  },
  light: {
    bg: '#ffffff',
    text: '#64748b',
    grid: '#e2e8f0',
    line: '#7c3aed',
    crosshair: '#94a3b8',
    crosshairLabel: '#f1f5f9',
    scaleBorder: '#e2e8f0',
  },
} as const

type Props = {
  data: LineData[]
  ariaLabel: string
}

export function VolatilityLineChart({ data, ariaLabel }: Props) {
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

    const line = chart.addSeries(LineSeries, {
      color: p.line,
      lineWidth: 2,
      priceLineVisible: true,
      lastValueVisible: true,
    })
    line.setData(data)
    chart.timeScale().fitContent()

    const ro = new ResizeObserver(() => {
      if (!wrapRef.current) return
      chart.applyOptions({
        width: wrapRef.current.clientWidth,
        height: wrapRef.current.clientHeight,
      })
    })
    ro.observe(el)

    return () => {
      ro.disconnect()
      chart.remove()
    }
  }, [data, p])

  return <div className="chart-mount chart-mount--compact" ref={wrapRef} aria-label={ariaLabel} />
}
