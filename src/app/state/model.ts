/**
 * Dashboard domain model: state shape and pure maths. No React in this file.
 *
 * Protocol figures are sample data until deployment; wallet balances are real.
 * The maths mirror the contracts the concept describes:
 *   - ERC-4626 vaults: deposit USDG, receive shares at the vault's price per share
 *   - isolated lending markets: supply USDG, or lock vault shares and borrow USDG
 *   - swaps through a vault's pool: constant product, 0.30% fee stays in the vault
 */
import { LENDING_SEED, MARKETS, RISK } from '@/data/markets'

export const SWAP_FEE = 0.003
export const MAX_PRICE_IMPACT = 0.3

/* ---- state ---------------------------------------------------------------- */

export type VaultState = { ticker: string; tvl: number; pricePerShare: number; stockShare: number; volume24h: number; feesLifetime: number }
export type MarketState = { ticker: string; supplied: number; borrowed: number }

/** One user position in a vault, with the price per share it was entered at. */
export type VaultPosition = { shares: number; entryPps: number }
/** One user position in an isolated lending market. */
export type LoanPosition = { supplied: number; collateralShares: number; borrowed: number }

export type ActivityKind = 'deposit' | 'withdraw' | 'supply' | 'withdrawSupply' | 'lock' | 'unlock' | 'borrow' | 'repay' | 'swap'

export type Activity = {
  id: string
  kind: ActivityKind
  ticker: string
  /** Primary amount in USDG (or shares for lock/unlock). */
  amount: number
  detail: string
  at: number
  hash: string
}

export type State = {
  wallet: { connected: boolean; address: string }
  /** Real token balances of the connected wallet, read from chain. Symbol -> amount. */
  balances: Record<string, number>
  balancesStatus: 'idle' | 'loading' | 'ready' | 'error'
  /** StoxWork vault positions and loans. Empty until the contracts are deployed. */
  positions: Record<string, VaultPosition>
  loans: Record<string, LoanPosition>
  /** Protocol market state (sample figures, see data/markets.ts). */
  vaults: Record<string, VaultState>
  markets: Record<string, MarketState>
  /** StoxWork transactions by this wallet. Empty until the contracts are deployed. */
  activity: Activity[]
}

/**
 * Starting state. Nothing about the user is invented: balances arrive from chain
 * once a wallet connects, and positions, loans and activity stay empty until the
 * StoxWork contracts exist for them to live in.
 */
export function seedState(): State {
  return {
    wallet: { connected: false, address: '' },
    balances: {},
    balancesStatus: 'idle',
    positions: {},
    loans: {},
    vaults: Object.fromEntries(
      MARKETS.map((m) => [
        m.ticker,
        { ticker: m.ticker, tvl: m.tvl, pricePerShare: m.pricePerShare, stockShare: m.stockShare, volume24h: m.volume24h, feesLifetime: m.feesLifetime },
      ]),
    ),
    markets: Object.fromEntries(LENDING_SEED.map((m) => [m.ticker, { ...m }])),
    activity: [],
  }
}

/* ---- lending maths --------------------------------------------------------- */

export const utilisation = (m: MarketState) => (m.supplied > 0 ? m.borrowed / m.supplied : 0)
/** Borrow APR, percent, from the market's utilisation curve. */
export const borrowApr = (m: MarketState) => RISK.baseRate + RISK.slope * utilisation(m)
/** Supply APY, percent: all interest flows to lenders. */
export const supplyApy = (m: MarketState) => borrowApr(m) * utilisation(m)
export const available = (m: MarketState) => Math.max(0, m.supplied - m.borrowed)

export const collateralValue = (loan: LoanPosition, v: VaultState) => loan.collateralShares * v.pricePerShare
export const maxBorrow = (loan: LoanPosition, v: VaultState) => collateralValue(loan, v) * RISK.maxLtv

/** Health factor: above 1 is safe, at or below 1 is liquidatable. Infinity with no debt. */
export function healthFactor(loan: Pick<LoanPosition, 'collateralShares' | 'borrowed'>, v: VaultState) {
  if (loan.borrowed <= 0) return Number.POSITIVE_INFINITY
  return (loan.collateralShares * v.pricePerShare * RISK.liquidationThreshold) / loan.borrowed
}

export type HealthTone = 'safe' | 'watch' | 'risk'
export const healthTone = (hf: number): HealthTone => (hf >= 1.5 ? 'safe' : hf >= 1.15 ? 'watch' : 'risk')

/* ---- swap maths ------------------------------------------------------------ */

/** The pool behind a vault: its inventory split into two reserves. */
export function reserves(v: VaultState, price: number) {
  const usdg = v.tvl * (1 - v.stockShare / 100)
  const stock = (v.tvl * (v.stockShare / 100)) / price
  return { usdg, stock }
}

export type Quote = { out: number; fee: number; priceImpact: number; executionPrice: number }

/** Constant-product quote. `side` is what the user pays in. */
export function quote(v: VaultState, price: number, side: 'usdg' | 'stock', amountIn: number): Quote | null {
  if (!(amountIn > 0)) return null
  const r = reserves(v, price)
  const [x, y] = side === 'usdg' ? [r.usdg, r.stock] : [r.stock, r.usdg]
  const fee = amountIn * SWAP_FEE
  const inAfterFee = amountIn - fee
  const out = (y * inAfterFee) / (x + inAfterFee)
  const spot = y / x
  const executionPrice = out / amountIn
  const priceImpact = 1 - executionPrice / spot
  return { out, fee, priceImpact, executionPrice }
}

/* ---- portfolio ------------------------------------------------------------- */

export function positionValue(p: VaultPosition, v: VaultState) {
  const value = p.shares * v.pricePerShare
  const earned = p.shares * (v.pricePerShare - p.entryPps)
  return { value, earned }
}
