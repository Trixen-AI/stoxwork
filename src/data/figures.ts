import { MARKETS, PROTOCOL, totalFees, totalTvl } from './markets'

export type Figure = {
  label: string
  value: string
  note: string
}

// SAMPLE FIGURES, derived from the canonical market data in ./markets.ts.
export const PROTOCOL_FIGURES: Figure[] = [
  {
    label: 'Total value locked',
    value: `$${totalTvl().toFixed(2)}`,
    note: `USDG across ${MARKETS.length} xStock vaults`,
  },
  {
    label: 'Fees earned, lifetime',
    value: `$${totalFees().toFixed(2)}`,
    note: 'Gross, before the protocol split',
  },
  {
    label: 'EQY tokens burned',
    value: PROTOCOL.eqyBurned.toFixed(1),
    note: '20% of fees fund buybacks and burns.',
  },
]

export type FeeSlice = {
  label: string
  percent: number
  detail: string
  tone: 'brand' | 'neutral' | 'blue'
}

export const FEE_SPLIT: FeeSlice[] = [
  { label: 'Compounds', percent: 70, detail: 'Stays in the vault for depositors', tone: 'brand' },
  { label: 'Protocol operations', percent: 10, detail: 'Treasury', tone: 'neutral' },
  { label: 'EQY buyback reserve', percent: 20, detail: 'Bought back and burned', tone: 'blue' },
]

export const HERO_POINTS = [
  'One vault per market',
  'Fees and interest recorded onchain',
  'Canonical xStocks only',
]

export const GUARD_CARDS = [
  {
    title: 'Fresh oracle data',
    body: 'Pyth price and confidence feeds must be fresh before any deposit, swap or borrow.',
    icon: 'feed' as const,
  },
  {
    title: 'Caps on every market',
    body: 'Vaults and lending markets are each capped, so one market cannot absorb the whole protocol.',
    icon: 'cap' as const,
  },
  {
    title: 'Guardian pause',
    body: 'Every product is pausable by a guardian role and verifiable onchain at any block.',
    icon: 'pause' as const,
  },
]
