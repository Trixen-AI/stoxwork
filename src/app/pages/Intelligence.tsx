import { useMemo } from 'react'
import { Link } from 'react-router'
import { StockLogo } from '@/components/brand/StockLogo'
import { PageHeader } from '@/app/components/PageHeader'
import { Panel, PanelHeader } from '@/app/components/Panel'
import { StatGrid, StatTile } from '@/app/components/StatTile'
import { AreaChart } from '@/app/components/charts/AreaChart'
import { BarChart } from '@/app/components/charts/BarChart'
import { ChartFrame } from '@/app/components/charts/ChartFrame'
import { StackBar } from '@/app/components/charts/StackBar'
import { useStore } from '@/app/state/store'
import { history, lastDays, MARKETS, PROTOCOL } from '@/data/markets'
import { num, pct, shortDate, usd } from '@/lib/format'

const DATES = lastDays(30)
const FEE_DAYS = lastDays(14)

export function Intelligence() {
  const { state } = useStore()
  const vaults = Object.values(state.vaults)
  const tvl = vaults.reduce((s, v) => s + v.tvl, 0)
  const fees = vaults.reduce((s, v) => s + v.feesLifetime, 0)

  // Protocol TVL history: every vault's own 30-day curve, scaled to its live TVL, summed.
  const tvlSeries = useMemo(() => {
    const curves = MARKETS.map((m) => history(`${m.ticker}-tvl`, 1, 0.55, 0.035))
    return DATES.map((_, i) => MARKETS.reduce((s, m, k) => s + curves[k][i] * state.vaults[m.ticker].tvl, 0))
  }, [state.vaults])

  // Daily fees: each vault's TVL x APR / 365, with the same deterministic day-to-day noise.
  const feeSeries = useMemo(() => {
    const daily = MARKETS.reduce((s, m) => s + (state.vaults[m.ticker].tvl * m.feeApr) / 100 / 365, 0)
    return history('protocol-fees', daily, 0.7, 0.18, 14)
  }, [state.vaults])

  const split = PROTOCOL.feeSplit
  const leaders = MARKETS.toSorted((a, b) => b.feeApr - a.feeApr)
  const maxApr = leaders[0].feeApr
  const buybackSpent = (fees * split.buyback) / 100 - PROTOCOL.buybackReserveUsdg

  return (
    <>
      <PageHeader
        eyebrow="Intelligence"
        title="Protocol figures, read from the contracts"
        description="Where the value sits, what it earns, and where every fee goes. Fee APR figures are estimates from observed pool fees, not forecasts."
      />

      <StatGrid className="mb-6 grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total value locked" value={usd(tvl)} note={`${MARKETS.length} xStock vaults`} />
        <StatTile label="Fees earned, lifetime" value={usd(fees)} tone="brand" note="Gross, before the protocol split" />
        <StatTile label="EQY burned" value={num(PROTOCOL.eqyBurned, 1)} note={`${usd(buybackSpent)} of fees spent on buybacks`} />
        <StatTile label="Buyback reserve" value={usd(PROTOCOL.buybackReserveUsdg)} note="USDG waiting for the next buyback" />
      </StatGrid>

      <div className="grid gap-6 lg:grid-cols-2">
        <Panel className="p-5">
          <ChartFrame
            title="Total value locked"
            subtitle="All vaults, last 30 days"
            columns={['Date', 'TVL']}
            rows={DATES.map((d, i) => ({ label: shortDate(d), values: [usd(tvlSeries[i])] })).reverse()}
          >
            <AreaChart dates={DATES} values={tvlSeries} format={(n) => `$${num(n, 0)}`} seriesLabel="TVL" />
          </ChartFrame>
        </Panel>

        <Panel className="p-5">
          <ChartFrame
            title="Fees per day"
            subtitle="Gross swap fees across all vaults, last 14 days"
            columns={['Date', 'Fees']}
            rows={FEE_DAYS.map((d, i) => ({ label: shortDate(d), values: [usd(feeSeries[i])] })).reverse()}
          >
            <BarChart
              labels={FEE_DAYS.map(shortDate)}
              values={feeSeries}
              format={(n) => `$${num(n, 2)}`}
              seriesLabel="Fees"
              tickEvery={4}
            />
          </ChartFrame>
        </Panel>
      </div>

      <Panel className="mt-6">
        <PanelHeader title="Where every fee goes" aside={<span className="text-xs text-foreground/40">Of {usd(fees)} claimed so far</span>} />
        <div className="p-5">
          <StackBar
            format={usd}
            slices={[
              { label: `Compounds for depositors · ${split.compound}%`, value: (fees * split.compound) / 100, color: 'var(--chart-1)' },
              { label: `Protocol operations · ${split.operations}%`, value: (fees * split.operations) / 100, color: 'var(--chart-neutral)' },
              { label: `EQY buyback and burn · ${split.buyback}%`, value: (fees * split.buyback) / 100, color: 'var(--chart-2)' },
            ]}
          />
          <p className="mt-4 text-xs text-foreground/40">
            No deposit, withdrawal or management fee. Buyback funds stay in USDG inside the reserve contract until a buyback
            swaps them for EQY and burns it.
          </p>
        </div>
      </Panel>

      <Panel className="mt-6">
        <PanelHeader title="Vaults by estimated fee APR" />
        <ul>
          {leaders.map((m) => (
            <li key={m.ticker}>
              <Link
                to={`/app/vaults/${m.ticker}`}
                className="flex items-center gap-3 border-b border-foreground/[0.04] px-5 py-3 transition-colors last:border-0 hover:bg-foreground/[0.02]"
              >
                <StockLogo ticker={m.ticker} size="sm" />
                <span className="w-14 text-sm font-medium">{m.ticker}</span>
                <span className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.06]">
                  <span className="block h-full rounded-full" style={{ width: `${(m.feeApr / maxApr) * 100}%`, background: 'var(--chart-1)' }} />
                </span>
                <span className="tnum w-14 text-right font-mono text-xs text-foreground/75">{pct(m.feeApr, 1)}</span>
                <span className="tnum hidden w-20 text-right font-mono text-xs text-foreground/45 sm:inline">{usd(state.vaults[m.ticker].tvl)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </Panel>
    </>
  )
}

export default Intelligence
