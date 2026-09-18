import { Link } from 'react-router'
import { StockLogo } from '@/components/brand/StockLogo'
import { PageHeader } from '@/app/components/PageHeader'
import { Panel, PanelHeader } from '@/app/components/Panel'
import { useStore } from '@/app/state/store'
import { MARKETS } from '@/data/markets'
import { pct, usd } from '@/lib/format'

/** A strategy is shown for understanding only: no deposit control exists on this page. */
function Closed() {
  return (
    <span className="rounded-full border border-foreground/10 bg-foreground/[0.04] px-2.5 py-1 font-mono text-[10px] tracking-wider text-foreground/50 uppercase">
      In design · deposits closed
    </span>
  )
}

export function Strategies() {
  const { state } = useStore()
  // The basket would hold the best-earning vaults; this previews which ones, today.
  const basket = MARKETS.toSorted((a, b) => b.feeApr - a.feeApr).slice(0, 5)
  const maxApr = basket[0].feeApr

  return (
    <>
      <PageHeader
        eyebrow="Strategies"
        title="Managed positions that combine vaults and lending"
        description="Two strategies are being designed. Deposits open only after review, and no terms, targets or rates are published yet."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel>
          <PanelHeader title="Top-vault basket" aside={<Closed />} />
          <div className="p-5">
            <p className="text-sm leading-relaxed text-foreground/60">
              One deposit spread across the best-earning vaults, rebalanced as their fee APRs move. This is what the basket
              would hold if it ran today.
            </p>
            <ul className="mt-5 flex flex-col gap-3">
              {basket.map((m) => (
                <li key={m.ticker} className="flex items-center gap-3">
                  <StockLogo ticker={m.ticker} size="sm" />
                  <span className="w-12 text-sm font-medium">{m.ticker}</span>
                  {/* one series: a single hue, length carries the value */}
                  <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.06]">
                    <span className="block h-full rounded-full" style={{ width: `${(m.feeApr / maxApr) * 100}%`, background: 'var(--chart-1)' }} />
                  </span>
                  <span className="tnum w-14 text-right font-mono text-xs text-foreground/70">{pct(m.feeApr, 1)}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-[11px] text-foreground/35">Estimated fee APR of each vault today. Not a strategy return.</p>
          </div>
        </Panel>

        <Panel>
          <PanelHeader title="Delta-neutral vault yield" aside={<Closed />} />
          <div className="p-5">
            <p className="text-sm leading-relaxed text-foreground/60">
              Keep a vault's trading fees while an external short offsets the Stock Token's price moves.
            </p>
            <div className="mt-5 grid gap-px overflow-hidden rounded-lg border border-foreground/[0.07] bg-foreground/[0.06]">
              <div className="flex items-center gap-3 bg-card p-4">
                <StockLogo ticker="TSLA" size="sm" />
                <span className="flex-1">
                  <span className="block font-mono text-[10px] tracking-[0.14em] text-gold-bright/80 uppercase">↗ Long</span>
                  <span className="block text-sm">TSLA / USDG vault position</span>
                </span>
                <span className="text-xs text-foreground/45">earns trading fees</span>
              </div>
              <div className="flex items-center gap-3 bg-card p-4">
                <StockLogo ticker="TSLA" size="sm" />
                <span className="flex-1">
                  <span className="block font-mono text-[10px] tracking-[0.14em] text-ink-rose/80 uppercase">↘ Short</span>
                  <span className="block text-sm">TSLA hedge on an external venue</span>
                </span>
                <span className="text-xs text-foreground/45">offsets price exposure</span>
              </div>
            </div>
            <p className="mt-4 text-[11px] text-foreground/35">Not principal-protected. The hedge venue carries its own risk.</p>
          </div>
        </Panel>
      </div>

      <Panel className="mt-6 p-5">
        <p className="text-sm font-medium">Until then, the building blocks are live</p>
        <p className="mt-1 text-sm text-foreground/50">
          Both strategies are made of pieces you can use directly today: vault deposits and lending markets.
          {state.wallet.connected ? ` You have ${usd(state.balances.USDG ?? 0)} USDG ready to deposit.` : ''}
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <Link to="/app/vaults" className="cta-primary rounded-lg px-4 py-2 text-sm font-medium text-background hover:brightness-110">
            Browse vaults
          </Link>
          <Link to="/app/lending" className="rounded-lg border border-foreground/10 px-4 py-2 text-sm text-foreground/70 hover:border-foreground/25 hover:text-foreground">
            See lending markets
          </Link>
        </div>
      </Panel>
    </>
  )
}

export default Strategies
