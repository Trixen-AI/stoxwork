import type { ReactNode } from 'react'
import { GridOverlay } from './GridOverlay'

/**
 * The page's one media construction, used by the hero and by the closing section.
 *
 * Layers, back to front: a base gradient, the artwork, a brand tint in multiply, the
 * container-query lattice, then a radial vignette that pulls the centre back down so
 * type stays readable on top.
 */
export function MediaStack({
  children,
  columns,
  rows,
  className = '',
}: {
  children: ReactNode
  columns: number
  rows: number
  className?: string
}) {
  return (
    <div style={{ containerType: 'inline-size' }} className={`relative h-full w-full overflow-hidden ${className}`}>
      <div className="absolute inset-0" style={{ background: 'var(--hero-base)' }} />
      <div className="absolute inset-0">
        {children}
        <div className="absolute inset-0" style={{ background: 'var(--hero-tint)', mixBlendMode: 'multiply' }} />
      </div>
      <GridOverlay columns={columns} rows={rows} />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0"
        style={{ background: 'radial-gradient(ellipse 75% 70% at 50% 50%, transparent 30%, var(--hero-vignette) 100%)' }}
      />
    </div>
  )
}
