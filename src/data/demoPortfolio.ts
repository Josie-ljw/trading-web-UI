import type { AppLocale } from '../i18n/config'

export type DemoPosition = {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  volume: number
  openPrice: number
  pl: number
  swap: number
}

export type DemoOrder = {
  id: string
  symbol: string
  side: 'buy' | 'sell'
  type: 'limit' | 'stop'
  volume: number
  price: number
}

export type DemoFill = {
  id: string
  time: string
  symbol: string
  side: 'buy' | 'sell'
  volume: number
  price: number
  fee: number
}

export const DEMO_POSITIONS: DemoPosition[] = [
  { id: 'p1', symbol: 'EURUSD', side: 'buy', volume: 0.5, openPrice: 1.0821, pl: 128.4, swap: -2.1 },
  { id: 'p2', symbol: 'XAUUSD', side: 'sell', volume: 0.2, openPrice: 2342.1, pl: -64.2, swap: -0.8 },
  { id: 'p3', symbol: 'WTIUSD', side: 'buy', volume: 1, openPrice: 76.85, pl: 42.0, swap: 0 },
]

export const DEMO_ORDERS: DemoOrder[] = [
  { id: 'o1', symbol: 'GBPUSD', side: 'buy', type: 'limit', volume: 0.3, price: 1.261 },
  { id: 'o2', symbol: 'USDJPY', side: 'sell', type: 'limit', volume: 0.2, price: 150.35 },
]

export const DEMO_FILLS: DemoFill[] = [
  { id: 'f1', time: '2026-05-09 14:32:01', symbol: 'EURUSD', side: 'buy', volume: 0.2, price: 1.0819, fee: 0 },
  { id: 'f2', time: '2026-05-09 09:05:44', symbol: 'XAUUSD', side: 'sell', volume: 0.1, price: 2338.2, fee: 0 },
  { id: 'f3', time: '2026-05-08 21:18:09', symbol: 'AUDUSD', side: 'buy', volume: 0.4, price: 0.6598, fee: 0 },
]

export function positionLabels(lang: AppLocale) {
  const zh = lang === 'zh-CN'
  return {
    symbol: zh ? '品种' : 'Symbol',
    side: zh ? '方向' : 'Side',
    vol: zh ? '手数' : 'Lots',
    open: zh ? '开仓价' : 'Open',
    pl: zh ? '浮动盈亏' : 'P/L',
    swap: zh ? '库存费' : 'Swap',
  }
}

export function orderLabels(lang: AppLocale) {
  const zh = lang === 'zh-CN'
  return {
    symbol: zh ? '品种' : 'Symbol',
    side: zh ? '方向' : 'Side',
    type: zh ? '类型' : 'Type',
    vol: zh ? '手数' : 'Lots',
    price: zh ? '挂单价' : 'Price',
  }
}

export function historyLabels(lang: AppLocale) {
  const zh = lang === 'zh-CN'
  return {
    time: zh ? '时间' : 'Time',
    symbol: zh ? '品种' : 'Symbol',
    side: zh ? '方向' : 'Side',
    vol: zh ? '手数' : 'Lots',
    price: zh ? '成交价' : 'Price',
    fee: zh ? '费用' : 'Fee',
  }
}
