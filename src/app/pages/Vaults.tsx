import { useDeferredValue, useState } from 'react'
import { Link, useNavigate } from 'react-router'
import { StockLogo } from '@/components/brand/StockLogo'
import { PageHeader } from '@/app/components/PageHeader'
import { Panel } from '@/app/components/Panel'
import { StatGrid, StatTile } from '@/app/components/StatTile'
import { useStore } from '@/app/state/store'
import { MARKETS } from '@/data/markets'
import { amount, pct, usd } from '@/lib/format'
import { cn } from '@/lib/cn'

type SortKey = 'feeApr' | 'tvl' | 'volume24h' | 'ticker'

const COLUMNS: Array<{ key: SortKey; label: string; align?: 'right' }> = [
  { key: 'ticker', label: 'Vault' },
  { key: 'tvl', label: 'TVL', align: 'right' },
  { key: 'feeApr', label: 'Est. fee APR', align: 'right' },
  { key: 'volume24h', label: 'Volume 24h', align: 'right' },
]

export function Vaults() {
  const { state } = useStore()
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [sort, setSort] = useState<{ key: SortKey; dir: 1 | -1 }>({ key: 'feeApr', dir: -1 })
  const q = useDeferredValue(query.trim().toLowerCase())

  // Live figures (TVL moves as people deposit and trade) joined to static metadata.
  const rows = MARKETS.map((m) => {
    const v = state.vaults[m.ticker]
    return { ...m, tvl: v.tvl, volume24h: v.volume24h, stockShare: v.stockShare, mine: (state.positions[m.ticker]?.shares ?? 0) * v.pricePerShare }
  })
    .filter((r) => !q || r.ticker.toLowerCase().includes(q) || r.company.toLowerCase().includes(q))
    .toSorted((a, b) => {
      const d = sort.key === 'ticker' ? a.ticker.localeCompare(b.ticker) : a[sort.key] - b[sort.key]
      return d * sort.dir
    })

  const tvl = Object.values(state.vaults).reduce((s, v) => s + v.tvl, 0)
  const vol = Object.values(state.vaults).reduce((s, v) => s + v.volume24h, 0)
  const best = MARKETS.reduce((a, b) => (b.feeApr > a.feeApr ? b : a))

  const toggle = (key: SortKey) =>
    setSort((s) => (s.key === key ? { key, dir: s.dir === 1 ? -1 : 1 } : { key, dir: key === 'ticker' ? 1 : -1 }))

  return (
    <>
      <PageHeader
        eyebrow="Vaults"
        title="One vault. One xStock."
        description="Each vault runs managed liquidity for a single USDG / xStock pool. Deposit USDG, own a slice of that market, and fees compound inside the vault."
      />

      <StatGrid className="mb-6 grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total value locked" value={usd(tvl)} note={`Across ${MARKETS.length} vaults`} />
        <StatTile label="Volume 24h" value={usd(vol)} note="Swaps through vault pools" />
        <StatTile label="Top est. APR" value={pct(best.feeApr, 1)} tone="brand" note={`${best.ticker} vault`} />
        <StatTile
          label="Your deposits"
          value={state.wallet.connected ? usd(rows.reduce((s, r) => s + r.mine, 0)) : '–'}
          note={state.wallet.connected ? 'Current value' : 'Connect a wallet'}
        />
      </StatGrid>

      <div className="mb-4">
        <label htmlFor="vault-search" className="sr-only">
          Search vaults
        </label>
        <input
          id="vault-search"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search ticker or company"
          className="w-full rounded-lg border border-foreground/10 bg-card px-4 py-2.5 text-sm outline-none placeholder:text-foreground/30 focus:border-brand-bright/50 sm:w-72"
        />
      </div>

      <Panel>
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-foreground/[0.06] font-mono text-[10px] tracking-[0.14em] text-foreground/40 uppercase">
                {COLUMNS.map((c) => (
                  <th key={c.key} scope="col" aria-sort={sort.key === c.key ? (sort.dir === 1 ? 'ascending' : 'descending') : 'none'} className={cn('px-5 py-3 font-medium', c.align === 'right' ? 'text-right' : 'text-left')}>
                    <button type="button" onClick={() => toggle(c.key)} className="cursor-pointer uppercase transition-colors hover:text-foreground">
                      {c.label}
                      <span aria-hidden="true" className={sort.key === c.key ? 'text-brand-bright' : 'text-transparent'}>
                        {sort.dir === 1 ? ' ↑' : ' ↓'}
                      </span>
                    </button>
                  </th>
                ))}
                <th scope="col" className="px-5 py-3 text-right font-medium">Inventory</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">
                  <span className="sr-only">Action</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr
                  key={r.ticker}
                  onClick={() => navigate(`/app/vaults/${r.ticker}`)}
                  className="cursor-pointer border-b border-foreground/[0.04] transition-colors last:border-0 hover:bg-foreground/[0.03]"
                >
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <StockLogo ticker={r.ticker} />
                      <span>
                        <span className="block font-medium">{r.ticker}</span>
                        <span className="block text-xs text-foreground/40">{r.company}</span>
                      </span>
                    </div>
                  </td>
                  <td className="tnum px-5 py-3.5 text-right font-mono text-foreground/80">{usd(r.tvl)}</td>
                  <td className="tnum px-5 py-3.5 text-right font-mono text-brand-bright/90">{pct(r.feeApr, 1)}</td>
                  <td className="tnum px-5 py-3.5 text-right font-mono text-foreground/60">{usd(r.volume24h)}</td>
                  <td className="px-5 py-3.5 text-right">
                    <span className="tnum font-mono text-xs text-foreground/55">
                      {amount(r.stockShare)} / {amount(100 - r.stockShare)}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <Link
                      to={`/app/vaults/${r.ticker}`}
                      onClick={(e) => e.stopPropagation()}
                      className="rounded-md border border-foreground/10 px-3 py-1.5 text-xs text-foreground/70 transition-colors hover:border-brand-bright/40 hover:text-brand-bright"
                    >
                      {state.wallet.connected && r.mine > 0 ? 'Manage' : 'Deposit'}
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {rows.length === 0 ? <p className="px-5 py-10 text-center text-sm text-foreground/45">No vault matches “{query}”.</p> : null}
        </div>
      </Panel>
    </>
  )
}

export default Vaults
