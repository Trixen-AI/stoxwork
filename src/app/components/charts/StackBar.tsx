import { useState } from 'react'

export type Slice = { label: string; value: number; color: string; detail?: string }

/**
 * Part-to-whole on one track: segments separated by a 2px surface gap, never a
 * border. The legend below always names every segment, so identity never rests on
 * colour; values sit in the legend, not inside narrow segments where they'd clip.
 */
export function StackBar({ slices, format }: { slices: Slice[]; format: (n: number) => string }) {
  const total = slices.reduce((s, x) => s + x.value, 0) || 1
  const [hover, setHover] = useState<number | null>(null)

  return (
    <div>
      <div className="flex h-3 w-full gap-[2px] overflow-hidden rounded-full" role="img" aria-label={slices.map((s) => `${s.label} ${format(s.value)}`).join(', ')}>
        {slices.map((s, i) => (
          <div
            key={s.label}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            className="h-full transition-opacity first:rounded-l-full last:rounded-r-full"
            style={{ width: `${(s.value / total) * 100}%`, background: s.color, opacity: hover === null || hover === i ? 1 : 0.45 }}
          />
        ))}
      </div>
      <ul className="mt-4 grid gap-3 sm:grid-cols-3">
        {slices.map((s, i) => (
          <li
            key={s.label}
            onPointerEnter={() => setHover(i)}
            onPointerLeave={() => setHover(null)}
            className="flex items-start gap-2.5"
          >
            <span aria-hidden="true" className="mt-1 h-2.5 w-2.5 flex-shrink-0 rounded-[3px]" style={{ background: s.color }} />
            <span className="min-w-0">
              <span className="tnum block font-mono text-sm text-foreground">{format(s.value)}</span>
              <span className="block text-xs text-foreground/50">{s.label}</span>
              {s.detail ? <span className="block text-[11px] text-foreground/35">{s.detail}</span> : null}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
