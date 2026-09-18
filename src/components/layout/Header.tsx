import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Logo } from '@/components/brand/Logo'
import { SmartLink } from '@/components/ui/SmartLink'
import { ArrowUpRight, Chevron } from '@/components/ui/icons'
import { APP_URL, BRAND, NAV, type NavItem } from '@/data/site'
import { cn } from '@/lib/cn'

/** The underline-free nav: hovering a trigger slides one shared panel across. */
function DesktopNav({ items }: { items: NavItem[] }) {
  const wrap = useRef<HTMLDivElement>(null)
  const triggers = useRef<Record<string, HTMLElement | null>>({})
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const [open, setOpen] = useState<string | null>(null)
  const [anchor, setAnchor] = useState<{ left: number; width: number } | null>(null)

  const measure = (label: string | null) => {
    if (!label || !wrap.current) {
      setAnchor(null)
      return
    }
    const el = triggers.current[label]
    if (!el) return
    const w = wrap.current.getBoundingClientRect()
    const t = el.getBoundingClientRect()
    setAnchor({ left: t.left - w.left, width: t.width })
  }

  const show = (label: string) => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current)
      closeTimer.current = null
    }
    setOpen(label)
    measure(label)
  }

  // A short grace period, so crossing the gap to the panel does not close it.
  const scheduleClose = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current)
    closeTimer.current = setTimeout(() => setOpen(null), 150)
  }

  useEffect(
    () => () => {
      if (closeTimer.current) clearTimeout(closeTimer.current)
    },
    [],
  )

  useLayoutEffect(() => {
    if (open) measure(open)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open])

  const active = items.find((i) => i.label === open)

  return (
    <div ref={wrap} className="relative hidden md:block" onMouseLeave={scheduleClose}>
      <nav className="flex items-center gap-1" aria-label="Main">
        {items
          .filter((i) => i.label !== 'Home')
          .map((item) =>
            item.children ? (
              <button
                key={item.label}
                type="button"
                ref={(el) => {
                  triggers.current[item.label] = el
                }}
                onMouseEnter={() => show(item.label)}
                onClick={() => (open === item.label ? setOpen(null) : show(item.label))}
                aria-expanded={open === item.label}
                className={cn(
                  'flex cursor-pointer items-center gap-1 px-3 py-1.5 text-sm transition-colors select-none',
                  open === item.label ? 'text-foreground' : 'text-foreground/60 hover:text-foreground',
                )}
              >
                {item.label}
                <Chevron
                  className={cn('h-3 w-3 transition-transform duration-200', open === item.label && 'rotate-180')}
                />
              </button>
            ) : (
              <a
                key={item.label}
                href={item.href}
                ref={(el) => {
                  triggers.current[item.label] = el
                }}
                onMouseEnter={() => setOpen(null)}
                className="px-3 py-1.5 text-sm text-foreground/60 transition-colors select-none hover:text-foreground"
              >
                {item.label}
              </a>
            ),
          )}
      </nav>

      <AnimatePresence>
        {active?.children && anchor && (
          <motion.div
            key="nav-dropdown"
            initial={{ opacity: 0, y: 4, x: anchor.left + anchor.width / 2 }}
            animate={{ opacity: 1, y: 0, x: anchor.left + anchor.width / 2 }}
            exit={{ opacity: 0, y: 4 }}
            transition={{
              opacity: { duration: 0.15 },
              y: { duration: 0.15 },
              x: { type: 'spring', stiffness: 380, damping: 32 },
            }}
            onMouseEnter={() => show(active.label)}
            onMouseLeave={scheduleClose}
            className="pointer-events-none absolute top-full left-0 z-50"
          >
            <div className="pointer-events-auto -translate-x-1/2 pt-2">
              <motion.div
                layout
                transition={{ layout: { type: 'spring', stiffness: 380, damping: 32 } }}
                className="overflow-hidden rounded-xl border border-foreground/10 bg-background/95 shadow-xl shadow-black/30 backdrop-blur-xl"
              >
                <motion.div
                  key={active.label}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.12 }}
                  className="min-w-[220px] p-1.5"
                >
                  {active.children.map((child) => (
                    <SmartLink
                      key={child.label}
                      href={child.href}
                      onClick={() => setOpen(null)}
                      {...(child.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                      className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-foreground/60 transition-colors select-none hover:bg-foreground/[0.06] hover:text-foreground"
                    >
                      {child.label}
                      {child.external && <ArrowUpRight className="ml-auto h-3 w-3 text-foreground/30" />}
                    </SmartLink>
                  ))}
                </motion.div>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Header() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <>
      <div
        aria-hidden="true"
        className={cn(
          'pointer-events-none fixed inset-x-0 top-0 z-40 h-24 transition-opacity duration-200',
          scrolled ? 'opacity-100' : 'opacity-70',
        )}
        style={{
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          maskImage:
            'linear-gradient(to bottom, black 0%, black 40%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.2) 85%, transparent 100%)',
          WebkitMaskImage:
            'linear-gradient(to bottom, black 0%, black 40%, rgba(0,0,0,0.6) 65%, rgba(0,0,0,0.2) 85%, transparent 100%)',
        }}
      />

      <header className="fixed top-0 z-50 w-full translate-y-0 transition-transform duration-300">
        <div className="relative">
          <div
            className={cn(
              'mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 transition-[height,padding] duration-200 lg:px-8',
              scrolled ? 'py-2 lg:h-14' : 'py-4 lg:h-20',
            )}
          >
            <div className="flex items-center gap-10">
              <a href="#top" className="flex flex-shrink-0 items-center" aria-label={`${BRAND.name} home`}>
                <Logo className="h-5 w-auto text-foreground" />
              </a>
              <DesktopNav items={NAV} />
            </div>

            <div className="flex items-center gap-4">
              <SmartLink
                href={APP_URL}
                className="hidden items-center gap-1.5 rounded-full bg-foreground px-3.5 py-1.5 text-sm font-medium text-background transition-colors select-none hover:bg-foreground/90 active:bg-foreground/80 md:inline-flex"
              >
                Launch App
              </SmartLink>
              <button
                type="button"
                onClick={() => setMenuOpen((v) => !v)}
                aria-expanded={menuOpen}
                aria-label="Menu"
                className="relative flex h-9 w-9 cursor-pointer items-center justify-center rounded-full transition-colors select-none hover:bg-foreground/5 md:hidden"
              >
                <span className="flex flex-col items-center gap-[5px]">
                  <span
                    className={cn(
                      'block h-[1.5px] w-4 bg-foreground/70 transition-all duration-200',
                      menuOpen && 'translate-y-[6.5px] rotate-45',
                    )}
                  />
                  <span
                    className={cn('block h-[1.5px] w-4 bg-foreground/70 transition-all duration-200', menuOpen && 'opacity-0')}
                  />
                  <span
                    className={cn(
                      'block h-[1.5px] w-4 bg-foreground/70 transition-all duration-200',
                      menuOpen && '-translate-y-[6.5px] -rotate-45',
                    )}
                  />
                </span>
              </button>
            </div>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="mx-6 overflow-hidden rounded-xl border border-foreground/10 bg-background/95 p-2 backdrop-blur-xl md:hidden"
            >
              {NAV.filter((i) => i.label !== 'Home').map((item) => (
                <div key={item.label} className="py-1">
                  <p className="px-3 py-1.5 font-mono text-[10px] tracking-wider text-foreground/30 uppercase">
                    {item.label}
                  </p>
                  {item.children?.map((child) => (
                    <SmartLink
                      key={child.label}
                      href={child.href}
                      onClick={() => setMenuOpen(false)}
                      className="block rounded-lg px-3 py-2 text-sm text-foreground/70 transition-colors hover:bg-foreground/[0.06] hover:text-foreground"
                    >
                      {child.label}
                    </SmartLink>
                  ))}
                </div>
              ))}
              <SmartLink
                href={APP_URL}
                onClick={() => setMenuOpen(false)}
                className="mt-2 block rounded-lg bg-foreground px-3 py-2.5 text-center text-sm font-medium text-background"
              >
                Launch App
              </SmartLink>
            </motion.div>
          )}
        </AnimatePresence>
      </header>
    </>
  )
}
