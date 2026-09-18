import chainlink from '@/assets/partners/chainlink.svg?raw'
import globaldollar from '@/assets/partners/globaldollar.svg?raw'
import openzeppelin from '@/assets/partners/openzeppelin.svg?raw'
import robinhood from '@/assets/partners/robinhood.svg?raw'
import uniswap from '@/assets/partners/uniswap.svg?raw'
import { resizeOnly } from '@/lib/svg'

/**
 * Official brand files, inlined unmodified and resized only.
 * Source URLs: assets/partners/SOURCES.md
 *
 * Each logo gets an optical height rather than one shared height: a compact mark
 * (Robinhood's feather, the Global Dollar pill) needs more height than a long
 * wordmark to carry the same visual weight.
 */
type Partner = { name: string; svg: string; height: string }

export const PARTNERS: Partner[] = [
  { name: 'Robinhood', svg: resizeOnly(robinhood), height: 'h-7' },
  { name: 'Uniswap', svg: resizeOnly(uniswap), height: 'h-6' },
  { name: 'Chainlink', svg: resizeOnly(chainlink), height: 'h-5' },
  { name: 'Global Dollar (USDG)', svg: resizeOnly(globaldollar), height: 'h-6' },
  { name: 'OpenZeppelin', svg: resizeOnly(openzeppelin), height: 'h-5' },
]

export function PartnerLogo({ partner }: { partner: Partner }) {
  return (
    <span
      className={`inline-flex ${partner.height} max-w-full items-center [&>svg]:h-full [&>svg]:w-auto [&>svg]:max-w-full`}
      role="img"
      aria-label={partner.name}
      dangerouslySetInnerHTML={{ __html: partner.svg }}
    />
  )
}
