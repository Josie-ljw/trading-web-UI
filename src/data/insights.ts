export type NewsItem = { id: string; title: Record<'zh-CN' | 'en', string>; tag: string }
export type CalItem = { id: string; time: string; event: Record<'zh-CN' | 'en', string>; impact: 'high' | 'med' }

export const DEMO_NEWS: NewsItem[] = [
  {
    id: '1',
    tag: 'FX',
    title: {
      'zh-CN': '主要央行官员讲话密集，短线波动率或抬升（演示）',
      en: 'Central-bank speakers in focus; short-term volatility may rise (demo)',
    },
  },
  {
    id: '2',
    tag: 'Macro',
    title: {
      'zh-CN': '能源价格回落拖累商品货币，关注风险情绪变化（演示）',
      en: 'Energy prices weigh on commodity currencies; watch risk tone (demo)',
    },
  },
  {
    id: '3',
    tag: 'Tech',
    title: {
      'zh-CN': '美股科技龙头财报预期分化，指数相关性上升（演示）',
      en: 'Mega-cap tech earnings expectations diverge; index correlation rises (demo)',
    },
  },
]

export const DEMO_CALENDAR: CalItem[] = [
  {
    id: 'c1',
    time: '14:30 UTC',
    impact: 'high',
    event: {
      'zh-CN': '美国 CPI 同比（演示）',
      en: 'US CPI YoY (demo)',
    },
  },
  {
    id: 'c2',
    time: '18:00 UTC',
    impact: 'med',
    event: {
      'zh-CN': '欧洲央行会议纪要（演示）',
      en: 'ECB meeting minutes (demo)',
    },
  },
  {
    id: 'c3',
    time: '23:50 UTC',
    impact: 'med',
    event: {
      'zh-CN': '日本短观指数（演示）',
      en: 'Japan Tankan (demo)',
    },
  },
]

export const DEMO_SENTIMENT = {
  risk: { label: { 'zh-CN': '风险偏好', en: 'Risk appetite' }, value: 62 },
  vol: { label: { 'zh-CN': '波动预期', en: 'Volatility' }, value: 48 },
  usd: { label: { 'zh-CN': '美元倾向', en: 'USD bias' }, value: 55 },
} as const
