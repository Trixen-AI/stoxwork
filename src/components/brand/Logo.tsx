import { MARK_S_PATH, WORDMARK_CAP, WORDMARK_PATH, WORDMARK_WIDTH } from './wordmark'

/**
 * The StoxWork mark: one continuous S whose top stroke kicks up like a price tick,
 * on the brand's gold tile. Stocks, put to work. Legible down to a 16px favicon.
 */
function MarkShapes() {
  return (
    <>
      <rect width="40" height="40" rx="10" fill="var(--color-gold-bright)" />
      <path
        d={MARK_S_PATH}
        fill="none"
        stroke="var(--color-background)"
        strokeWidth="4.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
export function Logo({ className, title = 'StoxWork' }: { className?: string; title?: string }) {
  return (
    <svg className={className} viewBox={`0 0 ${W.toFixed(2)} ${MARK}`} fill="none" role="img" aria-label={title}>
      <MarkShapes />
      <g transform={`translate(${MARK + GAP} ${(MARK + WM_H) / 2}) scale(${WM_SCALE})`}>
        <path d={WORDMARK_PATH} fill="currentColor" />
      </g>
    </svg>
  )
}
