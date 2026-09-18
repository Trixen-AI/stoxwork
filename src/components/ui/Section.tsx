import { motion } from 'motion/react'
import type { ReactNode } from 'react'
import { Container } from '@/components/ui/Container'
import { cn } from '@/lib/cn'
import { childTransition, riseIn, sectionReveal } from '@/lib/motion'

/**
 * The page's section shell: a hairline rule, 96/128px of air, and one reveal
 * observer whose children come in 60ms apart.
 */
export function Section({
  id,
  children,
  className,
  divider = true,
  contained = true,
}: {
  id?: string
  children: ReactNode
  className?: string
  divider?: boolean
  contained?: boolean
}) {
  return (
    <section id={id} className={cn('relative py-24 lg:py-32', className)}>
      {divider && <div className="divider-gradient absolute top-0 right-0 left-0" />}
      {contained ? <Container>{children}</Container> : children}
    </section>
  )
}

/** Wrap a section body to stagger its direct `<Rise>` children into view. */
export function Reveal({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div {...sectionReveal} className={className}>
      {children}
    </motion.div>
  )
}

/** One staggered child of a `<Reveal>`. */
export function Rise({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <motion.div variants={riseIn} transition={childTransition} className={className}>
      {children}
    </motion.div>
  )
}
