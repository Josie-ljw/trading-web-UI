import { useEffect, useMemo, useState, type ReactNode } from 'react'

import { INSTRUMENTS } from '../data/instruments'

import { QuoteContext } from './quoteContext'
import type { QuoteRow } from './quoteTypes'

function buildInitial(): Record<string, QuoteRow> {
  return Object.fromEntries(
    INSTRUMENTS.map((i) => [
      i.symbol,
      {
        bid: i.baseBid,
        ask: i.baseBid + i.pipSize * 0.75,
      },
    ]),
  )
}

export function QuoteProvider({ children }: { children: ReactNode }) {
  const [quotes, setQuotes] = useState(buildInitial)

  useEffect(() => {
    const id = window.setInterval(() => {
      setQuotes((prev) => {
        const next: Record<string, QuoteRow> = { ...prev }
        for (const inst of INSTRUMENTS) {
          const row = next[inst.symbol]!
          const delta = (Math.random() - 0.5) * inst.pipSize * 3.2
          const bid = Math.max(1e-8, row.bid + delta)
          const spread = inst.pipSize * (0.55 + Math.random() * 0.65)
          next[inst.symbol] = { bid, ask: bid + spread }
        }
        return next
      })
    }, 220)
    return () => window.clearInterval(id)
  }, [])

  const value = useMemo(() => quotes, [quotes])
  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>
}
