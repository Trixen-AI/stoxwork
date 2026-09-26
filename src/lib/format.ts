const usdFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', minimumFractionDigits: 2, maximumFractionDigits: 2 })

/** $1,234.56 */
export const usd = (n: number) => usdFmt.format(Number.isFinite(n) ? n : 0)

/** Plain number with a fixed number of decimals and thousands separators. */
export const num = (n: number, digits = 2) =>
  (Number.isFinite(n) ? n : 0).toLocaleString('en-US', { minimumFractionDigits: digits, maximumFractionDigits: digits })

/** 18.40% */
export const pct = (n: number, digits = 2) => `${num(n, digits)}%`

/** Token amounts: 4 decimals under 1, 2 above, so small xStock balances stay readable. */
export const amount = (n: number) => num(n, Math.abs(n) < 1 && n !== 0 ? 4 : 2)

export const shortAddr = (a: string) => `${a.slice(0, 6)}…${a.slice(-4)}`

const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' })

export function timeAgo(ts: number, now = Date.now()) {
  const s = Math.round((ts - now) / 1000)
  const abs = Math.abs(s)
  if (abs < 60) return rtf.format(s, 'second')
  if (abs < 3600) return rtf.format(Math.round(s / 60), 'minute')
  if (abs < 86400) return rtf.format(Math.round(s / 3600), 'hour')
  return rtf.format(Math.round(s / 86400), 'day')
}

const dayFmt = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
export const shortDate = (d: Date) => dayFmt.format(d)

/** Parse a user-typed amount. Empty or invalid input is 0, never NaN. */
export function parseAmount(raw: string) {
  const n = Number.parseFloat(raw.replace(/,/g, ''))
  return Number.isFinite(n) && n > 0 ? n : 0
}
