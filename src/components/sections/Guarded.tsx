import { MediaStack } from '@/components/hero/MediaStack'
import { MarketField } from '@/components/hero/MarketField'
import { Container } from '@/components/ui/Container'
import { Reveal, Rise } from '@/components/ui/Section'
import { RotatingWord } from '@/components/ui/RotatingWord'
import { ArrowRight, CapIcon, FeedIcon, PauseIcon } from '@/components/ui/icons'
import { GUARD_CARDS } from '@/data/figures'

const ICONS = {
  feed: FeedIcon,
  cap: CapIcon,
  pause: PauseIcon,
} as const

export function Guarded() {
  return (
    <section id="guarded" className="relative overflow-hidden py-24 lg:py-32">
      {/* the artwork is pushed right down, so this section reads as a quiet coda */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-0 right-0 left-0 z-10 h-64"
        style={{
          background:
            'linear-gradient(to bottom, var(--color-background) 0%, var(--color-background) 20%, transparent 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-0 bottom-0 left-0 z-10 h-64"
        style={{
          background:
            'linear-gradient(to top, var(--color-background) 0%, var(--color-background) 20%, transparent 100%)',
        }}
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 animate-[breathe_10s_ease-in-out_infinite]"
        style={{
          background:
            'radial-gradient(ellipse 70% 49% at 50% 30%, rgba(169,117,33,0.2), rgba(242,197,92,0.06) 40%, transparent 100%)',
        }}
      />
      <div className="pointer-events-none absolute inset-0 opacity-15">
        <MediaStack columns={5} rows={8}>
          <MarketField className="h-full w-full" />
        </MediaStack>
      </div>

      <Container className="relative">
        <Reveal>
          <Rise className="mx-auto max-w-3xl text-center">
            <p className="mb-4 font-mono text-xs font-medium tracking-wider text-foreground/60 uppercase">
              Guarded by default
            </p>
            <h2 className="text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              <span className="block">Checked before every</span>
              <RotatingWord words={['deposit', 'swap', 'borrow']} className="text-gradient" />
            </h2>
            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-foreground/50">
              Pyth price and confidence feeds must be fresh before anything moves. Vaults and lending markets
              are each capped, pausable and verifiable onchain. Vault shares are not a stablecoin and are not
              principal-protected.
            </p>
            <div className="mt-8">
              <a
                href="#top"
                className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all duration-200 hover:bg-foreground/90 active:bg-foreground/80"
              >
                Explore the docs
                <ArrowRight className="h-3 w-3" />
              </a>
            </div>
          </Rise>

          <div className="mt-16 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {GUARD_CARDS.map((card) => {
              const Icon = ICONS[card.icon]
              return (
                <Rise key={card.title}>
                  <div className="group flex h-full items-start gap-4 rounded-xl border border-foreground/[0.07] bg-card p-6 transition-colors duration-200 hover:border-foreground/[0.12]">
                    <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg border border-foreground/[0.06] bg-foreground/[0.03] text-foreground transition-colors duration-200 group-hover:border-foreground/[0.10]">
                      <Icon className="h-6 w-6" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{card.title}</h3>
                      <p className="mt-1 text-sm text-foreground/50">{card.body}</p>
                    </div>
                  </div>
                </Rise>
              )
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  )
}
