import { Reveal, Rise, Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { PROTOCOL_FIGURES } from '@/data/figures'

export function ProtocolFigures() {
  return (
    <Section id="figures">
      <Reveal>
        <Rise>
          <SectionHeading
            eyebrow="Protocol figures"
            title={
              <>
                What the contracts report,{' '}
                <span className="text-foreground/50">nothing else</span>
              </>
            }
            description="Balances refresh automatically in the background. Every figure here is read from the vault, lending and reserve contracts."
          />
        </Rise>

        <Rise className="mt-20">
          <div className="grid gap-px overflow-hidden rounded-xl border border-foreground/[0.07] bg-foreground/[0.06] md:grid-cols-3">
            {PROTOCOL_FIGURES.map((figure) => (
              <div key={figure.label} className="bg-card p-6">
                <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-foreground/40 uppercase">
                  {figure.label}
                </p>
                <p className="tnum mt-3 font-mono text-2xl font-medium tracking-tight text-foreground">
                  {figure.value}
                </p>
                <p className="mt-2 text-[13px] leading-relaxed text-foreground/45">{figure.note}</p>
              </div>
            ))}
          </div>
        </Rise>
      </Reveal>
    </Section>
  )
}
