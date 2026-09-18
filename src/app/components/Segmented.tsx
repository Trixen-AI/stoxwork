import { cn } from '@/lib/cn'

/** Pill tab switch. Real radio semantics so it works with a keyboard. */
export function Segmented<T extends string>({
  options,
  value,
  onChange,
  label,
  className,
}: {
  options: Array<{ value: T; label: string }>
  value: T
  onChange: (v: T) => void
  label: string
  className?: string
}) {
  return (
    <div role="radiogroup" aria-label={label} className={cn('inline-flex rounded-lg border border-foreground/[0.08] bg-foreground/[0.03] p-0.5', className)}>
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="radio"
          aria-checked={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            'cursor-pointer rounded-md px-3 py-1.5 text-xs font-medium transition-colors select-none',
            value === o.value ? 'bg-foreground/10 text-foreground' : 'text-foreground/50 hover:text-foreground',
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}
