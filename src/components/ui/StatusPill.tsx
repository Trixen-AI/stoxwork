import { cn } from '@/lib/cn'

type Tone = 'live' | 'pending' | 'locked'

const TONE: Record<Tone, { dot: string; text: string }> = {
  live: { dot: 'bg-gold-bright', text: 'text-gold-bright/80' },
  pending: { dot: 'bg-foreground/40', text: 'text-foreground/40' },
  locked: { dot: 'bg-ink-blue/70', text: 'text-ink-blue/70' },
}

export function StatusPill({ tone, children, className }: { tone: Tone; children: string; className?: string }) {
  const t = TONE[tone]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border border-foreground/10 bg-foreground/5 px-2.5 py-1 font-mono text-[10px] font-medium tracking-wider uppercase',
        t.text,
        className,
      )}
    >
      <span className={cn('h-1.5 w-1.5 flex-shrink-0 rounded-full', t.dot, tone === 'live' && 'animate-pulse')} />
      {children}
    </span>
  )
}
