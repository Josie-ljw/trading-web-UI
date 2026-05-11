const CHANNEL_ID = 'trading-web-demo-watchlist'

export type WatchlistMessage = { symbols: string[] }

export function createWatchlistChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null
  return new BroadcastChannel(CHANNEL_ID)
}

export function parseWatchlistMessage(data: unknown): string[] | null {
  if (!data || typeof data !== 'object') return null
  const syms = (data as WatchlistMessage).symbols
  if (!Array.isArray(syms)) return null
  return syms.filter((s): s is string => typeof s === 'string')
}
