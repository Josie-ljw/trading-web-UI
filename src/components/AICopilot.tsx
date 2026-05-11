import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { buildDemoReply } from '../data/aiEchoReply'
import { type AIIntent, getAIScript } from '../data/aiScripts'
import type { AppLocale } from '../i18n/config'

import { SpeakerIcon } from './SpeakerIcon'

type Msg = { role: 'user' | 'assistant'; text: string }

const INTENTS: AIIntent[] = ['technical', 'macro', 'risk']

type CopilotProps = {
  embedded?: boolean
  /** Drawer: tight layout + bottom composer */
  variant?: 'default' | 'drawer'
  /** Current symbol for demo replies */
  symbol?: string
}

export function AICopilot({
  embedded = false,
  variant = 'default',
  symbol = 'EURUSD',
}: CopilotProps) {
  const { t, i18n } = useTranslation()
  const lang = i18n.language as AppLocale
  const [messages, setMessages] = useState<Msg[]>([])
  const [stream, setStream] = useState('')
  const [draft, setDraft] = useState('')
  const [listening, setListening] = useState(false)
  const targetRef = useRef<string | null>(null)
  const posRef = useRef(0)
  const rafRef = useRef(0)
  const bottomRef = useRef<HTMLDivElement>(null)
  const recRef = useRef<{ stop: () => void } | null>(null)

  const runStream = useCallback((full: string) => {
    targetRef.current = full
    posRef.current = 0
    setStream('')

    const step = () => {
      const target = targetRef.current
      if (!target) return
      posRef.current = Math.min(target.length, posRef.current + 3)
      setStream(target.slice(0, posRef.current))
      if (posRef.current < target.length) {
        rafRef.current = requestAnimationFrame(step)
      } else {
        setMessages((m) => [...m, { role: 'assistant', text: target }])
        setStream('')
        targetRef.current = null
      }
    }
    cancelAnimationFrame(rafRef.current)
    rafRef.current = requestAnimationFrame(step)
  }, [])

  useEffect(() => {
    return () => {
      cancelAnimationFrame(rafRef.current)
      recRef.current?.stop()
    }
  }, [])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, stream])

  const sendUserAndReply = useCallback(
    (userText: string) => {
      const text = userText.trim()
      if (!text) return
      setDraft('')
      setMessages((m) => [...m, { role: 'user', text }])
      const reply = buildDemoReply(symbol, lang, text)
      runStream(reply)
    },
    [lang, runStream, symbol],
  )

  const onIntent = (intent: AIIntent) => {
    const label = t(`ai.chips.${intent}`)
    const script = getAIScript(lang, intent)
    setMessages((m) => [...m, { role: 'user', text: label }])
    runStream(script)
  }

  const clear = () => {
    cancelAnimationFrame(rafRef.current)
    targetRef.current = null
    setStream('')
    setMessages([])
    setDraft('')
  }

  const startVoice = useCallback(() => {
    if (listening) {
      recRef.current?.stop()
      recRef.current = null
      setListening(false)
      return
    }
    type RecInstance = {
      lang: string
      continuous: boolean
      interimResults: boolean
      start: () => void
      stop: () => void
      onresult: ((ev: { results: Array<Array<{ transcript: string }>> }) => void) | null
      onerror: (() => void) | null
      onend: (() => void) | null
    }
    const Win = window as unknown as {
      SpeechRecognition?: new () => RecInstance
      webkitSpeechRecognition?: new () => RecInstance
    }
    const Ctor = Win.SpeechRecognition ?? Win.webkitSpeechRecognition
    if (!Ctor) {
      window.alert(t('ai.voiceUnsupported'))
      return
    }
    const rec = new Ctor()
    rec.lang = lang === 'zh-CN' ? 'zh-CN' : 'en-US'
    rec.continuous = false
    rec.interimResults = false
    rec.onresult = (event) => {
      const text = event.results[0]?.[0]?.transcript?.trim() ?? ''
      sendUserAndReply(text || t('ai.voiceEmpty'))
    }
    rec.onerror = () => setListening(false)
    rec.onend = () => {
      setListening(false)
      recRef.current = null
    }
    recRef.current = { stop: () => rec.stop() }
    try {
      rec.start()
      setListening(true)
    } catch {
      setListening(false)
    }
  }, [lang, listening, sendUserAndReply, t])

  const isDrawer = variant === 'drawer'
  const panelClass = [
    'panel',
    'ai-panel',
    embedded && !isDrawer ? 'ai-panel--embedded' : '',
    isDrawer ? 'ai-panel--drawer' : '',
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <section className={panelClass}>
      {!isDrawer ? (
        <div className="panel-head">
          <div>
            <h2>{t('ai.title')}</h2>
            <p className="sub">{t('ai.subtitle')}</p>
          </div>
          <button type="button" className="ghost-btn" onClick={clear}>
            {t('ai.clear')}
          </button>
        </div>
      ) : (
        <div className="ai-drawer-chips-row">
          <span className="ai-drawer-chips-hint">{t('ai.quickIntents')}</span>
          <button type="button" className="ghost-btn ai-drawer-clear" onClick={clear}>
            {t('ai.clear')}
          </button>
        </div>
      )}
      <div className="ai-chips">
        {INTENTS.map((intent) => (
          <button key={intent} type="button" className="chip" onClick={() => onIntent(intent)}>
            {t(`ai.chips.${intent}`)}
          </button>
        ))}
      </div>
      <div className="ai-thread" role="log">
        {messages.length === 0 && !stream ? (
          <p className="placeholder">{t('ai.placeholder')}</p>
        ) : null}
        {messages.map((m, i) => (
          <div key={i} className={`bubble ${m.role}`}>
            {m.text}
          </div>
        ))}
        {stream ? (
          <div className="bubble assistant streaming">
            {stream}
            <span className="caret" aria-hidden />
          </div>
        ) : null}
        <div ref={bottomRef} />
      </div>

      {isDrawer ? (
        <form
          className="ai-composer"
          onSubmit={(e) => {
            e.preventDefault()
            sendUserAndReply(draft)
          }}
        >
          <input
            className="ai-composer-input"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t('ai.inputPlaceholder')}
            aria-label={t('ai.inputPlaceholder')}
            autoComplete="off"
          />
          <button
            type="button"
            className={`ai-composer-mic ${listening ? 'on' : ''}`}
            onClick={startVoice}
            title={listening ? t('ai.voiceStop') : t('ai.voiceStart')}
            aria-pressed={listening}
          >
            <SpeakerIcon listening={listening} />
          </button>
          <button type="submit" className="ai-composer-send">
            {t('ai.send')}
          </button>
        </form>
      ) : null}
    </section>
  )
}
