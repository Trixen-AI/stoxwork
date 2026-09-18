import type { ReactNode } from 'react'
import { Eyebrow } from '@/components/ui/Eyebrow'
import { cn } from '@/lib/cn'

type Props = {
  eyebrow?: ReactNode
  title: ReactNode
  description?: ReactNode
  /** `split` puts the paragraph beside the heading; `center` stacks them. */
  align?: 'split' | 'center' | 'left'
  aside?: ReactNode
  size?: 'default' | 'small' | 'large'
}

const TITLE_SIZE = {
  small: 'text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl',
  default: 'text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl',
  large: 'text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl',
} as const

/**
 * Every section opens the same way, so the page has one reading rhythm: a mono
 * eyebrow, a heading whose trailing clause drops to 50% ink, and a 20px paragraph
 * that either sits beside the heading or under it.
 */
export function SectionHeading({ eyebrow, title, description, align = 'split', aside, size = 'default' }: Props) {
  if (align === 'split') {
    return (
      <div>
        {eyebrow && <Eyebrow>{eyebrow}</Eyebrow>}
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between lg:gap-12">
          <h2 className={cn(TITLE_SIZE[size], 'lg:max-w-[30rem] lg:shrink-0')}>{title}</h2>
          {description && (
            <p className="max-w-md text-xl leading-relaxed text-pretty text-foreground/50 lg:max-w-[30rem]">
              {description}
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={align === 'center' ? 'text-center' : ''}>
      {eyebrow && <Eyebrow className={align === 'center' ? 'text-foreground/60' : undefined}>{eyebrow}</Eyebrow>}
      {aside ? (
        <div className="flex items-center justify-between gap-4">
          <h2 className={TITLE_SIZE[size]}>{title}</h2>
          {aside}
        </div>
      ) : (
        <h2 className={TITLE_SIZE[size]}>{title}</h2>
      )}
      {description && (
        <p
          className={cn(
            'mt-5 max-w-2xl text-lg leading-relaxed text-pretty text-foreground/50',
            align === 'center' && 'mx-auto',
          )}
        >
          {description}
        </p>
      )}
    </div>
  )
}
