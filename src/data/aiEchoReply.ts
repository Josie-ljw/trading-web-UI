import type { AppLocale } from '../i18n/config'

/** Demo reply for any user text or voice transcript — typewriter in UI. */
export function buildDemoReply(symbol: string, lang: AppLocale, userText: string): string {
  const raw = userText.trim()
  const snippet = raw.length > 0 ? raw.slice(0, 120) : ''

  if (lang === 'zh-CN') {
    const ref = snippet || '（语音消息）'
    return `【演示回复】已收到：「${ref}」。结合当前关注品种 ${symbol}：建议同步查看盘面关键位与事件窗口，控制杠杆与止损宽度；本回复为本地演示生成，不构成任何投资建议。`
  }

  const ref = snippet || '(voice message)'
  return `[Demo reply] Received: "${ref}". For ${symbol}: watch key levels and event risk, size positions with margin headroom. This is a local demo only — not investment advice.`
}
