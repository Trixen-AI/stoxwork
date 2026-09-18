import { useState } from 'react'
import { StockLogo } from '@/components/brand/StockLogo'
import { PageHeader } from '@/app/components/PageHeader'
import { Panel } from '@/app/components/Panel'
import { Segmented } from '@/app/components/Segmented'
import { ConnectPrompt } from '@/app/components/Wallet'
import type { Activity as Tx, ActivityKind } from '@/app/state/model'
import { useStore } from '@/app/state/store'
import { EXPLORER } from '@/data/tokens'
import { timeAgo, usd } from '@/lib/format'

const KIND_LABEL: Record<ActivityKind, string> = {
  deposit: 'Deposit',
  withdraw: 'Withdraw',
  supply: 'Supply',
  withdrawSupply: 'Withdraw supply',
  lock: 'Lock collateral',
  unlock: 'Unlock collateral',
  borrow: 'Borrow',
  repay: 'Repay',
  swap: 'Swap',
}

type Filter = 'all' | 'vaults' | 'lending' | 'trade'
const GROUP: Record<ActivityKind, Filter> = {
  deposit: 'vaults',
  withdraw: 'vaults',
  supply: 'lending',
  withdrawSupply: 'lending',
  lock: 'lending',
  unlock: 'lending',
  borrow: 'lending',
  repay: 'lending',
  swap: 'trade',
}

export function ActivityList({ items }: { items: Tx[] }) {
  if (!items.length) {
    return <p className="px-5 py-10 text-center text-sm text-foreground/45">No StoxWork transactions from this wallet yet.</p>
  }
  return (
    <ul>
      {items.map((a) => (
        <li key={a.id} className="flex items-center gap-3 border-b border-foreground/[0.04] px-5 py-3.5 last:border-0">
          <StockLogo ticker={a.ticker} size="sm" />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm">
              <span className="font-medium">{KIND_LABEL[a.kind]}</span>
              <span className="text-foreground/45"> · {a.detail}</span>
            </p>
            <p className="mt-0.5 font-mono text-[11px] text-foreground/35">
              {timeAgo(a.at)} · {a.hash}
            </p>
          </div>
          <span className="tnum flex-shrink-0 font-mono text-sm text-foreground/80">{usd(a.amount)}</span>
        </li>
      ))}
    </ul>
  )
}

export function Activity() {
  const { state } = useStore()
  const [filter, setFilter] = useState<Filter>('all')
  const items = filter === 'all' ? state.activity : state.activity.filter((a) => GROUP[a.kind] === filter)

  return (
    <>
      <PageHeader
        eyebrow="Activity"
        title="Transaction history"
        description="Every StoxWork deposit, loan and swap from this wallet, newest first."
        actions={
          state.wallet.connected ? (
            <a
              href={`${EXPLORER}/address/${state.wallet.address}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-foreground/10 px-4 py-2 text-sm text-foreground/70 transition-colors hover:border-foreground/25 hover:text-foreground"
            >
              All wallet activity ↗
            </a>
          ) : undefined
        }
      />
      {state.wallet.connected ? (
        <>
          <Segmented
            className="mb-4"
            label="Filter activity"
            value={filter}
            onChange={setFilter}
            options={[
              { value: 'all', label: 'All' },
              { value: 'vaults', label: 'Vaults' },
              { value: 'lending', label: 'Lending' },
              { value: 'trade', label: 'Trade' },
            ]}
          />
          <Panel>
            <ActivityList items={items} />
          </Panel>
        </>
      ) : (
        <Panel>
          <ConnectPrompt what="your transaction history" />
        </Panel>
      )}
    </>
  )
}

export default Activity
