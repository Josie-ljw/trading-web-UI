import type { AppLocale } from '../i18n/config'

import raw from './instrumentNames.json'

export function instrumentDisplayName(symbol: string, lang: AppLocale): string {
  const row = raw.names[symbol as keyof typeof raw.names]
  if (!row) return symbol
  return row[lang] ?? row.en ?? symbol
}

export function categoryDisplayName(categoryKey: string, lang: AppLocale): string {
  const row = raw.categories[categoryKey as keyof typeof raw.categories]
  if (!row) return categoryKey
  return row[lang] ?? row.en ?? categoryKey
}
