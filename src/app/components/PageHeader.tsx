import type { ReactNode } from 'react'
import { Seo } from '@/components/Seo'

/** Page title block: mono eyebrow, heading, one line of context, optional actions. */
export function PageHeader({ eyebrow, title, description, actions }: { eyebrow: string; title: ReactNode; description?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <Seo title={eyebrow} />
      <div className="min-w-0">
        <p className="mb-2 font-mono text-[11px] font-medium tracking-[0.14em] text-foreground/35 uppercase">{eyebrow}</p>
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{title}</h1>
        {description ? <p className="mt-2 max-w-2xl text-sm leading-relaxed text-foreground/50">{description}</p> : null}
      </div>
      {actions ? <div className="flex flex-shrink-0 items-center gap-2">{actions}</div> : null}
    </div>
  )
}
