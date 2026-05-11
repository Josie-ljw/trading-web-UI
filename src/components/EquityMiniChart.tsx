import { ColorType, createChart, LineSeries, type LineData, type Time } from 'lightweight-charts'
import { useLayoutEffect, useRef } from 'react'

import { useTheme } from '../context/ThemeProvider'
import { chartInteractionPageScrollFriendly } from '../data/chartInteraction'

function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

function mulberry32(a: number) {
  return function () {
    let t = (a += 0x6d2b79f5)
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function generateEquityCurve(seed: string, points = 90): LineData[] {
  const rand = mulberry32(hashSeed(seed))
  const out: LineData[] = []
  let v = 10000 + rand() * 800
  const now = Math.floor(Date.now() / 1000)
  const day = 86400

  for (let i = 0; i < points; i++) {
    const t = now - (points - 1 - i) * day
    v += (rand() - 0.48) * 120
    v = Math.max(8200, v)
    out.push({ time: t as Time, value: Math.round(v * 100) / 100 })
  }

  return out
}

const PALETTE = {
  dark: { text: '#64748b', grid: '#1e293b', line: '#22c55e' },
  light: { text: '#64748b', grid: '#cbd5e1', line: '#16a34a' },
} as const

type Props = {
  data: LineData[]
}

export function EquityMiniChart({ data }: Props) {
  const { theme } = useTheme()
  const wrapRef = useRef<HTMLDivElement>(null)
  const p = PALETTE[theme]

  useLayoutEffect(() => {
    const el = wrapRef.current
    if (!el || data.length === 0) return

    const chart = createChart(el, {
      ...chartInteractionPageScrollFriendly,
      layout: {
        background: { type: ColorType.Solid, color: 'transparent' },
        textColor: p.text,
        fontSize: 10,
      },
      grid: { vertLines: { visible: false }, horzLines: { color: p.grid } },
      rightPriceScale: { borderVisible: false },
      timeScale: { borderVisible: false, fixLeftEdge: true, fixRightEdge: true },
      crosshair: { vertLine: { visible: false }, horzLine: { visible: false } },
      width: el.clientWidth,
      height: el.clientHeight,
    })

    const line = chart.addSeries(LineSeries, {
      color: p.line,
      lineWidth: 2,
      priceLineVisible: false,
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

  return <div className="equity-mini-mount" ref={wrapRef} aria-label="Equity curve" />
}
