export type ChartTimeframe = 'M1' | 'M5' | 'M15' | 'H1' | 'H4' | 'D1'

export const CHART_TIMEFRAMES: ChartTimeframe[] = ['M1', 'M5', 'M15', 'H1', 'H4', 'D1']

export function timeframeBarSeconds(tf: ChartTimeframe): number {
  switch (tf) {
    case 'M1':
      return 60
    case 'M5':
      return 5 * 60
    case 'M15':
      return 15 * 60
    case 'H1':
      return 60 * 60
    case 'H4':
      return 4 * 60 * 60
    case 'D1':
      return 24 * 60 * 60
    default:
      return 60 * 60
  }
}

export function timeframeBarCount(tf: ChartTimeframe): number {
  switch (tf) {
    case 'M1':
      return 320
    case 'M5':
      return 360
    case 'M15':
      return 280
    case 'H1':
      return 240
    case 'H4':
      return 200
    case 'D1':
      return 140
    default:
      return 200
  }
}
