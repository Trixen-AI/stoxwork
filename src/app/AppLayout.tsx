import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState, type ReactNode } from 'react'
import { Link, NavLink, Outlet, useLocation } from 'react-router'
import { Logo } from '@/components/brand/Logo'
import { ToastProvider } from '@/app/components/Toasts'
import { NetworkChip, WalletButton } from '@/app/components/Wallet'
import { StoreProvider } from '@/app/state/store'
import { WalletProviders } from '@/app/wallet/WalletProviders'
import { cn } from '@/lib/cn'

/* ---- navigation ------------------------------------------------------------- */

type Item = { to: string; label: string; icon: ReactNode; end?: boolean }

const stroke = { fill: 'none', stroke: 'currentColor', strokeWidth: 1.5, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const }
const I = ({ d }: { d: string }) => (
  <svg viewBox="0 0 20 20" className="h-4 w-4 flex-shrink-0" aria-hidden="true">
    <path d={d} {...stroke} />
  </svg>
)

// Order follows the user's path: see what I hold, put USDG to work, borrow, trade,
// then the read-only views.
const GROUPS: Array<{ title: string; items: Item[] }> = [
  {
    title: 'Account',
    items: [
      { to: '/app', label: 'Portfolio', end: true, icon: <I d="M3 16.5h14M5 13V9m4 4V5m4 8v-6m4 6V7" /> },
      { to: '/app/activity', label: 'Activity', icon: <I d="M3 10h3l2-5 4 10 2-5h3" /> },
    ],
  },
  {
    title: 'Products',
    items: [
      { to: '/app/vaults', label: 'Vaults', icon: <I d="M4 4.5h12v11H4zM10 8v4m-2-2h4" /> },
      { to: '/app/lending', label: 'Lending', icon: <I d="M3.5 8.5 10 4l6.5 4.5M5 8.5V15m10-6.5V15M3 15.5h14M8 10.5v3m4-3v3" /> },
      { to: '/app/trade', label: 'Trade', icon: <I d="M4 7h11l-3-3M16 13H5l3 3" /> },
      { to: '/app/strategies', label: 'Strategies', icon: <I d="M10 3.5v13M4 7.5l6-4 6 4M4 12.5l6 4 6-4" /> },
    ],
  },
  {
    title: 'Protocol',
    items: [{ to: '/app/intelligence', label: 'Intelligence', icon: <I d="M3.5 16.5V9m4.3 7.5V4.5m4.4 12V7.5m4.3 9V11" /> }],
  },
]

function NavList({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <nav aria-label="Dashboard" className="flex flex-col gap-6">
      {GROUPS.map((g) => (
        <div key={g.title}>
          <p className="mb-2 px-3 font-mono text-[10px] tracking-[0.14em] text-foreground/30 uppercase">{g.title}</p>
          <ul className="flex flex-col gap-0.5">
            {g.items.map((it) => (
              <li key={it.to}>
                <NavLink
                  to={it.to}
                  end={it.end}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm transition-colors',
                      isActive ? 'bg-foreground/[0.07] text-foreground' : 'text-foreground/55 hover:bg-foreground/[0.04] hover:text-foreground',
                    )
                  }
                >
                  {({ isActive }) => (
                    <>
                      <span className={isActive ? 'text-gold-bright' : ''}>{it.icon}</span>
                      {it.label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  )
}

/* ---- shell ------------------------------------------------------------------- */

export function AppLayout() {
  const [drawer, setDrawer] = useState(false)
  const { pathname } = useLocation()

  // A new page starts at the top, the way a real navigation does.
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' })
  }, [pathname])

  useEffect(() => {
    if (!drawer) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setDrawer(false)
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [drawer])

  return (
    <StoreProvider>
      <WalletProviders>
      <ToastProvider>
        <div className="min-h-dvh bg-background">
          {/* sidebar, desktop */}
          <aside className="fixed inset-y-0 left-0 z-30 hidden w-60 flex-col border-r border-foreground/[0.06] bg-background px-3 py-5 lg:flex">
            <Link to="/" className="mb-8 px-3" aria-label="StoxWork home">
              <Logo className="h-5 w-auto text-foreground" />
            </Link>
            <NavList />
            <div className="mt-auto px-3">
              <Link to="/" className="text-xs text-foreground/40 transition-colors hover:text-foreground">
                ← Back to site
              </Link>
            </div>
          </aside>

          {/* drawer, mobile */}
          <AnimatePresence>
            {drawer && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setDrawer(false)}
                  className="fixed inset-0 z-40 bg-black/60 lg:hidden"
                />
                <motion.aside
                  initial={{ x: '-100%' }}
                  animate={{ x: 0 }}
                  exit={{ x: '-100%' }}
                  transition={{ type: 'spring', stiffness: 380, damping: 36 }}
                  className="fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-foreground/[0.06] bg-background px-3 py-5 lg:hidden"
                >
                  <Link to="/" className="mb-8 px-3" aria-label="StoxWork home" onClick={() => setDrawer(false)}>
                    <Logo className="h-5 w-auto text-foreground" />
                  </Link>
                  <NavList onNavigate={() => setDrawer(false)} />
                  <div className="mt-auto px-3">
                    <Link to="/" className="text-xs text-foreground/40 hover:text-foreground">
                      ← Back to site
                    </Link>
                  </div>
                </motion.aside>
              </>
            )}
          </AnimatePresence>

          <div className="lg:pl-60">
            <header className="sticky top-0 z-20 flex h-14 items-center justify-between gap-3 border-b border-foreground/[0.06] bg-background/80 px-4 backdrop-blur-xl sm:px-6">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setDrawer(true)}
                  aria-label="Open navigation"
                  className="flex h-9 w-9 cursor-pointer items-center justify-center rounded-lg text-foreground/70 hover:bg-foreground/5 lg:hidden"
                >
                  <svg viewBox="0 0 20 20" className="h-4 w-4" aria-hidden="true">
                    <path d="M3 6h14M3 10h14M3 14h14" {...stroke} />
                  </svg>
                </button>
                <Link to="/" className="lg:hidden" aria-label="StoxWork home">
                  <Logo className="h-4 w-auto text-foreground" />
                </Link>
              </div>
              <div className="flex items-center gap-2">
                <NetworkChip />
                <WalletButton />
              </div>
            </header>

            <main className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 lg:py-10">
              <Outlet />
            </main>
          </div>
        </div>
      </ToastProvider>
      </WalletProviders>
    </StoreProvider>
  )
}

export default AppLayout
