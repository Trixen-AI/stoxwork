import { useState } from 'react'
import { Link, useSearchParams } from 'react-router'
import { StockLogo } from '@/components/brand/StockLogo'
import { AmountField } from '@/app/components/AmountField'
import { HealthMeter } from '@/app/components/HealthMeter'
import { PageHeader } from '@/app/components/PageHeader'
import { Panel, PanelHeader } from '@/app/components/Panel'
import { Segmented } from '@/app/components/Segmented'
import { StatGrid, StatTile } from '@/app/components/StatTile'
import { TxButton } from '@/app/components/TxButton'
import { useTx } from '@/app/components/useTx'
import { ConnectPrompt } from '@/app/components/Wallet'
import { available, borrowApr, collateralValue, healthFactor, maxBorrow, supplyApy, utilisation } from '@/app/state/model'
import { loanOf, useStore, validate, type TxAction } from '@/app/state/store'
import { marketByTicker, RISK } from '@/data/markets'
import { amount, num, parseAmount, pct, usd } from '@/lib/format'
import { cn } from '@/lib/cn'

type Side = 'lend' | 'borrow'
type Op = 'supply' | 'withdrawSupply' | 'lock' | 'unlock' | 'borrow' | 'repay'

const OPS: Record<Side, Array<{ value: Op; label: string }>> = {
  lend: [
    { value: 'supply', label: 'Supply' },
    { value: 'withdrawSupply', label: 'Withdraw' },
  ],
  borrow: [
    { value: 'lock', label: 'Lock' },
    { value: 'unlock', label: 'Unlock' },
    { value: 'borrow', label: 'Borrow' },
    { value: 'repay', label: 'Repay' },
  ],
}

function ActionPanel({ ticker }: { ticker: string }) {
  const { state } = useStore()
  const { run, pending } = useTx()
  const [side, setSide] = useState<Side>('lend')
  const [op, setOp] = useState<Op>('supply')
  const [raw, setRaw] = useState('')

  if (!state.wallet.connected) return <ConnectPrompt what="your lending position" />

  const v = state.vaults[ticker]
  const m = state.markets[ticker]
  const loan = loanOf(state, ticker)
  const n = parseAmount(raw)
  const freeShares = state.positions[ticker]?.shares ?? 0
  const usdg = state.balances.USDG ?? 0

  // Lock and unlock move vault shares; everything else moves USDG.
  const inShares = op === 'lock' || op === 'unlock'
  const action: TxAction =
    op === 'lock' || op === 'unlock' ? { type: op, ticker, shares: n } : { type: op, ticker, usdg: n }
  const error = raw ? validate(state, action) : null

  const max: Record<Op, number> = {
    supply: usdg,
    withdrawSupply: Math.min(loan.supplied, available(m)),
    lock: freeShares,
    unlock: loan.collateralShares,
    borrow: Math.max(0, Math.min(maxBorrow(loan, v) - loan.borrowed, available(m))),
    repay: Math.min(loan.borrowed, usdg),
  }

  // Health factor after this action, so the risk is visible before signing.
  const after = { ...loan }
  if (op === 'lock') after.collateralShares += n
  if (op === 'unlock') after.collateralShares -= n
  if (op === 'borrow') after.borrowed += n
  if (op === 'repay') after.borrowed -= n
  const hfNow = healthFactor(loan, v)
  const hfAfter = healthFactor(after, v)

  const verbs: Record<Op, string> = {
    supply: `Supply USDG to ${ticker} market`,
    withdrawSupply: 'Withdraw supplied USDG',
    lock: `Lock ${ticker} vault shares`,
    unlock: `Unlock ${ticker} vault shares`,
    borrow: 'Borrow USDG',
    repay: 'Repay USDG',
  }

  return (
    <div className="flex flex-col gap-5 p-5">
      <Segmented
        label="Lend or borrow"
        value={side}
        onChange={(s) => {
          setSide(s)
          setOp(OPS[s][0].value)
          setRaw('')
        }}
        options={[
          { value: 'lend', label: 'Lend USDG' },
          { value: 'borrow', label: 'Borrow USDG' },
        ]}
      />
      <Segmented
        label="Action"
        value={op}
        onChange={(o) => {
          setOp(o)
          setRaw('')
        }}
        options={OPS[side]}
        className="self-start"
      />

      <AmountField
        label={verbs[op]}
        unit={inShares ? 'shares' : 'USDG'}
        value={raw}
        onChange={setRaw}
        max={max[op]}
        maxLabel={op === 'lock' ? 'Free shares' : op === 'unlock' ? 'Locked' : op === 'borrow' ? 'Can borrow' : op === 'repay' ? 'Owed' : 'Available'}
        error={error}
      />

      <dl className="space-y-2 rounded-lg border border-foreground/[0.06] bg-background/40 p-4 text-xs">
        {side === 'lend' ? (
          <>
            <div className="flex justify-between">
              <dt className="text-foreground/45">Supply APY</dt>
              <dd className="tnum font-mono text-brand-bright">{pct(supplyApy(m), 2)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-foreground/45">You supply after</dt>
              <dd className="tnum font-mono text-foreground/80">
                {usd(op === 'supply' ? loan.supplied + n : Math.max(0, loan.supplied - n))}
              </dd>
            </div>
          </>
        ) : (
          <>
            <div className="flex justify-between">
              <dt className="text-foreground/45">Collateral after</dt>
              <dd className="tnum font-mono text-foreground/80">{usd(collateralValue(after, v))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-foreground/45">Debt after</dt>
              <dd className="tnum font-mono text-foreground/80">{usd(Math.max(0, after.borrowed))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-foreground/45">Borrow APR</dt>
              <dd className="tnum font-mono text-ink-blue">{pct(borrowApr(m), 2)}</dd>
            </div>
            <div className="pt-2">
              <dt className="mb-1.5 text-foreground/45">
                Health factor {Number.isFinite(hfNow) ? `${num(hfNow, 2)} →` : ''}
              </dt>
              <dd>
                <HealthMeter value={hfAfter} />
              </dd>
            </div>
          </>
        )}
      </dl>

      <TxButton
        label={verbs[op]}
        pending={pending}
        disabled={!n || Boolean(error)}
        onClick={() => {
          run(action, `${verbs[op]}: ${inShares ? `${amount(n)} shares` : usd(n)}`)
          setRaw('')
        }}
      />

      {side === 'borrow' && freeShares <= 0 && loan.collateralShares <= 0 ? (
        <p className="text-xs text-foreground/45">
          You hold no {ticker} vault shares to lock.{' '}
          <Link to={`/app/vaults/${ticker}`} className="text-brand-bright hover:underline">
            Deposit into the {ticker} vault
          </Link>{' '}
          first.
        </p>
      ) : null}
    </div>
  )
}

export function Lending() {
  const { state } = useStore()
  const [params, setParams] = useSearchParams()
  const tickers = Object.keys(state.markets)
  const selected = tickers.includes(params.get('market') ?? '') ? (params.get('market') as string) : tickers[0]

  const totals = tickers.reduce(
    (t, k) => ({ supplied: t.supplied + state.markets[k].supplied, borrowed: t.borrowed + state.markets[k].borrowed }),
    { supplied: 0, borrowed: 0 },
  )
  const m = state.markets[selected]
  const loan = loanOf(state, selected)
  const v = state.vaults[selected]

  return (
    <>
      <PageHeader
        eyebrow="Lending"
        title="Borrow USDG while your vault position keeps earning"
        description="Supply USDG and collect interest from borrowers, or lock eligible vault shares and borrow against them. Each market keeps its own cash and its own losses."
      />

      <StatGrid className="mb-6 grid-cols-2 lg:grid-cols-4">
        <StatTile label="Total supplied" value={usd(totals.supplied)} note={`${tickers.length} isolated markets`} />
        <StatTile label="Total borrowed" value={usd(totals.borrowed)} tone="blue" />
        <StatTile label="Utilisation" value={pct((totals.borrowed / totals.supplied) * 100, 1)} note={`${usd(totals.supplied - totals.borrowed)} available`} />
        <StatTile label="Borrow limit" value={pct(RISK.maxLtv * 100, 0)} note={`Liquidation at ${pct(RISK.liquidationThreshold * 100, 0)} of collateral`} />
      </StatGrid>

      <Panel className="mb-6">
        <PanelHeader title="Markets" aside={<span className="text-xs text-foreground/40">Vault shares → USDG</span>} />
        <div className="relative overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-foreground/[0.06] text-left font-mono text-[10px] tracking-[0.14em] text-foreground/40 uppercase">
                <th scope="col" className="px-5 py-3 font-medium">Collateral</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Supplied</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Utilisation</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Supply APY</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Borrow APR</th>
                <th scope="col" className="px-5 py-3 text-right font-medium">Oracle</th>
              </tr>
            </thead>
            <tbody>
              {tickers.map((t) => {
                const mk = state.markets[t]
                const u = utilisation(mk)
                return (
                  <tr
                    key={t}
                    onClick={() => setParams({ market: t })}
                    aria-selected={t === selected}
                    className={cn(
                      'cursor-pointer border-b border-foreground/[0.04] transition-colors last:border-0',
                      t === selected ? 'bg-foreground/[0.04]' : 'hover:bg-foreground/[0.02]',
                    )}
                  >
                    <td className="px-5 py-3">
                      <button type="button" onClick={() => setParams({ market: t })} className="flex cursor-pointer items-center gap-3">
                        <StockLogo ticker={t} size="sm" />
                        <span className="font-medium">{t} vault shares</span>
                      </button>
                    </td>
                    <td className="tnum px-5 py-3 text-right font-mono text-foreground/80">{usd(mk.supplied)}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="inline-flex items-center gap-2">
                        <span className="h-1 w-12 overflow-hidden rounded-full bg-foreground/[0.08]">
                          <span className="block h-full rounded-full bg-brand-bright/70" style={{ width: `${u * 100}%` }} />
                        </span>
                        <span className="tnum font-mono text-xs text-foreground/70">{pct(u * 100, 0)}</span>
                      </span>
                    </td>
                    <td className="tnum px-5 py-3 text-right font-mono text-brand-bright/90">{pct(supplyApy(mk), 2)}</td>
                    <td className="tnum px-5 py-3 text-right font-mono text-ink-blue">{pct(borrowApr(mk), 2)}</td>
                    <td className="px-5 py-3 text-right">
                      <span className="inline-flex items-center gap-1.5 text-xs text-foreground/50">
                        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-brand-bright/80" />
                        Pyth · fresh
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Panel>

      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <Panel>
          <PanelHeader
            title={
              <span className="flex items-center gap-2">
                {selected} market · {marketByTicker.get(selected)?.company}
              </span>
            }
            aside={
              <Link to={`/app/vaults/${selected}`} className="text-xs text-foreground/50 hover:text-foreground">
                {selected} vault →
              </Link>
            }
          />
          <div className="grid gap-px bg-foreground/[0.06] sm:grid-cols-2">
            <StatTile label="Lenders earn" value={pct(supplyApy(m), 2)} tone="brand" note="APY, from borrower interest" />
            <StatTile label="Borrowers pay" value={pct(borrowApr(m), 2)} tone="blue" note="APR, rises with utilisation" />
            <StatTile label="Available to borrow" value={usd(available(m))} note={`${pct(utilisation(m) * 100, 1)} utilised`} />
            <StatTile label="Collateral price" value={`${num(v.pricePerShare, 4)}`} note="USDG per vault share, priced onchain" />
          </div>

          <div className="border-t border-foreground/[0.07] p-5">
            <p className="mb-4 font-mono text-[10px] tracking-[0.14em] text-foreground/40 uppercase">Your position</p>
            {state.wallet.connected ? (
              <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div>
                  <dt className="text-xs text-foreground/40">Supplied</dt>
                  <dd className="tnum mt-1 font-mono text-sm">{usd(loan.supplied)}</dd>
                </div>
                <div>
                  <dt className="text-xs text-foreground/40">Collateral</dt>
                  <dd className="tnum mt-1 font-mono text-sm">{usd(collateralValue(loan, v))}</dd>
                  <dd className="tnum font-mono text-[11px] text-foreground/35">{amount(loan.collateralShares)} shares</dd>
                </div>
                <div>
                  <dt className="text-xs text-foreground/40">Borrowed</dt>
                  <dd className="tnum mt-1 font-mono text-sm">{usd(loan.borrowed)}</dd>
                  <dd className="tnum font-mono text-[11px] text-foreground/35">limit {usd(maxBorrow(loan, v))}</dd>
                </div>
                <div>
                  <dt className="text-xs text-foreground/40">Health</dt>
                  <dd className="mt-1">
                    <HealthMeter value={healthFactor(loan, v)} compact />
                  </dd>
                </div>
              </dl>
            ) : (
              <p className="text-sm text-foreground/45">Connect a wallet to see your position.</p>
            )}
          </div>
        </Panel>

        <div className="lg:sticky lg:top-20 lg:self-start">
          <Panel>
            <PanelHeader title="Lend or borrow" />
            {/* keyed by market, so switching markets resets the form */}
            <ActionPanel key={selected} ticker={selected} />
          </Panel>
        </div>
      </div>
    </>
  )
}

export default Lending
