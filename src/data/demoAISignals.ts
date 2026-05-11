import type { AppLocale } from '../i18n/config'

function hashSeed(s: string): number {
  let h = 2166136261
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

export type AISignalDemo = {
  sentimentLabel: string
  sentimentScore: number
  bias: 'bullish' | 'bearish' | 'neutral'
  resistance: number
  support: number
  note: string
}

export function getDemoAISignals(
  symbol: string,
  midPrice: number,
  lang: AppLocale,
  digits = 5,
): AISignalDemo {
  const h = hashSeed(symbol)
  const jitter = 1 + (h % 200) / 10000
  const resistance = midPrice * (1.002 + (h % 80) / 10000) * jitter
  const support = midPrice * (0.998 - (h % 70) / 10000) / jitter
  const sentimentScore = 35 + (h % 55)

  const zh = lang === 'zh-CN'
  const bullish = sentimentScore >= 55
  const bearish = sentimentScore <= 42
  const bias: AISignalDemo['bias'] = bullish ? 'bullish' : bearish ? 'bearish' : 'neutral'
  const f = (n: number) => n.toFixed(digits)

  return {
    sentimentLabel: zh ? 'AI 情绪指数' : 'AI sentiment',
    sentimentScore,
    bias,
    resistance,
    support,
    note: zh
      ? `演示：结合订单流与波动结构，${symbol} 短线关键阻力参考 ${f(resistance)}，支撑 ${f(support)}。非投资建议。`
      : `Demo: Flow/volatility blend — watch resistance ~${f(resistance)} and support ~${f(support)} on ${symbol}. Not advice.`,
  }
}
