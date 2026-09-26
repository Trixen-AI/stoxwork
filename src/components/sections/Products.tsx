import type { ReactNode } from 'react'
import { SmartLink } from '@/components/ui/SmartLink'
import { StockLogo } from '@/components/brand/StockLogo'
import { Reveal, Rise, Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { StatusPill } from '@/components/ui/StatusPill'
import { ArrowRight } from '@/components/ui/icons'
import { LENDING_MARKET, VAULT_MARKETS } from '@/data/vaults'

/** The shared shell all three products use: numbered eyebrow, optional state, heading, CTA. */
function Product({
  id,
  index,
  name,
  live,
  title,
  description,
  cta,
  ctaHref,
  children,
}: {
  id: string
  index: string
  name: string
  live?: boolean
  title: ReactNode
  description: string
  cta: string
  ctaHref: string
  children: ReactNode
}) {
  return (
    <Section id={id}>
      <Reveal>
        <Rise>
          <div className="mb-4 flex items-center gap-3">
            <p className="font-mono text-xs font-medium tracking-wider text-foreground/30 uppercase">
              {index} · {name}
            </p>
            {live && <StatusPill tone="live">Live</StatusPill>}
          </div>
          <SectionHeading title={title} description={description} />
        </Rise>

        <Rise className="mt-8">
          <SmartLink
            href={ctaHref}
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all duration-200 hover:bg-foreground/90 active:bg-foreground/80"
          >
            {cta}
            <ArrowRight className="h-3 w-3" />
          </SmartLink>
        </Rise>

        <Rise className="mt-16">{children}</Rise>
      </Reveal>
    </Section>
  )
}

export function Vaults() {
  return (
    <Product
      id="vaults"
      index="01"
      name="Vaults"
      live
      title={
        <>
          One vault. <span className="text-foreground/50">One xStock.</span>
        </>
      }
      description="Every vault runs managed liquidity for a single USDG pair. Deposit USDG, own a slice of that market, and let fees compound inside the vault. Every number on the page comes from the chain."
      cta="Browse vaults"
      ctaHref="/app/vaults"
    >
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {VAULT_MARKETS.map((market) => (
          <div
            key={market.ticker}
            className="flex items-center gap-3 rounded-xl border border-foreground/[0.07] bg-card p-4 transition-colors duration-200 hover:border-foreground/[0.12]"
          >
            <StockLogo ticker={market.ticker} size="sm" />
            <span className="min-w-0">
              <span className="block truncate text-sm font-medium tracking-tight">{market.ticker}</span>
              <span className="block truncate text-xs text-foreground/40">{market.company}</span>
            </span>
          </div>
        ))}
      </div>
    </Product>
  )
}

export function Lending() {
  const m = LENDING_MARKET
  return (
    <Product
      id="lending"
      index="02"
      name="Lending"
      live
      title={
        <>
          Borrow USDG while your vault position{' '}
          <span className="text-foreground/50">keeps earning.</span>
        </>
      }
      description="Supply USDG and collect interest from borrowers, or lock eligible vault shares and borrow against them. Each market keeps its own cash and its own losses, and collateral is priced onchain."
      cta="See lending markets"
      ctaHref="/app/lending"
    >
      <div className="overflow-hidden rounded-xl border border-foreground/[0.07] bg-card">
        <div className="border-b border-foreground/[0.07] px-6 py-4">
          <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-foreground/45 uppercase">
            Vault shares → USDG · Lending market
          </p>
        </div>

        <div className="grid gap-px bg-foreground/[0.06] sm:grid-cols-2">
          <div className="bg-card p-6">
            <p className="text-[13px] text-foreground/45">Lenders earn</p>
            <p className="tnum mt-2 font-mono text-2xl font-medium tracking-tight text-brand-bright">
              {m.lendersEarn}
              <span className="ml-1.5 text-xs text-foreground/35">APY</span>
            </p>
          </div>
          <div className="bg-card p-6">
            <p className="text-[13px] text-foreground/45">Borrowers pay</p>
            <p className="tnum mt-2 font-mono text-2xl font-medium tracking-tight text-ink-blue">
              {m.borrowersPay}
              <span className="ml-1.5 text-xs text-foreground/35">APR</span>
            </p>
          </div>
        </div>

        <div className="border-t border-foreground/[0.07] px-6 py-5">
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-foreground/[0.06]">
            <div className="h-full rounded-full bg-brand-bright/60" style={{ width: `${m.utilization}%` }} />
          </div>
          <p className="tnum mt-3 font-mono text-[11px] text-foreground/45">
            {m.utilization}% utilized · {m.available} USDG available
          </p>
        </div>
      </div>
    </Product>
  )
}

/** One leg of the delta-neutral position. */
function Leg({ direction, title, note }: { direction: 'long' | 'short'; title: string; note: string }) {
  const long = direction === 'long'
  return (
    <div className="bg-card p-6 lg:p-8">
      <p
        className={`font-mono text-[11px] tracking-[0.14em] uppercase ${long ? 'text-brand-bright/80' : 'text-ink-rose/80'}`}
      >
        {long ? '↗ Long' : '↘ Short'}
      </p>
      <div className="mt-4 flex items-center gap-3">
        <StockLogo ticker="TSLA" />
        <span>
          <span className="block text-[15px] font-medium tracking-tight">{title}</span>
          <span className="block text-sm text-foreground/40">{note}</span>
        </span>
      </div>
    </div>
  )
}

export function Strategies() {
  return (
    <Product
      id="strategies"
      index="03"
      name="Strategies"
      title={
        <>
          Managed positions <span className="text-foreground/50">that combine both.</span>
        </>
      }
      description="Two strategies are being designed: a basket of the best-earning vaults, and a delta-neutral position that keeps vault fees while an external short offsets the xStock's price moves. Deposits open only after review."
      cta="Preview strategies"
      ctaHref="/app/strategies"
    >
      <div className="overflow-hidden rounded-xl border border-foreground/[0.07] bg-card">
        <div className="border-b border-foreground/[0.07] px-6 py-4">
          <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-foreground/45 uppercase">
            Delta-neutral vault yield
          </p>
        </div>

        <div className="grid gap-px bg-foreground/[0.06] md:grid-cols-2">
          <Leg direction="long" title="TSLA / USDG vault position" note="earns trading fees" />
          <Leg direction="short" title="TSLA hedge on an external venue" note="aims to offset price exposure" />
        </div>
      </div>

      <p className="mt-6 text-sm text-foreground/35">
        No terms, targets or rates are published. Not principal-protected.
      </p>
    </Product>
  )
}
