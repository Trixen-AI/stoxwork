import { Reveal, Rise, Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { FEE_SPLIT } from '@/data/figures'
import { cn } from '@/lib/cn'

const TONE = {
  gold: { bar: 'bg-gold-bright/70', text: 'text-gold-bright' },
  neutral: { bar: 'bg-foreground/30', text: 'text-foreground/70' },
  blue: { bar: 'bg-ink-blue/70', text: 'text-ink-blue' },
} as const

export function FeeSplit() {
  return (
    <Section id="fees">
      <Reveal>
        <Rise>
          <SectionHeading
            eyebrow="Where every fee goes"
            title={
              <>
                We earn only <span className="text-foreground/50">when the vault earns.</span>
              </>
            }
            description="No deposit, withdrawal or management fee. The split applies only to fees actually claimed onchain. Buyback funds stay in USDG inside the reserve contract until a buyback swaps them for STOX and burns it."
          />
        </Rise>

        <Rise className="mt-20">
          {/* one rail, three shares: the proportions are the point, so they share a track */}
          <div className="flex h-2 w-full overflow-hidden rounded-full bg-foreground/[0.06]">
            {FEE_SPLIT.map((slice) => (
              <div
                key={slice.label}
                className={cn('h-full', TONE[slice.tone].bar)}
                style={{ width: `${slice.percent}%` }}
              />
            ))}
          </div>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            {FEE_SPLIT.map((slice) => (
              <div
                key={slice.label}
                className="rounded-xl border border-foreground/[0.07] bg-card p-6 transition-colors duration-200 hover:border-foreground/[0.12]"
              >
                <p className="font-mono text-[11px] font-medium tracking-[0.14em] text-foreground/45 uppercase">
                  {slice.label}
                </p>
                <p className={cn('tnum mt-3 text-4xl font-bold tracking-tight', TONE[slice.tone].text)}>
                  {slice.percent}%
                </p>
                <p className="mt-2 text-sm text-foreground/45">{slice.detail}</p>
              </div>
            ))}
          </div>
        </Rise>
      </Reveal>
    </Section>
  )
}
