import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn('mb-4 font-mono text-xs font-medium tracking-wider text-foreground/30 uppercase', className)}>
      {children}
    </p>
  )
}
