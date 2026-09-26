import { Link } from 'react-router'
import { StockLogo } from '@/components/brand/StockLogo'
import { HealthMeter } from '@/app/components/HealthMeter'
import { PageHeader } from '@/app/components/PageHeader'
import { Panel, PanelHeader } from '@/app/components/Panel'
import { StatGrid, StatTile } from '@/app/components/StatTile'
import { ConnectPrompt } from '@/app/components/Wallet'
import { ActivityList } from '@/app/pages/Activity'
import { collateralValue, healthFactor, positionValue } from '@/app/state/model'
import { useStore } from '@/app/state/store'
import { marketByTicker } from '@/data/markets'
import { EXPLORER, STOCK_TOKENS } from '@/data/tokens'
import { amount, pct, usd } from '@/lib/format'

export function Portfolio() {
  const { state } = useStore()
  const connected = state.wallet.connected
  const b = state.balances
  const reading = state.balancesStatus === 'loading' || state.balancesStatus === 'idle'

  // EquiYield positions are read from the vault and lending contracts; until those are
  // deployed these lists are empty, and the page says so rather than inventing any.
  const positions = Object.entries(state.positions)
    .filter(([, p]) => p.shares > 1e-9)
    .map(([ticker, p]) => ({ ticker, shares: p.shares, ...positionValue(p, state.vaults[ticker]), apr: marketByTicker.get(ticker)!.feeApr }))
  const loans = Object.entries(state.loans)
    .filter(([, l]) => l.supplied > 0 || l.collateralShares > 0 || l.borrowed > 0)
    .map(([ticker, l]) => ({ ticker, ...l, collateral: collateralValue(l, state.vaults[ticker]), hf: healthFactor(l, state.vaults[ticker]) }))

  const stocks = Object.keys(STOCK_TOKENS)
    .map((t) => ({ ticker: t, amount: b[t] ?? 0 }))
    .filter((s) => s.amount > 0)

  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="Your USDG at work"
        description="Vault positions compound inside the vault, so there is nothing to claim. Lending positions keep their own collateral and health per market."
        actions={
          <Link to="/app/vaults" className="cta-primary rounded-lg px-4 py-2 text-sm font-medium text-background transition-all hover:brightness-110">
            Deposit
          </Link>
        }
      />

      {connected ? (
        <div className="flex flex-col gap-6">
          {/* one hero figure per view: the USDG this wallet can put to work */}
          <Panel className="p-6">
            <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-foreground/40 uppercase">USDG available to deposit</p>
            <p className="mt-2 text-5xl font-semibold tracking-tight">{reading ? '…' : usd(b.USDG ?? 0)}</p>
            <p className="mt-2 text-sm text-foreground/45">
              {state.balancesStatus === 'error'
                ? 'Could not reach Solana. Retrying in the background.'
                : 'Read live from your wallet on Solana.'}
            </p>
          </Panel>

          <StatGrid className="grid-cols-2 lg:grid-cols-4">
            <StatTile label="SOL for fees" value={reading ? '…' : amount(b.SOL ?? 0)} note="Solana pays fees in SOL" />
            <StatTile label="xStocks held" value={reading ? '…' : String(stocks.length)} note="Canonical xStocks" />
            <StatTile label="In EquiYield vaults" value={usd(positions.reduce((s, p) => s + p.value, 0))} note="Opens when vaults deploy" />
            <StatTile label="Borrowed" value={usd(loans.reduce((s, l) => s + l.borrowed, 0))} tone="blue" note="No open loans" />
          </StatGrid>

          <Panel>
            <PanelHeader
              title="xStocks in your wallet"
              aside={
                <a href={`${EXPLORER}/address/${state.wallet.address}`} target="_blank" rel="noopener noreferrer" className="text-xs text-foreground/50 hover:text-foreground">
                  Solscan ↗
                </a>
              }
            />
            {reading ? (
              <p className="px-5 py-10 text-center text-sm text-foreground/40">Reading balances…</p>
            ) : stocks.length ? (
              <ul>
                {stocks.map((s) => (
                  <li key={s.ticker} className="flex items-center gap-3 border-b border-foreground/[0.04] px-5 py-3 last:border-0">
                    <StockLogo ticker={s.ticker} size="sm" />
                    <span className="flex-1">
                      <span className="block text-sm font-medium">{s.ticker}</span>
                      <span className="block text-xs text-foreground/40">{marketByTicker.get(s.ticker)?.company}</span>
                    </span>
                    <span className="tnum font-mono text-sm">{amount(s.amount)}</span>
                    <Link to={`/app/vaults/${s.ticker}`} className="ml-2 text-xs text-foreground/50 hover:text-brand-bright">
                      Vault →
                    </Link>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-10 text-center text-sm text-foreground/45">This wallet holds no xStocks.</p>
            )}
          </Panel>

          <Panel>
            <PanelHeader title="Vault positions" aside={<Link to="/app/vaults" className="text-xs text-foreground/50 hover:text-foreground">All vaults →</Link>} />
            {positions.length ? (
              <ul>
                {positions.map((p) => (
                  <li key={p.ticker} className="flex items-center gap-3 border-b border-foreground/[0.04] px-5 py-3 last:border-0">
                    <StockLogo ticker={p.ticker} size="sm" />
                    <span className="flex-1 text-sm font-medium">{p.ticker}</span>
                    <span className="tnum font-mono text-sm">{usd(p.value)}</span>
                    <span className="tnum w-16 text-right font-mono text-xs text-brand-bright/90">{pct(p.apr, 1)}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="px-5 py-10 text-center text-sm text-foreground/45">
                No vault positions yet. <Link to="/app/vaults" className="text-brand-bright hover:underline">Pick a vault</Link> to start.
              </p>
            )}
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel>
              <PanelHeader title="Lending" aside={<Link to="/app/lending" className="text-xs text-foreground/50 hover:text-foreground">Markets →</Link>} />
              {loans.length ? (
                <ul>
                  {loans.map((l) => (
                    <li key={l.ticker} className="border-b border-foreground/[0.04] px-5 py-4 last:border-0">
                      <p className="text-sm font-medium">{l.ticker} market</p>
                      <div className="mt-2">
                        <HealthMeter value={l.hf} />
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="px-5 py-10 text-center text-sm text-foreground/45">No lending positions.</p>
              )}
            </Panel>

            <Panel>
              <PanelHeader title="Recent activity" aside={<Link to="/app/activity" className="text-xs text-foreground/50 hover:text-foreground">All activity →</Link>} />
              <ActivityList items={state.activity.slice(0, 5)} />
            </Panel>
          </div>
        </div>
      ) : (
        <Panel>
          <ConnectPrompt what="your balances and positions" />
        </Panel>
      )}
    </>
  )
}

export default Portfolio
