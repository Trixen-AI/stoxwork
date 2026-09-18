import { healthTone } from '@/app/state/model'
import { num } from '@/lib/format'
import { cn } from '@/lib/cn'

const TONE = {
  safe: { text: 'text-gold-bright', fill: 'bg-gold-bright/70', label: 'Healthy' },
  watch: { text: 'text-foreground', fill: 'bg-foreground/60', label: 'Watch' },
  risk: { text: 'text-ink-rose', fill: 'bg-ink-rose/80', label: 'At risk' },
} as const

/**
 * Health factor as a number, a word and a meter, so the state never rests on colour
 * alone. The meter maps HF 1.0 (liquidation) to 3.0+ (full) on one track.
 */
export function HealthMeter({ value, compact }: { value: number; compact?: boolean }) {
  if (!Number.isFinite(value)) {
    return <span className="font-mono text-sm text-foreground/40">No debt</span>
  }
  const tone = TONE[healthTone(value)]
  const fill = Math.max(4, Math.min(100, ((value - 1) / 2) * 100))
  return (
    <div className={cn('flex items-center gap-3', compact ? '' : 'w-full')}>
      <span className={cn('tnum font-mono text-sm font-medium', tone.text)}>{num(value, 2)}</span>
      <span className="text-[11px] text-foreground/45">{tone.label}</span>
      {compact ? null : (
        <span aria-hidden="true" className="h-1.5 flex-1 overflow-hidden rounded-full bg-foreground/[0.06]">
          <span className={cn('block h-full rounded-full', tone.fill)} style={{ width: `${fill}%` }} />
        </span>
      )}
    </div>
  )
}
