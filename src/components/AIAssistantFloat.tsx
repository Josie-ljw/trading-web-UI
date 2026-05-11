import { useCallback, useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { useTranslation } from 'react-i18next'

import { getDemoAISignals } from '../data/demoAISignals'
import { useQuotes } from '../hooks/useQuotes'
import type { AppLocale } from '../i18n/config'

import { AICopilot } from './AICopilot'
import { RobotAvatar } from './RobotAvatar'

const STORAGE_KEY = 'ai-float-bottom-px'
const DEFAULT_BOTTOM = 12
const LAUNCHER_BLOCK_MIN = 52

function clampBottom(px: number, winH: number): number {
  const max = Math.max(DEFAULT_BOTTOM, winH - LAUNCHER_BLOCK_MIN - DEFAULT_BOTTOM)
  return Math.min(Math.max(DEFAULT_BOTTOM, px), max)
}

function readStoredBottom(): number | null {
  try {
    const v = localStorage.getItem(STORAGE_KEY)
    if (v == null) return null
    const n = Number(v)
    return Number.isFinite(n) ? n : null
  } catch {
    return null
  }
}

type Props = {
  symbol: string
  digits: number
  open: boolean
  onToggle: () => void
}

export function AIAssistantFloat({ symbol, digits, open, onToggle }: Props) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as AppLocale
  const quotes = useQuotes()
  const row = quotes[symbol]
  const mid = row ? (row.bid + row.ask) / 2 : 1

  const sig = getDemoAISignals(symbol, mid, lang, digits)

  const [bottomPx, setBottomPx] = useState(() => {
    const stored = typeof window !== 'undefined' ? readStoredBottom() : null
    if (stored == null) return DEFAULT_BOTTOM
    return clampBottom(stored, window.innerHeight)
  })
  const [isDragging, setIsDragging] = useState(false)
  const [hintDismissed, setHintDismissed] = useState(() => {
    try {
      return localStorage.getItem('ai-float-hint-dismissed') === '1'
    } catch {
      return false
    }
  })

  const bottomRef = useRef(bottomPx)
  bottomRef.current = bottomPx

  const dragRef = useRef<{
    pointerId: number
    startY: number
    startBottom: number
    moved: boolean
  } | null>(null)

  useEffect(() => {
    const onResize = () => {
      setBottomPx((b) => clampBottom(b, window.innerHeight))
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  useEffect(() => {
    if (!open) return
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [open])

  useEffect(() => {
    if (!hintDismissed) return
    try {
      localStorage.setItem('ai-float-hint-dismissed', '1')
    } catch {
      /* ignore */
    }
  }, [hintDismissed])

  useEffect(() => {
    if (!open) return
    const esc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onToggle()
    }
    window.addEventListener('keydown', esc)
    return () => window.removeEventListener('keydown', esc)
  }, [open, onToggle])

  const endDrag = useCallback(() => {
    setIsDragging(false)
    dragRef.current = null
  }, [])

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0) return
    e.currentTarget.setPointerCapture(e.pointerId)
    dragRef.current = {
      pointerId: e.pointerId,
      startY: e.clientY,
      startBottom: bottomRef.current,
      moved: false,
    }
  }, [])

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLButtonElement>) => {
    const d = dragRef.current
    if (!d || e.pointerId !== d.pointerId) return
    const dy = e.clientY - d.startY
    if (Math.abs(dy) > 5) {
      d.moved = true
      setIsDragging(true)
    }
    if (d.moved) {
      const next = clampBottom(d.startBottom - dy, window.innerHeight)
      setBottomPx(next)
    }
  }, [])

  const onPointerUp = useCallback(
    (e: React.PointerEvent<HTMLButtonElement>) => {
      const d = dragRef.current
      if (!d || e.pointerId !== d.pointerId) return
      try {
        e.currentTarget.releasePointerCapture(e.pointerId)
      } catch {
        /* ignore */
      }
      const moved = d.moved
      endDrag()
      if (!moved) {
        onToggle()
      } else {
        try {
          localStorage.setItem(STORAGE_KEY, String(bottomRef.current))
        } catch {
          /* ignore */
        }
      }
    },
    [endDrag, onToggle],
  )

  const drawer = open ? (
    <div className="ai-drawer-overlay" onClick={onToggle} role="presentation">
      <aside
        id="nebula-ai-panel"
        className="ai-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="ai-drawer-title"
        onClick={(ev) => ev.stopPropagation()}
      >
        <header className="ai-drawer-header">
          <div className="ai-drawer-title-wrap">
            <RobotAvatar className="robot-avatar--sm" />
            <div>
              <h2 id="ai-drawer-title">{t('ai.title')}</h2>
              <p className="sub">{t('ai.drawerSubtitle')}</p>
            </div>
          </div>
          <button
            type="button"
            className="ai-drawer-close"
            onClick={onToggle}
            aria-label={t('ai.closeDrawer')}
          >
            ×
          </button>
        </header>

        <div className="ai-drawer-body">
          <div className="ai-signal-strip ai-signal-strip--drawer">
            <div className="ai-signal-metric">
              <span className="asm-label">{sig.sentimentLabel}</span>
              <div className="asm-bar">
                <div className="asm-fill" style={{ width: `${sig.sentimentScore}%` }} />
              </div>
              <span className={`asm-score bias-${sig.bias}`}>{sig.sentimentScore}</span>
            </div>
            <div className="ai-levels">
              <div>
                <span className="lvl-k">{t('ai.resistance')}</span>
                <span className="lvl-v mono">{sig.resistance.toFixed(digits)}</span>
              </div>
              <div>
                <span className="lvl-k">{t('ai.support')}</span>
                <span className="lvl-v mono">{sig.support.toFixed(digits)}</span>
              </div>
            </div>
            <p className="ai-signal-note">{sig.note}</p>
          </div>

          <AICopilot variant="drawer" symbol={symbol} />
        </div>
      </aside>
    </div>
  ) : null

  return (
    <>
      <div
        className="ai-float-root"
        style={{ bottom: bottomPx, right: '0.75rem' }}
      >
        <div className="ai-launcher-row">
          {!open && !isDragging && !hintDismissed ? (
            <div className="ai-hint-bubble">
              <p>{t('ai.hintBubble')}</p>
              <button
                type="button"
                className="ai-hint-close"
                onClick={(e) => {
                  e.stopPropagation()
                  setHintDismissed(true)
                }}
                aria-label={t('ai.closeHint')}
              >
                ×
              </button>
            </div>
          ) : null}
          <button
            type="button"
            className={`ai-float-launcher ${isDragging ? 'is-dragging' : ''}`}
            onClick={(ev) => ev.preventDefault()}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault()
                onToggle()
              }
            }}
            aria-expanded={open}
            aria-controls="nebula-ai-panel"
            title={t('ai.dragHint')}
          >
            <span className="ai-float-launcher-glow" aria-hidden />
            <RobotAvatar />
            <span className="ai-float-launcher-label">{t('ai.launcherShort')}</span>
          </button>
        </div>
      </div>

      {typeof document !== 'undefined' && drawer
        ? createPortal(drawer, document.body)
        : null}
    </>
  )
}
