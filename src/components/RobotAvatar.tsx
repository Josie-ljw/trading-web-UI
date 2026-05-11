import { useId } from 'react'

import './RobotAvatar.css'

/** Compact animated robot face for AI launcher (CSS-driven motion, lighter palette). */
export function RobotAvatar({ className = '' }: { className?: string }) {
  const gid = useId().replace(/:/g, '')
  const gradId = `robot-metal-${gid}`

  return (
    <span className={`robot-avatar ${className}`.trim()} aria-hidden>
      <svg viewBox="0 0 48 48" className="robot-avatar-svg" role="img">
        <defs>
          <linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
        </defs>
        <rect x="8" y="14" width="32" height="28" rx="6" fill={`url(#${gradId})`} />
        <rect x="14" y="8" width="20" height="10" rx="3" fill="#b8c4d4" className="robot-antenna-base" />
        <circle cx="24" cy="5" r="3" fill="#bae6fd" className="robot-antenna-ball" />
        <rect x="14" y="20" width="8" height="10" rx="2" fill="#64748b" className="robot-eye robot-eye-l" />
        <rect x="26" y="20" width="8" height="10" rx="2" fill="#64748b" className="robot-eye robot-eye-r" />
        <rect x="17" y="32" width="14" height="3" rx="1" fill="#86efac" opacity={0.95} className="robot-mouth" />
      </svg>
    </span>
  )
}
