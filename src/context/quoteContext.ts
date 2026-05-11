import { createContext } from 'react'

import type { QuoteRow } from './quoteTypes'

export const QuoteContext = createContext<Record<string, QuoteRow>>({})
