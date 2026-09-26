import { useId } from 'react'
import { amount as fmtAmount } from '@/lib/format'
import { cn } from '@/lib/cn'

/**
 * Amount input with its unit, a balance line and a MAX shortcut. Keeps the raw
 * string so typing "0." or "12.50" is never reformatted under the cursor.
 */
export function AmountField({
  label,
  unit,
  value,
  onChange,
  max,
  maxLabel = 'Available',
  error,
}: {
  label: string
  unit: string
  value: string
  onChange: (v: string) => void
  max: number
  maxLabel?: string
  error?: string | null
}) {
  const id = useId()
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between text-xs">
        <label htmlFor={id} className="text-foreground/55">
          {label}
        </label>
        <span className="text-foreground/40">
          {maxLabel}: <span className="tnum font-mono text-foreground/70">{fmtAmount(max)}</span> {unit}
        </span>
      </div>
      <div
        className={cn(
          'flex items-center gap-2 rounded-lg border bg-background/60 px-3 transition-colors focus-within:border-brand-bright/50',
          error ? 'border-ink-rose/50' : 'border-foreground/10',
        )}
      >
        <input
          id={id}
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          value={value}
          onChange={(e) => {
            const v = e.target.value.replace(/[^0-9.]/g, '')
            if ((v.match(/\./g) ?? []).length <= 1) onChange(v)
          }}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? `${id}-err` : undefined}
          className="tnum min-w-0 flex-1 bg-transparent py-3 font-mono text-lg text-foreground outline-none placeholder:text-foreground/20"
        />
        <button
          type="button"
          onClick={() => onChange(max > 0 ? String(Math.floor(max * 1e6) / 1e6) : '')}
          className="cursor-pointer rounded-md border border-foreground/10 px-2 py-1 font-mono text-[10px] tracking-wider text-foreground/60 uppercase transition-colors hover:border-brand-bright/40 hover:text-brand-bright"
        >
          Max
        </button>
        <span className="font-mono text-xs text-foreground/45">{unit}</span>
      </div>
      {error ? (
        <p id={`${id}-err`} role="alert" className="mt-1.5 text-xs text-ink-rose">
          {error}
        </p>
      ) : null}
    </div>
  )
}
