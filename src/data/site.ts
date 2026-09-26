export const BRAND = {
  name: 'EquiYield',
  tagline: 'Put your USDG to work.',
  chain: 'Solana',
  description:
    'Deposit USDG into a vault for a single tokenized stock market and earn a share of the trading fees its liquidity collects.',
} as const

export type NavItem = {
  label: string
  href: string
  external?: boolean
  children?: NavItem[]
}

export const NAV: NavItem[] = [
  { label: 'Home', href: '/' },
  {
    label: 'Products',
    href: '#vaults',
    children: [
      { label: 'Vaults', href: '#vaults' },
      { label: 'Lending', href: '#lending' },
      { label: 'Strategies', href: '#strategies' },
      { label: 'Fee split', href: '#fees' },
    ],
  },
  {
    label: 'Platform',
    href: '/app',
    children: [
      { label: 'Trade', href: '/app/trade' },
      { label: 'Intelligence', href: '/app/intelligence' },
      { label: 'Portfolio', href: '/app' },
      { label: 'Protocol figures', href: '#figures' },
    ],
  },
  {
    label: 'Resources',
    href: '#guarded',
    children: [
      { label: 'Docs', href: '#guarded' },
      { label: 'Help center', href: '#guarded' },
      { label: 'System status', href: '#guarded' },
    ],
  },
]

/** Where "Launch App" points: the dashboard. */
export const APP_URL = '/app'

export type SocialKey = 'x'

export const SOCIAL: Array<{ key: SocialKey; label: string; href: string }> = [
  { key: 'x', label: 'EquiYield on X', href: 'https://x.com/EquiYield_xyz' },
]

export const FOOTER_COLUMNS: Array<{ title: string; links: NavItem[] }> = [
  {
    title: 'Products',
    links: [
      { label: 'Vaults', href: '/app/vaults' },
      { label: 'Lending', href: '/app/lending' },
      { label: 'Strategies', href: '/app/strategies' },
    ],
  },
  {
    title: 'Platform',
    links: [
      { label: 'Trade', href: '/app/trade' },
      { label: 'Intelligence', href: '/app/intelligence' },
      { label: 'Portfolio', href: '/app' },
    ],
  },
  {
    title: 'Resources',
    links: [
      { label: 'Docs', href: '#guarded' },
      { label: 'Help center', href: '#guarded' },
      { label: 'System status', href: '#guarded' },
      { label: 'Follow on X', href: 'https://x.com/EquiYield_xyz', external: true },
    ],
  },
]

export const LEGAL =
  'xStocks are tokenised instruments issued by Backed. They are not ownership interests in the referenced shares, are not available to U.S. persons, and are restricted in other jurisdictions. Vault shares are not a stablecoin, are not principal-protected, and are not a deposit. Fee APR figures are estimates derived from observed pool fees, not forecasts.'
