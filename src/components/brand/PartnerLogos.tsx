import backed from '@/assets/partners/backed.svg?raw'
import globaldollar from '@/assets/partners/globaldollar.svg?raw'
import jupiter from '@/assets/partners/jupiter.svg?raw'
import solana from '@/assets/partners/solana.svg?raw'
import { resizeOnly } from '@/lib/svg'

/**
 * Official brand files, inlined unmodified and resized only.
 * Source URLs: assets/partners/SOURCES.md
 *
 * Each logo gets an optical height rather than one shared height: a compact mark
 * needs more height than a long wordmark to carry the same visual weight. Pyth
 * publishes no fetchable official SVG, so it shows a neutral mark with its name.
 */
type Partner = { name: string; svg?: string; height: string }

export const PARTNERS: Partner[] = [
  { name: 'Solana', svg: resizeOnly(solana), height: 'h-5' },
  { name: 'Jupiter', svg: resizeOnly(jupiter), height: 'h-7' },
  { name: 'Pyth', height: 'h-5' },
  { name: 'Global Dollar (USDG)', svg: resizeOnly(globaldollar), height: 'h-6' },
  { name: 'Backed', svg: resizeOnly(backed), height: 'h-5' },
]

export function PartnerLogo({ partner }: { partner: Partner }) {
  if (!partner.svg) {
    return (
      <span className="inline-flex items-center gap-2 text-foreground/45">
        <span aria-hidden="true" className="inline-block h-3.5 w-3.5 rounded-[4px] border border-current" />
        <span className="text-[15px] font-medium tracking-tight">{partner.name}</span>
      </span>
    )
  }
  return (
    <span
      className={`inline-flex ${partner.height} max-w-full items-center [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full`}
      role="img"
      aria-label={partner.name}
      dangerouslySetInnerHTML={{ __html: partner.svg }}
    />
  )
}
