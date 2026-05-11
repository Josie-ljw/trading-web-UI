import { INSTRUMENTS, type Instrument } from './instruments'

/** Home tabs: 热门 / 金属 / 加密 / 外汇 / 指数 / 大宗商品 / 股票 */
export const MARKET_TAB_IDS = [
  'hot',
  'metal',
  'crypto',
  'forex',
  'index',
  'commodity',
  'stock',
] as const

export type MarketTabId = (typeof MARKET_TAB_IDS)[number]

const METAL_SYMBOLS = new Set(['XAUUSD', 'XAGUSD'])

/** Curated cross-asset “热门” list (demo). */
const HOT_SYMBOLS: string[] = [
  'EURUSD',
  'XAUUSD',
  'BTCUSD',
  'US500',
  'WTIUSD',
  'GBPUSD',
  'USDJPY',
  'ETHUSD',
  'NAS100',
  'XAGUSD',
]

export function getInstrumentsForTab(tab: MarketTabId): Instrument[] {
  switch (tab) {
    case 'hot':
      return HOT_SYMBOLS.map((s) => INSTRUMENTS.find((i) => i.symbol === s)).filter(
        (x): x is Instrument => x != null,
      )
    case 'metal':
      return INSTRUMENTS.filter((i) => METAL_SYMBOLS.has(i.symbol))
    case 'crypto':
      return INSTRUMENTS.filter((i) => i.categoryKey === 'crypto')
    case 'forex':
      return INSTRUMENTS.filter((i) => i.categoryKey === 'forex')
    case 'index':
      return INSTRUMENTS.filter((i) => i.categoryKey === 'index')
    case 'commodity':
      return INSTRUMENTS.filter(
        (i) => i.categoryKey === 'commodity' && !METAL_SYMBOLS.has(i.symbol),
      )
    case 'stock':
      return INSTRUMENTS.filter((i) => i.categoryKey === 'stock')
    default:
      return INSTRUMENTS
  }
}
