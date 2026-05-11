import { useTranslation } from 'react-i18next'

import { useTheme, type Theme } from '../context/ThemeProvider'

export function ThemeToggle() {
  const { t } = useTranslation()
  const { theme, setTheme } = useTheme()

  const options: { id: Theme; label: string }[] = [
    { id: 'dark', label: t('theme.dark') },
    { id: 'light', label: t('theme.light') },
  ]

  return (
    <div className="theme-switcher" role="group" aria-label={t('theme.label')}>
      {options.map(({ id, label }) => (
        <button
          key={id}
          type="button"
          className={theme === id ? 'active' : ''}
          onClick={() => setTheme(id)}
          aria-pressed={theme === id}
        >
          {label}
        </button>
      ))}
    </div>
  )
}
