import { useContext } from 'react'

import { QuoteContext } from '../context/quoteContext'

export function useQuotes() {
  return useContext(QuoteContext)
}
