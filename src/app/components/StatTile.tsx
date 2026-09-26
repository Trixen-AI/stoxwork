import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** Label, value, optional note. Value in the mono face the landing figures use. */
export function StatTile({ label, value, note, tone, className }: { label: string; value: ReactNode; note?: ReactNode; tone?: 'brand' | 'blue'; className?: string }) {
  return (
    <div className={cn('bg-card p-5', className)}>
      <p className="font-mono text-[10px] font-medium tracking-[0.14em] text-foreground/40 uppercase">{label}</p>
      <p
        className={cn(
          'tnum mt-2.5 font-mono text-xl font-medium tracking-tight',
          tone === 'brand' ? 'text-brand-bright' : tone === 'blue' ? 'text-ink-blue' : 'text-foreground',
        )}
      >
        {value}
      </p>
      {note ? <p className="mt-1.5 text-xs leading-relaxed text-foreground/40">{note}</p> : null}
    </div>
  )
}

/** A row of stat tiles sharing hairline dividers, like the landing's figures card. */
export function StatGrid({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn('grid gap-px overflow-hidden rounded-xl border border-foreground/[0.07] bg-foreground/[0.06]', className)}>
      {children}
    </div>
  )
}
