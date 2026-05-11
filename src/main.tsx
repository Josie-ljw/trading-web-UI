import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

import './i18n/config'
import './index.css'
import App from './App.tsx'

document.documentElement.lang = 'zh-CN'
try {
  const saved = localStorage.getItem('nebula-theme')
  document.documentElement.dataset.theme = saved === 'light' ? 'light' : 'dark'
} catch {
  document.documentElement.dataset.theme = 'dark'
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
