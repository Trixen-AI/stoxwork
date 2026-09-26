import { useAppKit, useAppKitAccount, useAppKitNetwork, useDisconnect } from '@reown/appkit/react'
import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useRef, useState } from 'react'
import { useStore } from '@/app/state/store'
import { walletEnabled } from '@/app/wallet/config'
import { explorerAddress } from '@/data/tokens'
import { amount, shortAddr } from '@/lib/format'
import { cn } from '@/lib/cn'

/* ---- setup notice (no project ID) ------------------------------------------ */

function MissingProjectId({ block }: { block?: boolean }) {
  return (
    <span
      title="Add VITE_REOWN_PROJECT_ID to .env and restart the dev server"
      className={cn(
        'inline-flex items-center gap-2 rounded-full border border-ink-rose/30 bg-ink-rose/10 px-3 py-1.5 font-mono text-[10px] tracking-wider text-ink-rose uppercase',
        block && 'rounded-lg px-4 py-2',
      )}
    >
      Wallet not configured
    </span>
  )
}

/* ---- connect ---------------------------------------------------------------- */

function ReownConnectButton({ className, label = 'Connect wallet' }: { className?: string; label?: string }) {
  const { open } = useAppKit()
  return (
    <button type="button" onClick={() => open({ view: 'Connect' })} className={className}>
      {label}
    </button>
  )
}

/* ---- connected account ------------------------------------------------------ */

/** The connected wallet's real holdings: SOL for fees, USDG, then any xStocks held. */
export function WalletBalances() {
  const { state } = useStore()
  if (state.balancesStatus === 'loading' || state.balancesStatus === 'idle') {
    return <p className="mt-2 text-sm text-foreground/40">Reading balances…</p>
  }
  if (state.balancesStatus === 'error') {
    return <p className="mt-2 text-sm text-ink-rose">Could not reach Solana. Retrying.</p>
  }
  const b = state.balances
  const stocks = Object.entries(b).filter(([k, v]) => k !== 'SOL' && k !== 'USDG' && v > 0)
  return (
    <dl className="mt-2 space-y-1.5 text-sm">
      {[['SOL', b.SOL ?? 0] as const, ['USDG', b.USDG ?? 0] as const, ...stocks].map(([k, v]) => (
        <div key={k} className="flex justify-between">
          <dt className="text-foreground/55">{k}</dt>
          <dd className="tnum font-mono">{amount(v)}</dd>
        </div>
      ))}
    </dl>
  )
}

function AccountMenu() {
  const { state } = useStore()
  const { address } = useAppKitAccount()
  const { open } = useAppKit()
  const { disconnect } = useDisconnect()
  const [menu, setMenu] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menu) return
    const onDown = (e: PointerEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setMenu(false)
    }
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setMenu(false)
    document.addEventListener('pointerdown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('pointerdown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [menu])

  const item = 'block w-full cursor-pointer rounded-lg px-3 py-2 text-left text-sm text-foreground/60 transition-colors hover:bg-foreground/[0.06] hover:text-foreground'

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setMenu((v) => !v)}
        aria-expanded={menu}
        className="flex cursor-pointer items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.04] py-1.5 pr-3 pl-2 text-sm transition-colors hover:border-foreground/20"
      >
        <span aria-hidden="true" className="h-5 w-5 rounded-full bg-gradient-to-br from-brand-bright to-ink-blue" />
        <span className="font-mono text-xs">{address ? shortAddr(address) : 'Connected'}</span>
      </button>

      <AnimatePresence>
        {menu && (
          <motion.div
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 z-50 mt-2 w-72 rounded-xl border border-foreground/10 bg-background/95 p-2 shadow-xl shadow-black/30 backdrop-blur-xl"
          >
            <div className="px-3 py-2">
              <p className="font-mono text-[10px] tracking-[0.14em] text-foreground/40 uppercase">Wallet balances</p>
              <p className="mt-1 text-[11px] leading-relaxed text-foreground/35">Read live from Solana.</p>
              <WalletBalances />
            </div>
            <div className="my-1 h-px bg-foreground/[0.07]" />
            <button
              type="button"
              className={item}
              onClick={() => {
                setMenu(false)
                open({ view: 'Account' })
              }}
            >
              Wallet & network
            </button>
            <a
              href={explorerAddress(state.wallet.address)}
              target="_blank"
              rel="noopener noreferrer"
              className={item}
              onClick={() => setMenu(false)}
            >
              View on Solscan ↗
            </a>
            <button
              type="button"
              className={item}
              onClick={() => {
                setMenu(false)
                void disconnect()
              }}
            >
              Disconnect
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function ReownWalletButton() {
  const { isConnected } = useAppKitAccount()
  return isConnected ? (
    <AccountMenu />
  ) : (
    <ReownConnectButton className="cursor-pointer rounded-full bg-foreground px-4 py-1.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90" />
  )
}

export function WalletButton() {
  return walletEnabled ? <ReownWalletButton /> : <MissingProjectId />
}

/* ---- network ---------------------------------------------------------------- */

function ReownNetworkChip() {
  const { caipNetwork } = useAppKitNetwork()
  const { open } = useAppKit()
  const { isConnected } = useAppKitAccount()
  return (
    <button
      type="button"
      onClick={() => open({ view: 'Networks' })}
      className="hidden cursor-pointer items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1.5 font-mono text-[10px] tracking-wider text-foreground/55 uppercase transition-colors hover:border-foreground/20 sm:inline-flex"
    >
      <span aria-hidden="true" className={cn('h-1.5 w-1.5 rounded-full', isConnected ? 'animate-pulse bg-brand-bright/80' : 'bg-foreground/30')} />
      {caipNetwork?.name ?? 'Solana'}
    </button>
  )
}

export function NetworkChip() {
  return walletEnabled ? (
    <ReownNetworkChip />
  ) : (
    <span className="hidden items-center gap-2 rounded-full border border-foreground/10 bg-foreground/[0.03] px-3 py-1.5 font-mono text-[10px] tracking-wider text-foreground/55 uppercase sm:inline-flex">
      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-foreground/30" />
      Solana
    </span>
  )
}

/* ---- gate ------------------------------------------------------------------- */

/**
 * Shown in place of personal data until a wallet is connected. Deliberately has no
 * button of its own: the header holds the one Connect wallet control, so there is
 * never more than one on screen.
 */
export function ConnectPrompt({ what }: { what: string }) {
  return (
    <div className="flex flex-col items-center gap-2 px-6 py-12 text-center">
      <svg viewBox="0 0 20 20" className="h-5 w-5 text-foreground/30" aria-hidden="true">
        <path d="M3.5 6.5h13v9h-13zM3.5 6.5l2-3h9l2 3M12.5 11h1.5" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="text-sm text-foreground/55">Connect your wallet to see {what}.</p>
      <p className="text-xs text-foreground/35">
        {walletEnabled ? (
          <>Use <span className="text-foreground/60">Connect wallet</span> at the top right.</>
        ) : (
          <>
            Add <code className="font-mono text-foreground/60">VITE_REOWN_PROJECT_ID</code> to{' '}
            <code className="font-mono text-foreground/60">.env</code> and restart the dev server.
          </>
        )}
      </p>
    </div>
  )
}
