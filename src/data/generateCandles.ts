import type { CandlestickData, HistogramData, LineData, Time } from 'lightweight-charts'

import type { ChartTimeframe } from './chartTimeframe'
import { timeframeBarCount, timeframeBarSeconds } from './chartTimeframe'

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

function formatDay(d: Date): Time {
  return d.toISOString().slice(0, 10) as Time
}

function generateDaily(symbol: string, basePrice: number, days: number): CandlestickData[] {
  const rand = mulberry32(hashSeed(symbol))
  const out: CandlestickData[] = []
  const end = new Date()
  end.setUTCHours(0, 0, 0, 0)
  let close = basePrice * (0.97 + rand() * 0.06)

  for (let i = days; i >= 0; i--) {
    const d = new Date(end)
    d.setUTCDate(d.getUTCDate() - i)
    if (d.getUTCDay() === 0 || d.getUTCDay() === 6) continue

    const pct = basePrice > 0 ? basePrice : 1
    const drift = (rand() - 0.48) * 0.0022 * pct
    const open = close
    const vol = (0.00035 + rand() * 0.0016) * pct
    close = Math.max(0.01, open + drift * (0.8 + rand()))
    const high = Math.max(open, close) + rand() * vol * 0.6
    const low = Math.min(open, close) - rand() * vol * 0.6

    out.push({
      time: formatDay(d),
      open,
      high,
      low,
      close,
    })
  }

  return out
}

function generateIntraday(
  symbol: string,
  basePrice: number,
  barSeconds: number,
  count: number,
): CandlestickData[] {
  const rand = mulberry32(hashSeed(`${symbol}|${barSeconds}`))
  const out: CandlestickData[] = []
  const nowSec = Math.floor(Date.now() / 1000)
  const aligned = Math.floor(nowSec / barSeconds) * barSeconds
  let close = basePrice * (0.998 + rand() * 0.004)

  for (let i = 0; i < count; i++) {
    const t = (aligned - (count - 1 - i) * barSeconds) as Time
    const pct = basePrice > 0 ? basePrice : 1
    const drift = (rand() - 0.5) * 0.00055 * pct
    const open = close
    const vol = (0.00012 + rand() * 0.00045) * pct
    close = Math.max(0.01, open + drift * (0.75 + rand()))
    const high = Math.max(open, close) + rand() * vol
    const low = Math.min(open, close) - rand() * vol
    out.push({ time: t, open, high, low, close })
  }

  return out
}

/** Demo OHLC for TradingView Lightweight Charts; `D1` uses business-day strings, others use UTCTimestamp. */
export function generateCandles(
  symbol: string,
  basePrice: number,
  timeframe: ChartTimeframe = 'H1',
): CandlestickData[] {
  if (timeframe === 'D1') {
    return generateDaily(symbol, basePrice, timeframeBarCount('D1'))
  }
  const sec = timeframeBarSeconds(timeframe)
  const n = timeframeBarCount(timeframe)
  return generateIntraday(symbol, basePrice, sec, n)
}

export function computeSMA(candles: CandlestickData[], period: number): LineData[] {
  const line: LineData[] = []
  if (candles.length < period) return line
  for (let i = period - 1; i < candles.length; i++) {
    let sum = 0
    for (let j = 0; j < period; j++) sum += candles[i - j]!.close
    line.push({ time: candles[i]!.time, value: sum / period })
  }
  return line
}

/** Synthetic volume bars from OHLC range (demo only). */
export function histogramVolumeFromCandles(candles: CandlestickData[]): HistogramData[] {
  const rand = mulberry32(hashSeed('vol-hist'))
  return candles.map((c) => {
    const span = Math.max(1e-12, c.high - c.low)
    const body = Math.abs(c.close - c.open)
    const v = span * (0.6 + rand() * 0.9) + body * (0.2 + rand() * 0.4)
    const up = c.close >= c.open
    return {
      time: c.time,
      value: Math.max(0.0001, v),
      color: up ? 'rgba(34, 197, 94, 0.42)' : 'rgba(239, 68, 68, 0.42)',
    }
  })
}

/** Demo implied-vol style line for a volatility strip chart. */
export function generateVolatilityLine(seed: string, points = 96): LineData[] {
  const rand = mulberry32(hashSeed(seed))
  const out: LineData[] = []
  const now = Math.floor(Date.now() / 1000)
  const step = 3600
  let v = 14 + rand() * 6
  for (let i = 0; i < points; i++) {
    const t = (now - (points - 1 - i) * step) as Time
    v += (rand() - 0.5) * 1.1
    v = Math.max(8, Math.min(32, v))
    out.push({ time: t, value: Math.round(v * 10) / 10 })
  }
  return out
}
