import { PartnerLogo, PARTNERS } from '@/components/brand/PartnerLogos'
import { SmartLink } from '@/components/ui/SmartLink'
import { StockLogo } from '@/components/brand/StockLogo'
import { Reveal, Rise, Section } from '@/components/ui/Section'
import { SectionHeading } from '@/components/ui/SectionHeading'
import { ArrowRight } from '@/components/ui/icons'
import { TOP_VAULTS } from '@/data/vaults'

/** Stock Token share against USDG share, as a thin two-tone rail with the split. */
function Inventory({ split }: { split: [number, number] }) {
  const [stock, usdg] = split
  return (
    <span className="inline-flex items-center justify-end gap-2.5">
      <span className="hidden h-1 w-14 overflow-hidden rounded-full bg-ink-blue/40 sm:inline-flex">
        <span className="h-full bg-gold-bright/80" style={{ width: `${stock}%` }} />
      </span>
      <span className="tnum">
        {stock}
        <span className="text-foreground/30"> / </span>
        {usdg}
      </span>
    </span>
  )
}

const MOBILE_LABEL = 'mr-2 font-sans text-[10px] tracking-wide text-foreground/30 uppercase sm:hidden'

export function TopVaults() {
  return (
    <Section id="top-vaults">
      <Reveal>
        <Rise>
          <SectionHeading
            eyebrow="Markets"
            title={
              <>
                Top vaults by APR{' '}
                <span className="text-foreground/50">across every market</span>
              </>
            }
            description="Every vault runs its own USDG pair. TVL, fee APR and inventory are read from the vault contracts and refresh in the background."
          />
        </Rise>

        <Rise className="mt-20">
          <div className="overflow-hidden rounded-xl border border-foreground/[0.07] bg-card">
            <div className="hidden grid-cols-[1.6fr_1fr_1fr_1fr] gap-4 border-b border-foreground/[0.07] px-6 py-3.5 font-mono text-[10px] font-medium tracking-[0.14em] text-foreground/40 uppercase sm:grid">
              <span>Vault</span>
              <span className="text-right">TVL</span>
              <span className="text-right">Est. fee APR</span>
              <span className="text-right">Inventory</span>
            </div>

            <ul>
              {TOP_VAULTS.map((vault) => (
                <li
                  key={vault.ticker}
                  className="grid grid-cols-2 items-center gap-x-4 gap-y-2 border-b border-foreground/[0.05] px-6 py-4 transition-colors duration-200 last:border-b-0 hover:bg-foreground/[0.02] sm:grid-cols-[1.6fr_1fr_1fr_1fr]"
                >
                  <SmartLink href={`/app/vaults/${vault.ticker}`} className="col-span-2 flex items-center gap-3 transition-colors hover:text-gold-bright sm:col-span-1">
                    <StockLogo ticker={vault.ticker} />
                    <span>
                      <span className="block text-sm font-medium tracking-tight text-foreground">{vault.ticker}</span>
                      <span className="block font-mono text-[11px] text-foreground/35">{vault.pair}</span>
                    </span>
                  </SmartLink>

                  <span className="tnum text-left font-mono text-[13px] text-foreground/75 sm:text-right">
                    <span className={MOBILE_LABEL}>TVL</span>
                    {vault.tvl}
                  </span>
                  <span className="tnum text-right font-mono text-[13px] text-gold-bright/90">
                    <span className={MOBILE_LABEL}>APR</span>
                    {vault.feeApr}
                  </span>
                  <span className="col-span-2 text-right font-mono text-[13px] text-foreground/75 sm:col-span-1">
                    <span className={MOBILE_LABEL}>Inventory</span>
                    <Inventory split={vault.inventory} />
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </Rise>

        <Rise className="mt-12 text-center">
          <SmartLink
            href="/app/vaults"
            className="inline-flex items-center gap-1.5 rounded-lg bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-all duration-200 hover:bg-foreground/90 active:bg-foreground/80"
          >
            All vaults
            <ArrowRight className="h-3 w-3" />
          </SmartLink>
        </Rise>

        {/* Built on. Equal-width cells, each logo centred in its own cell, so the
            spacing stays even whatever each logo's aspect ratio is. Below lg the
            row wraps centred, so an odd last logo sits in the middle. */}
        <Rise className="mt-24">
          <p className="mb-10 text-center font-mono text-[11px] font-medium tracking-[0.14em] text-foreground/30 uppercase">
            Built on
          </p>
          <ul className="flex flex-wrap items-center justify-center gap-y-10 lg:grid lg:grid-cols-5">
            {PARTNERS.map((partner) => (
              <li
                key={partner.name}
                className="flex h-10 w-1/2 items-center justify-center px-4 opacity-60 sm:w-1/3 lg:w-auto grayscale transition-[filter,opacity] duration-300 hover:opacity-100 hover:grayscale-0"
              >
                <PartnerLogo partner={partner} />
              </li>
            ))}
          </ul>
        </Rise>
      </Reveal>
    </Section>
  )
}
