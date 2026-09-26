import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { StockLogo } from '@/components/brand/StockLogo'
import { AmountField } from '@/app/components/AmountField'
import { PageHeader } from '@/app/components/PageHeader'
import { Panel, PanelHeader } from '@/app/components/Panel'
import { TxButton } from '@/app/components/TxButton'
import { useTx } from '@/app/components/useTx'
import { ConnectPrompt } from '@/app/components/Wallet'
import { quote, reserves, SWAP_FEE } from '@/app/state/model'
import { useStore, validate } from '@/app/state/store'
import { MARKETS, marketByTicker } from '@/data/markets'
import { amount, num, parseAmount, pct, usd } from '@/lib/format'
import { cn } from '@/lib/cn'

export function Trade() {
  const { state } = useStore()
  const { run, pending } = useTx()
  const [params, setParams] = useSearchParams()
  const ticker = marketByTicker.has(params.get('ticker') ?? '') ? (params.get('ticker') as string) : 'AAPL'
  const [side, setSide] = useState<'usdg' | 'stock'>('usdg')
  const [raw, setRaw] = useState('')

  const meta = marketByTicker.get(ticker)!
  const v = state.vaults[ticker]
  const n = parseAmount(raw)
  const q = quote(v, meta.price, side, n)
  const pay = side === 'usdg' ? 'USDG' : ticker
  const get = side === 'usdg' ? ticker : 'USDG'
  const action = { type: 'swap', ticker, side, amountIn: n } as const
  const error = raw ? validate(state, action) : null
  const r = reserves(v, meta.price)
  const impact = q?.priceImpact ?? 0

  return (
    <>
      <PageHeader
        eyebrow="Trade"
        title="Swap through the vaults"
        description="Every xStock trades against its own vault's pool. The 0.30% swap fee stays in the vault and is what depositors earn."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_400px]">
        <Panel>
          <PanelHeader title="Markets" aside={<span className="text-xs text-foreground/40">Oracle price · pool depth</span>} />
          <ul className="grid gap-px bg-foreground/[0.05] sm:grid-cols-2">
            {MARKETS.map((m) => {
              const pool = state.vaults[m.ticker]
              return (
                <li key={m.ticker}>
                  <button
                    type="button"
                    onClick={() => {
                      setParams({ ticker: m.ticker })
                      setRaw('')
                    }}
                    aria-pressed={m.ticker === ticker}
                    className={cn(
                      'flex w-full cursor-pointer items-center gap-3 bg-card px-5 py-3.5 text-left transition-colors',
                      m.ticker === ticker ? 'bg-foreground/[0.05]' : 'hover:bg-foreground/[0.03]',
                    )}
                  >
                    <StockLogo ticker={m.ticker} size="sm" />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-medium">{m.ticker}</span>
                      <span className="block truncate text-xs text-foreground/40">{m.company}</span>
                    </span>
                    <span className="text-right">
                      <span className="tnum block font-mono text-sm">{usd(m.price)}</span>
                      <span className="tnum block font-mono text-[11px] text-foreground/35">pool {usd(pool.tvl)}</span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>
        </Panel>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <Panel>
            <PanelHeader
              title={
                <span className="flex items-center gap-2">
                  Swap {ticker}
                </span>
              }
              aside={
                <Link to={`/app/vaults/${ticker}`} className="text-xs text-foreground/50 hover:text-foreground">
                  {ticker} vault →
                </Link>
              }
            />
            {state.wallet.connected ? (
              <div className="flex flex-col gap-4 p-5">
                <AmountField
                  label="You pay"
                  unit={pay}
                  value={raw}
                  onChange={setRaw}
                  max={state.balances[pay] ?? 0}
                  maxLabel="Wallet"
                  error={error}
                />

                <button
                  type="button"
                  onClick={() => {
                    setSide((s) => (s === 'usdg' ? 'stock' : 'usdg'))
                    setRaw('')
                  }}
                  aria-label="Switch direction"
                  className="mx-auto flex h-8 w-8 cursor-pointer items-center justify-center rounded-full border border-foreground/10 text-foreground/60 transition-colors hover:border-brand-bright/40 hover:text-brand-bright"
                >
                  <svg viewBox="0 0 16 16" className="h-3.5 w-3.5" aria-hidden="true">
                    <path d="M5 2v11m0 0-3-3m3 3 3-3M11 14V3m0 0L8 6m3-3 3 3" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </button>

                <div className="rounded-lg border border-foreground/10 bg-background/60 px-3 py-3">
                  <p className="text-xs text-foreground/55">You receive (estimated)</p>
                  <p className="tnum mt-1 font-mono text-lg">
                    {q ? amount(q.out) : '0.00'} <span className="text-xs text-foreground/45">{get}</span>
                  </p>
                </div>

                <dl className="space-y-2 rounded-lg border border-foreground/[0.06] bg-background/40 p-4 text-xs">
                  <div className="flex justify-between">
                    <dt className="text-foreground/45">Oracle price</dt>
                    <dd className="tnum font-mono text-foreground/80">{usd(meta.price)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-foreground/45">Your price</dt>
                    <dd className="tnum font-mono text-foreground/80">
                      {q ? usd(side === 'usdg' ? 1 / q.executionPrice : q.executionPrice) : '–'}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-foreground/45">Price impact</dt>
                    <dd className={cn('tnum font-mono', impact > 0.05 ? 'text-ink-rose' : 'text-foreground/80')}>{q ? pct(impact * 100, 2) : '–'}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-foreground/45">Fee to vault ({pct(SWAP_FEE * 100, 2)})</dt>
                    <dd className="tnum font-mono text-foreground/80">{q ? `${amount(q.fee)} ${pay}` : '–'}</dd>
                  </div>
                </dl>

                {q && impact > 0.05 && !error ? (
                  <p role="alert" className="rounded-lg border border-ink-rose/30 bg-ink-rose/10 px-3 py-2 text-xs text-ink-rose">
                    High price impact: this pool holds {usd(v.tvl)}. A smaller trade gets a better price.
                  </p>
                ) : null}

                <TxButton
                  label={`Swap ${pay} for ${get}`}
                  pending={pending}
                  disabled={!n || Boolean(error)}
                  onClick={() => {
                    run(action, `Swapped ${amount(n)} ${pay} for ${q ? amount(q.out) : ''} ${get}`)
                    setRaw('')
                  }}
                />

                <p className="text-[11px] text-foreground/35">
                  Pool reserves: {num(r.stock, 4)} {ticker} · {usd(r.usdg)} USDG
                </p>
              </div>
            ) : (
              <ConnectPrompt what="swap" />
            )}
          </Panel>
        </div>
      </div>
    </>
  )
}

export default Trade
