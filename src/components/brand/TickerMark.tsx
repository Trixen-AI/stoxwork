import { cn } from '@/lib/cn'

/**
 * A market's identity chip.
 *
 * Ticker symbols identify the underlying asset, so the chip is our own neutral mark,
 * not a company logo: the symbol set in the brand mono face on a tinted plate, with a
 * hairline that picks up the brand colour when the row is hovered.
 */
export function TickerMark({
  ticker,
  className,
  size = 'md',
}: {
  ticker: string
  className?: string
  size?: 'sm' | 'md' | 'lg'
}) {
  const box = { sm: 'h-8 w-8', md: 'h-10 w-10', lg: 'h-12 w-12' }[size]
  // Five-character symbols (GOOGL, MSTR) drop a step so the whole ticker still fits.
  const long = ticker.length >= 5
  const type = {
    sm: long ? 'text-[7px]' : 'text-[9px]',
    md: long ? 'text-[8px]' : 'text-[10px]',
    lg: long ? 'text-[9px]' : 'text-[11px]',
  }[size]

  return (
    <span
      aria-hidden="true"
      className={cn(
        'inline-flex flex-shrink-0 items-center justify-center rounded-lg border border-foreground/[0.08] bg-foreground/[0.04] font-mono font-medium tracking-tight text-foreground/70 transition-colors duration-200',
        box,
        type,
        className,
      )}
    >
      {ticker}
    </span>
  )
}
