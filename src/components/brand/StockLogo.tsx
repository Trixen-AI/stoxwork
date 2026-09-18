import aapl from '@/assets/stocks/aapl.svg?raw'
import amd from '@/assets/stocks/amd.svg?raw'
import amzn from '@/assets/stocks/amzn.svg?raw'
import crcl from '@/assets/stocks/crcl.svg?raw'
import gme from '@/assets/stocks/gme.svg?raw'
import googl from '@/assets/stocks/googl.svg?raw'
import intc from '@/assets/stocks/intc.svg?raw'
import meta from '@/assets/stocks/meta.svg?raw'
import msft from '@/assets/stocks/msft.svg?raw'
import mstr from '@/assets/stocks/mstr.svg?raw'
import nvda from '@/assets/stocks/nvda.svg?raw'
import tsla from '@/assets/stocks/tsla.svg?raw'
import { TickerMark } from '@/components/brand/TickerMark'
import { cn } from '@/lib/cn'
import { resizeOnly } from '@/lib/svg'

/**
 * Official company logos for the Stock Tokens the vaults trade, unmodified and
 * resized only. Sources: src/assets/stocks/SOURCES.md. SPY has no official SVG
 * available, so it keeps the neutral ticker chip.
 */
const LOGOS: Record<string, string> = Object.fromEntries(
  Object.entries({ AAPL: aapl, AMD: amd, AMZN: amzn, CRCL: crcl, GME: gme, GOOGL: googl, INTC: intc, META: meta, MSFT: msft, MSTR: mstr, NVDA: nvda, TSLA: tsla }).map(
    ([k, v]) => [k, resizeOnly(v)],
  ),
)

const BOX = { sm: 'h-8 w-8 p-1.5', md: 'h-9 w-9 p-1.5' } as const

export function StockLogo({ ticker, size = 'md', className }: { ticker: string; size?: 'sm' | 'md'; className?: string }) {
  const svg = LOGOS[ticker]
  if (!svg) return <TickerMark ticker={ticker} size="sm" className={className} />
  return (
    <span
      role="img"
      aria-label={`${ticker} logo`}
      className={cn(
        'inline-flex flex-shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white [&>svg]:h-full [&>svg]:w-full',
        BOX[size],
        className,
      )}
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
