import { Mark } from '@/components/brand/Logo'
import { SmartLink } from '@/components/ui/SmartLink'
import { Container } from '@/components/ui/Container'
import { Reveal, Rise } from '@/components/ui/Section'
import { ArrowRight } from '@/components/ui/icons'
import { BRAND } from '@/data/site'

export function FooterCta() {
  return (
    <section className="relative py-24 lg:py-28">
      <div className="divider-gradient absolute top-0 right-0 left-0" />
      <Container>
        <Reveal>
          <Rise className="flex flex-col items-center gap-6 text-center">
            <Mark className="h-12 w-12 text-foreground/80" />
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              {BRAND.name}
              <span className="block text-foreground/50">{BRAND.tagline}</span>
            </h2>
            <SmartLink
              href="/app/vaults"
              className="cta-primary inline-flex items-center gap-1.5 rounded-lg px-5 py-2.5 text-sm font-medium text-background transition-all duration-200 hover:brightness-110 active:brightness-95"
            >
              Explore vaults
              <ArrowRight className="h-3 w-3" />
            </SmartLink>
          </Rise>
        </Reveal>
      </Container>
    </section>
  )
}
