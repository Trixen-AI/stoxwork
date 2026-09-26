import { motion } from 'motion/react'
import { SmartLink } from '@/components/ui/SmartLink'
import { Instruments } from '@/components/hero/Instruments'
import { MarketField } from '@/components/hero/MarketField'
import { MediaStack } from '@/components/hero/MediaStack'
import { Container } from '@/components/ui/Container'
import { ArrowRight } from '@/components/ui/icons'
import { HERO_POINTS } from '@/data/figures'

export function Hero() {
  return (
    <section id="top" className="relative flex min-h-[95vh] items-center overflow-hidden">
      <div className="absolute inset-0">
        <MediaStack columns={9} rows={20}>
          <MarketField className="h-full w-full opacity-55" />
        </MediaStack>

        {/* the slow horizontal rule that reads the page top to bottom */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div
            className="scan-line absolute right-0 left-0 h-[2px]"
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(242,197,92,0.08), transparent)',
              boxShadow: '0 0 20px 8px rgba(242,197,92,0.04)',
            }}
          />
        </div>
      </div>

      <Instruments />

      {/* centre scrim, so the headline never fights the artwork behind it */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 lg:hidden"
        style={{
          background:
            'radial-gradient(ellipse 90% 60% at 50% 48%, var(--hero-overlay-mobile) 0%, rgba(6,5,4,0.72) 55%, rgba(6,5,4,0.35) 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 hidden lg:block"
        style={{
          background:
            'radial-gradient(ellipse 60% 50% at 50% 48%, rgba(6,5,4,0.86) 0%, rgba(6,5,4,0.6) 55%, rgba(6,5,4,0.22) 100%)',
        }}
      />

      <Container className="relative z-10 py-24 lg:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="mb-6 flex justify-center"
          >
            <a
              href="#vaults"
              className="group inline-flex items-center gap-2 rounded-full border border-foreground/10 bg-foreground/5 py-1 pr-2.5 pl-3 text-sm backdrop-blur-xl transition-all duration-200 hover:border-foreground/25 hover:bg-foreground/10"
            >
              <span className="h-1.5 w-1.5 flex-shrink-0 animate-pulse rounded-full bg-brand-bright/80" />
              <span className="text-foreground/70">Vaults · Lending · Strategies</span>
              <span className="h-3.5 w-px flex-shrink-0 bg-foreground/15" />
              <span className="inline-flex items-center gap-1 font-medium text-foreground">
                See how
                <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </span>
            </a>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1, ease: 'easeOut' }}
            className="text-4xl leading-[1.08] font-bold tracking-tight sm:text-5xl lg:text-[64px]"
          >
            Your USDG.
            <br />
            <span className="hero-accent">Put to work.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mx-auto mt-6 max-w-xl text-lg text-foreground/50"
          >
            Pick a tokenized stock vault, deposit USDG, and earn a share of the trading fees its liquidity collects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row"
          >
            <SmartLink
              href="/app/vaults"
              className="hero-cta-primary inline-flex w-full animate-[ctaGlow_4s_ease-in-out_infinite] items-center justify-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium text-background transition-all duration-200 hover:brightness-110 active:brightness-95 sm:w-auto"
            >
              Browse vaults
              <ArrowRight className="h-3 w-3" />
            </SmartLink>
            <a
              href="#vaults"
              className="inline-flex w-full items-center justify-center gap-1.5 rounded-lg border border-foreground/10 bg-foreground/5 px-5 py-2.5 text-sm font-medium text-foreground backdrop-blur-xl transition-all duration-200 hover:border-foreground/25 hover:bg-foreground/20 active:bg-foreground/25 sm:w-auto"
            >
              How it works
            </a>
          </motion.div>

          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="mx-auto mt-10 flex max-w-4xl flex-col items-center justify-center gap-2 font-mono text-[11px] tracking-wide text-foreground/35 uppercase sm:flex-row sm:gap-0"
          >
            {HERO_POINTS.map((point, i) => (
              <li key={point} className="flex items-center">
                {i > 0 && <span aria-hidden="true" className="mx-3 hidden h-3 w-px bg-foreground/15 sm:block" />}
                <span className="text-center sm:whitespace-nowrap">{point}</span>
              </li>
            ))}
          </motion.ul>
        </motion.div>
      </Container>

      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 left-0 h-48"
        style={{ background: 'linear-gradient(to bottom, transparent, var(--hero-bottom-fade))' }}
      />
    </section>
  )
}
