/**
 * Canonical market data. The landing page and the dashboard both read from here,
 * so a figure can only ever be wrong in one place.
 *
 * SAMPLE DATA: the protocol is not live yet. Every figure is illustrative, sized so
 * the whole protocol sits under $500 of TVL. Replace with contract reads at launch.
 */

export type Market = {
  ticker: string
  company: string
  /** Stock Token price in USDG. */
  price: number
  /** Vault TVL in USDG. */
  tvl: number
  /** Estimated fee APR, percent. */
  feeApr: number
  /** Stock Token share of vault inventory, percent (the rest is USDG). */
  stockShare: number
  /** USDG value of one vault share (ERC-4626 convertToAssets(1e18)). */
  pricePerShare: number
  /** Gross fees the vault has collected since launch, USDG. */
  feesLifetime: number
  /** 24h swap volume through the vault's pool, USDG. */
  volume24h: number
  /** Lending: eligible as collateral. */
  collateral: boolean
}

export const MARKETS: Market[] = [
  { ticker: 'GME', company: 'GameStop', price: 26.4, tvl: 38.4, feeApr: 38.6, stockShare: 58, pricePerShare: 1.0318, feesLifetime: 1.98, volume24h: 13.42, collateral: false },
  { ticker: 'CRCL', company: 'Circle', price: 118.6, tvl: 52.15, feeApr: 31.2, stockShare: 44, pricePerShare: 1.0274, feesLifetime: 2.18, volume24h: 14.86, collateral: false },
  { ticker: 'AMD', company: 'AMD', price: 162.3, tvl: 71.9, feeApr: 24.7, stockShare: 47, pricePerShare: 1.0226, feesLifetime: 2.37, volume24h: 16.21, collateral: false },
  { ticker: 'AAPL', company: 'Apple', price: 228.4, tvl: 96.25, feeApr: 18.4, stockShare: 52, pricePerShare: 1.0187, feesLifetime: 2.36, volume24h: 16.18, collateral: true },
  { ticker: 'AMZN', company: 'Amazon', price: 214.1, tvl: 64.8, feeApr: 16.9, stockShare: 50, pricePerShare: 1.0162, feesLifetime: 1.46, volume24h: 10.02, collateral: true },
  { ticker: 'NVDA', company: 'NVIDIA', price: 178.9, tvl: 26.4, feeApr: 15.8, stockShare: 49, pricePerShare: 1.0141, feesLifetime: 0.56, volume24h: 3.81, collateral: true },
  { ticker: 'TSLA', company: 'Tesla', price: 348.6, tvl: 22.85, feeApr: 14.9, stockShare: 53, pricePerShare: 1.0129, feesLifetime: 0.46, volume24h: 3.11, collateral: false },
  { ticker: 'MSTR', company: 'Strategy', price: 372.4, tvl: 11.8, feeApr: 13.7, stockShare: 55, pricePerShare: 1.0113, feesLifetime: 0.22, volume24h: 1.48, collateral: false },
  { ticker: 'META', company: 'Meta', price: 742.1, tvl: 16.3, feeApr: 12.4, stockShare: 48, pricePerShare: 1.0102, feesLifetime: 0.27, volume24h: 1.85, collateral: false },
  { ticker: 'MSFT', company: 'Microsoft', price: 512.2, tvl: 21.1, feeApr: 11.2, stockShare: 51, pricePerShare: 1.0094, feesLifetime: 0.32, volume24h: 2.16, collateral: true },
  { ticker: 'GOOGL', company: 'Alphabet', price: 196.8, tvl: 18.75, feeApr: 10.6, stockShare: 50, pricePerShare: 1.0088, feesLifetime: 0.27, volume24h: 1.82, collateral: false },
  { ticker: 'INTC', company: 'Intel', price: 24.8, tvl: 11.6, feeApr: 9.3, stockShare: 46, pricePerShare: 1.0071, feesLifetime: 0.14, volume24h: 0.97, collateral: false },
  { ticker: 'SPY', company: 'SPDR S&P 500', price: 642.5, tvl: 15.9, feeApr: 7.1, stockShare: 50, pricePerShare: 1.0056, feesLifetime: 0.15, volume24h: 1.03, collateral: false },
]

/**
 * Isolated lending markets: USDG lent against one vault's shares. Each keeps its own
 * cash and its own losses. Totals: 468.20 supplied, 337.10 borrowed, 72.0% utilised.
 */
export type LendingMarketSeed = { ticker: string; supplied: number; borrowed: number }

export const LENDING_SEED: LendingMarketSeed[] = [
  { ticker: 'AAPL', supplied: 180, borrowed: 131.4 },
  { ticker: 'AMZN', supplied: 110, borrowed: 79.1 },
  { ticker: 'NVDA', supplied: 98.2, borrowed: 71.3 },
  { ticker: 'MSFT', supplied: 80, borrowed: 55.3 },
]

/** Risk parameters shared by every lending market. */
export const RISK = {
  /** Max loan-to-value when borrowing. */
  maxLtv: 0.5,
  /** Position is liquidatable when debt exceeds this share of collateral value. */
  liquidationThreshold: 0.65,
  /** Borrow APR = base + slope * utilisation (percent). */
  baseRate: 2,
  slope: 10.28,
}

/** Every vault is capped (per the concept's "capped, pausable" guard). USDG. */
export const VAULT_CAP = 1000

/** Protocol-wide figures that are not a sum of the markets above. */
export const PROTOCOL = {
  stoxBurned: 386.5,
  stoxPrice: 0.00499,
  buybackReserveUsdg: 0.62,
  feeSplit: { compound: 70, operations: 10, buyback: 20 },
}

export const marketByTicker = new Map(MARKETS.map((m) => [m.ticker, m]))

export const totalTvl = () => MARKETS.reduce((s, m) => s + m.tvl, 0)
export const totalFees = () => MARKETS.reduce((s, m) => s + m.feesLifetime, 0)

/* ---- deterministic history -------------------------------------------------- */

/** Small seeded PRNG so the charts are identical on every load and every build. */
function rng(seed: number) {
  let s = seed >>> 0
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0
    return s / 2 ** 32
  }
}

const seedOf = (t: string) => [...t].reduce((a, c) => a * 31 + c.charCodeAt(0), 7)

/**
 * A 30-day series that ends exactly on `end`, drifting up from ~`startRatio` of it
 * with bounded noise. Used for TVL and APR history.
 */
export function history(key: string, end: number, startRatio: number, noise: number, days = 30) {
  const r = rng(seedOf(key))
  const out: number[] = []
  for (let i = 0; i < days; i += 1) {
    const t = i / (days - 1)
    const trend = startRatio + (1 - startRatio) * t
    const wobble = i === days - 1 ? 0 : (r() - 0.5) * 2 * noise
    out.push(end * (trend + wobble))
  }
  return out
}

/** Dates for the last `days` days, oldest first, ending today. */
export function lastDays(days = 30, today = new Date()) {
  const out: Date[] = []
  for (let i = days - 1; i >= 0; i -= 1) {
    const d = new Date(today)
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - i)
    out.push(d)
  }
  return out
}
