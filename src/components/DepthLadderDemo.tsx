import { useMemo } from 'react'

type Row = { price: string; bid: number; ask: number }

function demoLadder(mid: number, digits: number): Row[] {
  const step = mid > 200 ? mid * 0.00015 : mid > 50 ? mid * 0.0002 : 0.0001
  const rows: Row[] = []
  for (let i = 8; i >= 1; i--) {
    const p = mid + step * i
    rows.push({
      price: p.toFixed(digits),
      bid: 0,
      ask: Math.round(120 + i * 35 + (i % 3) * 12),
    })
  }
  rows.push({
    price: mid.toFixed(digits),
    bid: Math.round(280 + (8 % 5) * 40),
    ask: Math.round(260 + (8 % 4) * 30),
  })
  for (let i = 1; i <= 8; i++) {
    const p = mid - step * i
    rows.push({
      price: p.toFixed(digits),
      bid: Math.round(95 + i * 42 + (i % 4) * 18),
      ask: 0,
    })
  }
  return rows
}

type Props = {
  midPrice: number
  digits: number
  bidColLabel: string
  askColLabel: string
  priceLabel: string
}

export function DepthLadderDemo({ midPrice, digits, bidColLabel, askColLabel, priceLabel }: Props) {
  const rows = useMemo(() => demoLadder(midPrice, digits), [midPrice, digits])
  const maxVol = useMemo(() => Math.max(...rows.map((r) => Math.max(r.bid, r.ask))), [rows])

  return (
    <div className="depth-ladder" role="img" aria-label="Order book depth demo">
      <div className="depth-ladder-head">
        <span className="depth-ladder-col depth-ladder-col--bid">{bidColLabel}</span>
        <span className="depth-ladder-col depth-ladder-col--px">{priceLabel}</span>
        <span className="depth-ladder-col depth-ladder-col--ask">{askColLabel}</span>
      </div>
      <div className="depth-ladder-body">
        {rows.map((r, idx) => (
          <div key={`${r.price}-${idx}`} className="depth-ladder-row">
            <div className="depth-cell depth-cell--bid">
              {r.bid > 0 ? (
                <>
                  <span
                    className="depth-bar depth-bar--bid"
                    style={{ width: `${(r.bid / maxVol) * 100}%` }}
                  />
                  <span className="depth-vol">{r.bid}</span>
                </>
              ) : (
                <span className="depth-empty">—</span>
              )}
            </div>
            <div className="depth-cell depth-cell--px mono">{r.price}</div>
            <div className="depth-cell depth-cell--ask">
              {r.ask > 0 ? (
                <>
                  <span
                    className="depth-bar depth-bar--ask"
                    style={{ width: `${(r.ask / maxVol) * 100}%` }}
                  />
                  <span className="depth-vol">{r.ask}</span>
                </>
              ) : (
                <span className="depth-empty">—</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
