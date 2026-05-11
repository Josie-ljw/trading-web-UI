import { useCallback, useEffect, useMemo, useState } from 'react'

import {
  createWatchlistChannel,
  parseWatchlistMessage,
} from '../lib/watchlistChannel'

const STORAGE_KEY = 'trading-web-demo-watchlist'

function loadFromStorage(): Set<string> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return new Set()
    const arr = JSON.parse(raw) as unknown
    if (!Array.isArray(arr)) return new Set()
    return new Set(arr.filter((s): s is string => typeof s === 'string'))
  } catch {
    return new Set()
  }
}

export function useWatchlist() {
  const [watched, setWatched] = useState<Set<string>>(() => loadFromStorage())

  const channel = useMemo(() => createWatchlistChannel(), [])

  useEffect(() => {
    if (!channel) return
    const onMsg = (ev: MessageEvent) => {
      const list = parseWatchlistMessage(ev.data)
      if (!list) return
      setWatched(new Set(list))
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(list))
      } catch {
        /* ignore */
      }
    }
    channel.addEventListener('message', onMsg)
    return () => channel.removeEventListener('message', onMsg)
  }, [channel])

  const persistAndBroadcast = useCallback(
    (next: Set<string>) => {
      const arr = [...next]
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(arr))
      } catch {
        /* ignore */
      }
      channel?.postMessage({ symbols: arr })
    },
    [channel],
  )

  const toggle = useCallback(
    (symbol: string) => {
      setWatched((prev) => {
        const next = new Set(prev)
        if (next.has(symbol)) next.delete(symbol)
        else next.add(symbol)
        persistAndBroadcast(next)
        return next
      })
    },
    [persistAndBroadcast],
  )

  const has = useCallback((symbol: string) => watched.has(symbol), [watched])

  return { watched, toggle, has }
}
