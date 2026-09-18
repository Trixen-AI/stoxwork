import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

/** The dashboard's one card: the same hairline-bordered card the landing page uses. */
export function Panel({ children, className }: { children: ReactNode; className?: string }) {
  return <section className={cn('rounded-xl border border-foreground/[0.07] bg-card', className)}>{children}</section>
}

export function PanelHeader({ title, aside, className }: { title: ReactNode; aside?: ReactNode; className?: string }) {
  return (
    <header className={cn('flex flex-wrap items-center justify-between gap-3 border-b border-foreground/[0.07] px-5 py-3.5', className)}>
      <h2 className="font-mono text-[11px] font-medium tracking-[0.14em] text-foreground/50 uppercase">{title}</h2>
      {aside}
    </header>
  )
}
