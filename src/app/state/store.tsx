import { createContext, use, useMemo, useReducer, type ReactNode } from 'react'
import { marketByTicker, VAULT_CAP } from '@/data/markets'
import { available, healthFactor, maxBorrow, MAX_PRICE_IMPACT, quote, seedState, type LoanPosition, type State } from './model'

/* ---- actions ---------------------------------------------------------------- */

/**
 * The store only ever changes from real sources: the wallet connection, and the
 * balances read from chain for that wallet. Transactions never edit it: a real
 * transaction changes the chain, and the next balance read reflects it.
 */
export type Action =
  | { type: 'walletSync'; connected: boolean; address: string }
  | { type: 'balances'; status: State['balancesStatus']; balances?: Record<string, number> }

/** What a user asks the protocol to do. Validated here, sent by useTx. */
export type TxAction =
  | { type: 'deposit'; ticker: string; usdg: number }
  | { type: 'withdraw'; ticker: string; shares: number }
  | { type: 'supply'; ticker: string; usdg: number }
  | { type: 'withdrawSupply'; ticker: string; usdg: number }
  | { type: 'lock'; ticker: string; shares: number }
  | { type: 'unlock'; ticker: string; shares: number }
  | { type: 'borrow'; ticker: string; usdg: number }
  | { type: 'repay'; ticker: string; usdg: number }
  | { type: 'swap'; ticker: string; side: 'usdg' | 'stock'; amountIn: number }

const EPS = 1e-9
const emptyLoan: LoanPosition = { supplied: 0, collateralShares: 0, borrowed: 0 }

const bal = (s: State, k: string) => s.balances[k] ?? 0
export const loanOf = (s: State, t: string) => s.loans[t] ?? emptyLoan

/**
 * Every rule a transaction must pass, in one place, checked against the wallet's
 * real balances. The forms call it to show an inline error as the user types.
 * Returns an error message, or null when valid.
 */
export function validate(s: State, a: TxAction): string | null {
  if (!s.wallet.connected) return 'Connect a wallet first'
  const v = s.vaults[a.ticker]
  if (!v) return 'Unknown market'

  switch (a.type) {
    case 'deposit':
      if (!(a.usdg > 0)) return 'Enter an amount'
      if (a.usdg > bal(s, 'USDG') + EPS) return 'Not enough USDG in wallet'
      if (v.tvl + a.usdg > VAULT_CAP + EPS) return `Vault cap reached: ${(VAULT_CAP - v.tvl).toFixed(2)} USDG of room left`
      return null
    case 'withdraw': {
      if (!(a.shares > 0)) return 'Enter an amount'
      const held = s.positions[a.ticker]?.shares ?? 0
      if (a.shares > held + EPS) return held > 0 ? 'More than your vault shares' : 'You have no shares in this vault'
      return null
    }
    case 'supply':
      if (!s.markets[a.ticker]) return 'No lending market for this vault'
      if (!(a.usdg > 0)) return 'Enter an amount'
      if (a.usdg > bal(s, 'USDG') + EPS) return 'Not enough USDG in wallet'
      return null
    case 'withdrawSupply': {
      const m = s.markets[a.ticker]
      if (!m) return 'No lending market for this vault'
      if (!(a.usdg > 0)) return 'Enter an amount'
      if (a.usdg > loanOf(s, a.ticker).supplied + EPS) return 'More than you supplied'
      if (a.usdg > available(m) + EPS) return 'Not enough idle cash in the market right now'
      return null
    }
    case 'lock': {
      if (!s.markets[a.ticker]) return 'This vault is not eligible collateral'
      if (!(a.shares > 0)) return 'Enter an amount'
      const held = s.positions[a.ticker]?.shares ?? 0
      if (a.shares > held + EPS) return held > 0 ? 'More than your vault shares' : 'You have no shares in this vault to lock'
      return null
    }
    case 'unlock': {
      const loan = loanOf(s, a.ticker)
      if (!(a.shares > 0)) return 'Enter an amount'
      if (a.shares > loan.collateralShares + EPS) return 'More than your locked shares'
      const after = { ...loan, collateralShares: loan.collateralShares - a.shares }
      if (after.borrowed > maxBorrow(after, v) + EPS) return 'Unlocking this much would exceed your borrow limit'
      return null
    }
    case 'borrow': {
      const m = s.markets[a.ticker]
      if (!m) return 'No lending market for this vault'
      if (!(a.usdg > 0)) return 'Enter an amount'
      const loan = loanOf(s, a.ticker)
      if (loan.borrowed + a.usdg > maxBorrow(loan, v) + EPS) return 'Above your borrow limit (50% of locked collateral)'
      if (a.usdg > available(m) + EPS) return 'Not enough idle cash in the market'
      return null
    }
    case 'repay': {
      const loan = loanOf(s, a.ticker)
      if (!(a.usdg > 0)) return 'Enter an amount'
      if (a.usdg > loan.borrowed + EPS) return loan.borrowed > 0 ? 'More than you owe' : 'You have no loan in this market'
      if (a.usdg > bal(s, 'USDG') + EPS) return 'Not enough USDG in wallet'
      return null
    }
    case 'swap': {
      const m = marketByTicker.get(a.ticker)!
      if (!(a.amountIn > 0)) return 'Enter an amount'
      const payToken = a.side === 'usdg' ? 'USDG' : a.ticker
      if (a.amountIn > bal(s, payToken) + EPS) return `Not enough ${payToken} in wallet`
      const q = quote(v, m.price, a.side, a.amountIn)
      if (!q || q.priceImpact > MAX_PRICE_IMPACT) return 'Price impact above 30%: this pool is too small for that size'
      return null
    }
  }
}

/* ---- reducer ---------------------------------------------------------------- */

export function reducer(s: State, a: Action): State {
  switch (a.type) {
    case 'walletSync':
      if (s.wallet.connected === a.connected && s.wallet.address === a.address) return s
      // A different (or no) wallet means the old balances no longer apply.
      return {
        ...s,
        wallet: { connected: a.connected, address: a.address },
        balances: {},
        balancesStatus: a.connected ? 'loading' : 'idle',
      }
    case 'balances':
      return { ...s, balancesStatus: a.status, balances: a.balances ?? s.balances }
  }
}

/* ---- context ------------------------------------------------------------------ */

// Earlier builds saved simulated balances in the browser. Nothing is stored now, so
// clear those once so no old figure can ever resurface.
try {
  localStorage.removeItem('equiyield.demo.v1')
  localStorage.removeItem('equiyield.demo.v2')
} catch {
  // storage unavailable: nothing to clear
}

type Ctx = { state: State; dispatch: (a: Action) => void }
const StoreContext = createContext<Ctx | null>(null)

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(reducer, undefined, seedState)
  const value = useMemo(() => ({ state, dispatch }), [state])
  return <StoreContext value={value}>{children}</StoreContext>
}

export function useStore() {
  const ctx = use(StoreContext)
  if (!ctx) throw new Error('useStore must be used inside <StoreProvider>')
  return ctx
}

/** Convenience: a loan's health factor against its vault's current price per share. */
export function loanHealth(s: State, ticker: string) {
  return healthFactor(loanOf(s, ticker), s.vaults[ticker])
}
