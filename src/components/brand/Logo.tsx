import { MARK_PATHS, WORDMARK_CAP, WORDMARK_PATH, WORDMARK_WIDTH } from './wordmark'

/**
 * The EquiYield mark: an E whose three bars step up like a yield curve, on the brand
 * tile. The letter and the rising chart are the same shape. Legible at 16px.
 */
function MarkShapes() {
  return (
    <>
      <rect width="40" height="40" rx="10" fill="var(--color-brand)" />
      {MARK_PATHS.map((d) => (
        <path key={d} d={d} fill="none" stroke="var(--color-background)" strokeWidth="4.4" strokeLinecap="round" />
      ))}
    </>
  )
}

export function Mark({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 40 40" fill="none" aria-hidden="true">
      <MarkShapes />
    </svg>
  )
}

const MARK = 40
const GAP = 12
const WM_SCALE = 0.6
const WM_H = WORDMARK_CAP * WM_SCALE
const W = MARK + GAP + WORDMARK_WIDTH * WM_SCALE

/** Full lockup: mark plus the outlined wordmark, on one optical centre line. */
export function Logo({ className, title = 'EquiYield' }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox={`0 0 ${W.toFixed(2)} ${MARK}`} fill="none" role="img" aria-label={title}>
      <MarkShapes />
      <g transform={`translate(${MARK + GAP} ${(MARK + WM_H) / 2}) scale(${WM_SCALE})`}>
        <path d={WORDMARK_PATH} fill="currentColor" />
      </g>
    </svg>
  )
}
