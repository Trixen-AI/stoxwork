/**
 * Landing-page views over the canonical market data in ./markets.ts.
 * SAMPLE FIGURES: see that file.
 */
import { LENDING_SEED, MARKETS, RISK } from './markets'

export type Vault = {
  ticker: string
  company: string
  pair: string
  tvl: string
  feeApr: string
  /** xStock share / USDG share of the vault's inventory, in percent. */
  inventory: [number, number]
}

const usd = (n: number) => `$${n.toFixed(2)}`

// Top five by estimated fee APR, highest first, as the section heading promises.
export const TOP_VAULTS: Vault[] = MARKETS.toSorted((a, b) => b.feeApr - a.feeApr)
  .slice(0, 5)
  .map((m) => ({
    ticker: m.ticker,
    company: m.company,
    pair: `${m.ticker} / USDG`,
    tvl: usd(m.tvl),
    feeApr: `${m.feeApr.toFixed(1)}%`,
    inventory: [m.stockShare, 100 - m.stockShare],
  }))

export const VAULT_MARKETS: Array<{ ticker: string; company: string }> = [
  'AAPL', 'GOOGL', 'SPY', 'MSFT', 'NVDA', 'AMZN', 'META', 'TSLA', 'INTC', 'MSTR',
].map((t) => {
  const m = MARKETS.find((x) => x.ticker === t)!
  return { ticker: m.ticker, company: m.company }
})

/** Aggregate of the isolated lending markets, for the landing summary card. */
const supplied = LENDING_SEED.reduce((s, m) => s + m.supplied, 0)
const borrowed = LENDING_SEED.reduce((s, m) => s + m.borrowed, 0)
const util = borrowed / supplied
const borrowApr = RISK.baseRate + RISK.slope * util

export const LENDING_MARKET = {
  lendersEarn: `${(borrowApr * util).toFixed(1)}%`,
  borrowersPay: `${borrowApr.toFixed(1)}%`,
  utilization: Math.round(util * 100),
  available: (supplied - borrowed).toFixed(2),
}
