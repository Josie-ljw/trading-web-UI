import { useSyncExternalStore } from 'react'

/**
 * 订阅 matchMedia，用于布局分支（如移动端弹窗）。
 * SSR 下返回 false，与首帧客户端一致后再更新。
 */
export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mq = window.matchMedia(query)
      mq.addEventListener('change', onChange)
      return () => mq.removeEventListener('change', onChange)
    },
    () => window.matchMedia(query).matches,
    () => false,
  )
}
