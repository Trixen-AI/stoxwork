import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router'
import { StockLogo } from '@/components/brand/StockLogo'
import { AmountField } from '@/app/components/AmountField'
import { PageHeader } from '@/app/components/PageHeader'
import { Panel, PanelHeader } from '@/app/components/Panel'
import { Segmented } from '@/app/components/Segmented'
import { StatGrid, StatTile } from '@/app/components/StatTile'
import { TxButton } from '@/app/components/TxButton'
import { useTx } from '@/app/components/useTx'
import { ConnectPrompt } from '@/app/components/Wallet'
import { AreaChart } from '@/app/components/charts/AreaChart'
import { ChartFrame } from '@/app/components/charts/ChartFrame'
import { StackBar } from '@/app/components/charts/StackBar'
import { positionValue } from '@/app/state/model'
import { useStore, validate } from '@/app/state/store'
import { history, lastDays, marketByTicker, RISK, VAULT_CAP } from '@/data/markets'
import { amount, num, parseAmount, pct, shortDate, usd } from '@/lib/format'

const DATES = lastDays(30)

/** A labelled row inside a preview list. */
function Line({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4 text-xs">
      <dt className="text-foreground/45">{label}</dt>
      <dd className="tnum font-mono text-foreground/80">{value}</dd>
    </div>
  )
}

function DepositPanel({ ticker }: { ticker: string }) {
  const { state } = useStore()
  const { run, pending } = useTx()
  const [mode, setMode] = useState<'deposit' | 'withdraw'>('deposit')
  const [raw, setRaw] = useState('')

  const v = state.vaults[ticker]
  const pos = state.positions[ticker] ?? { shares: 0, entryPps: v.pricePerShare }
  const n = parseAmount(raw)
  const usdg = state.balances.USDG ?? 0

  // Deposit takes USDG in; withdraw takes USDG out, converted to shares at the
  // vault's price per share (vault previewDeposit / previewWithdraw).
  const shares = n / v.pricePerShare
  const action =
    mode === 'deposit'
      ? ({ type: 'deposit', ticker, usdg: n } as const)
      : ({ type: 'withdraw', ticker, shares: Math.min(shares, pos.shares) } as const)
  const error = raw ? validate(state, mode === 'deposit' ? action : { type: 'withdraw', ticker, shares }) : null
  const nextShares = mode === 'deposit' ? pos.shares + shares : Math.max(0, pos.shares - shares)

  if (!state.wallet.connected) return <ConnectPrompt what="your position and deposit" />

  return (
    <div className="flex flex-col gap-5 p-5">
      <Segmented
        label="Deposit or withdraw"
        value={mode}
        onChange={(m) => {
          setMode(m)
          setRaw('')
        }}
        options={[
          { value: 'deposit', label: 'Deposit' },
          { value: 'withdraw', label: 'Withdraw' },
        ]}
        className="self-start"
      />

      <AmountField
        label={mode === 'deposit' ? 'You deposit' : 'You withdraw'}
        unit="USDG"
        value={raw}
        onChange={setRaw}
        max={mode === 'deposit' ? Math.min(usdg, VAULT_CAP - v.tvl) : pos.shares * v.pricePerShare}
        maxLabel={mode === 'deposit' ? 'Wallet' : 'Position'}
        error={error}
      />

      <dl className="space-y-2 rounded-lg border border-foreground/[0.06] bg-background/40 p-4">
        <Line label={mode === 'deposit' ? 'Shares received' : 'Shares burned'} value={amount(shares)} />
        <Line label="Price per share" value={`${num(v.pricePerShare, 4)} USDG`} />
        <Line label="Position after" value={`${amount(nextShares)} shares · ${usd(nextShares * v.pricePerShare)}`} />
        <Line label="Fees" value="None to enter or exit" />
      </dl>

      <TxButton
        label={mode === 'deposit' ? `Deposit into ${ticker} vault` : `Withdraw from ${ticker} vault`}
        pending={pending}
        disabled={!n || Boolean(error)}
        onClick={() => {
          run(action, mode === 'deposit' ? `Deposited ${usd(n)} into ${ticker}` : `Withdrew ${usd(n)} from ${ticker}`)
          setRaw('')
        }}
      />

      <p className="text-[11px] leading-relaxed text-foreground/35">
        Pyth price feeds are checked before every deposit. Vault shares are not a stablecoin and are
        not principal-protected.
      </p>
    </div>
  )
}

export function VaultDetail() {
  const { ticker = '' } = useParams()
  const { state } = useStore()
  const meta = marketByTicker.get(ticker.toUpperCase())

  const series = useMemo(() => {
    if (!meta) return null
    return {
      apr: history(`${meta.ticker}-apr`, meta.feeApr, 0.78, 0.07),
      tvlBase: history(`${meta.ticker}-tvl`, 1, 0.55, 0.035),
    }
  }, [meta])

  if (!meta || !series) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm text-foreground/50">There is no vault for “{ticker}”.</p>
        <Link to="/app/vaults" className="mt-4 inline-block text-sm text-brand-bright hover:underline">
          Back to all vaults
        </Link>
      </div>
    )
  }

  const v = state.vaults[meta.ticker]
  // Scale the TVL history so it ends on the live TVL, which moves as people deposit.
  const tvlSeries = series.tvlBase.map((x) => x * v.tvl)
  const pos = state.positions[meta.ticker]
  const mine = pos && pos.shares > 0 ? positionValue(pos, v) : null
  const lending = state.markets[meta.ticker]

  return (
    <>
      <Link to="/app/vaults" className="mb-6 inline-block text-xs text-foreground/45 transition-colors hover:text-foreground">
        ← All vaults
      </Link>

      <PageHeader
        eyebrow={`Vault · ${meta.ticker} / USDG`}
        title={
          <span className="flex items-center gap-3">
            <StockLogo ticker={meta.ticker} />
            {meta.company}
          </span>
        }
        description={`Managed liquidity for the ${meta.ticker} / USDG pool. Swap fees stay in the vault and lift the price per share.`}
        actions={
          <Link
            to={`/app/trade?ticker=${meta.ticker}`}
            className="rounded-lg border border-foreground/10 px-4 py-2 text-sm text-foreground/70 transition-colors hover:border-foreground/25 hover:text-foreground"
          >
            Trade {meta.ticker}
          </Link>
        }
      />

      <StatGrid className="mb-6 grid-cols-2 lg:grid-cols-4">
        <StatTile label="TVL" value={usd(v.tvl)} note={`Cap ${usd(VAULT_CAP)} · ${pct((v.tvl / VAULT_CAP) * 100, 1)} used`} />
        <StatTile label="Est. fee APR" value={pct(meta.feeApr, 1)} tone="brand" note="From observed pool fees, not a forecast" />
        <StatTile label="Price per share" value={num(v.pricePerShare, 4)} note="USDG per vault share" />
        {/* personal figures only once a wallet is connected */}
        <StatTile
          label="Your position"
          value={!state.wallet.connected ? '–' : mine ? usd(mine.value) : usd(0)}
          note={!state.wallet.connected ? 'Connect a wallet' : mine ? `${usd(mine.earned)} earned` : 'No deposit yet'}
        />
      </StatGrid>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="flex min-w-0 flex-col gap-6">
          <Panel className="p-5">
            <ChartFrame
              title="Value locked"
              subtitle="USDG in the vault, last 30 days"
              columns={['Date', 'TVL']}
              rows={DATES.map((d, i) => ({ label: shortDate(d), values: [usd(tvlSeries[i])] })).reverse()}
            >
              <AreaChart dates={DATES} values={tvlSeries} format={(n) => `$${num(n, n < 10 ? 2 : 0)}`} seriesLabel="TVL" />
            </ChartFrame>
          </Panel>

          <Panel className="p-5">
            <ChartFrame
              title="Estimated fee APR"
              subtitle="Annualised from each day's pool fees"
              columns={['Date', 'APR']}
              rows={DATES.map((d, i) => ({ label: shortDate(d), values: [pct(series.apr[i], 1)] })).reverse()}
            >
              <AreaChart dates={DATES} values={series.apr} format={(n) => `${num(n, 0)}%`} seriesLabel="Est. APR" color="var(--chart-1)" />
            </ChartFrame>
          </Panel>

          <Panel>
            <PanelHeader title="Inventory" aside={<span className="text-xs text-foreground/40">What the vault holds</span>} />
            <div className="p-5">
              <StackBar
                format={usd}
                slices={[
                  { label: `${meta.ticker} xStock`, value: v.tvl * (v.stockShare / 100), color: 'var(--chart-1)', detail: pct(v.stockShare, 0) },
                  { label: 'USDG', value: v.tvl * (1 - v.stockShare / 100), color: 'var(--chart-2)', detail: pct(100 - v.stockShare, 0) },
                ]}
              />
              <dl className="mt-5 grid grid-cols-2 gap-4 border-t border-foreground/[0.06] pt-4 sm:grid-cols-3">
                <div>
                  <dt className="text-xs text-foreground/40">Volume 24h</dt>
                  <dd className="tnum mt-1 font-mono text-sm">{usd(v.volume24h)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-foreground/40">Fees, lifetime</dt>
                  <dd className="tnum mt-1 font-mono text-sm">{usd(v.feesLifetime)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-foreground/40">{meta.ticker} price</dt>
                  <dd className="tnum mt-1 font-mono text-sm">{usd(meta.price)}</dd>
                </div>
              </dl>
            </div>
          </Panel>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-20 lg:self-start">
          <Panel>
            <PanelHeader title="Manage position" />
            <DepositPanel ticker={meta.ticker} />
          </Panel>

          {lending ? (
            <Panel className="p-5">
              <p className="text-sm font-medium">Borrow against this vault</p>
              <p className="mt-1 text-xs leading-relaxed text-foreground/45">
                Lock {meta.ticker} vault shares as collateral and borrow USDG up to {pct(RISK.maxLtv * 100, 0)} of their
                value. The shares keep earning while locked.
              </p>
              <Link to={`/app/lending?market=${meta.ticker}`} className="mt-3 inline-block text-sm text-brand-bright hover:underline">
                Open {meta.ticker} lending market →
              </Link>
            </Panel>
          ) : null}
        </div>
      </div>
    </>
  )
}

export default VaultDetail
