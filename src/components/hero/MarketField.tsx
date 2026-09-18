/**
 * The hero's subject: an original market field.
 *
 * A bar skyline drifts left at a constant rate while a trend line rides across it, so
 * the hero reads as a market being watched rather than a still image. The whole thing
 * is one SVG plus two CSS keyframes, drawn from the brand tokens, and it sits in the
 * same full-bleed box the page's other media sections use.
 */

// Fixed heights, not random, so the skyline is the same on every render and every
// build. 48 bars tile seamlessly: the second half repeats the first.
const BARS = [
  34, 52, 41, 63, 48, 72, 57, 44, 66, 81, 59, 47, 70, 88, 64, 51, 76, 93, 68, 55, 79, 97, 71, 58,
]

// Drawn at roughly the size it is shown, so `slice` barely scales it and the bars
// stay hairline-thin instead of blowing up into slabs.
const BAR_W = 12
const GAP = 22
const STEP = BAR_W + GAP
const SCALE_Y = 2.6
const FIELD_W = BARS.length * STEP
const BASELINE = 600
const VIEW_H = 760

/** Trend line sampled from the bar tops, so the line and the skyline agree. */
function trendPath(offset: number) {
  const pts = BARS.map((h, i) => [offset + i * STEP + BAR_W / 2, BASELINE - h * SCALE_Y * 0.92 - 30])
  let d = `M ${pts[0][0].toFixed(1)} ${pts[0][1].toFixed(1)}`
  for (let i = 1; i < pts.length; i += 1) {
    const [px, py] = pts[i - 1]
    const [x, y] = pts[i]
    const cx = (px + x) / 2
    d += ` C ${cx.toFixed(1)} ${py.toFixed(1)}, ${cx.toFixed(1)} ${y.toFixed(1)}, ${x.toFixed(1)} ${y.toFixed(1)}`
  }
  return d
}

function Field({ offset }: { offset: number }) {
  return (
    <g>
      {BARS.map((h, i) => (
        <rect
          key={`${offset}-${i}`}
          x={offset + i * STEP}
          y={BASELINE - h * SCALE_Y}
          width={BAR_W}
          height={h * SCALE_Y}
          rx={BAR_W / 2}
          fill="url(#tv-bar)"
        />
      ))}
      <path d={trendPath(offset)} fill="none" stroke="url(#tv-trend)" strokeWidth="2.6" strokeLinecap="round" />
    </g>
  )
}

export function MarketField({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        viewBox={`0 0 ${FIELD_W} ${VIEW_H}`}
        preserveAspectRatio="xMidYMid slice"
        className="h-full w-full"
      >
        <defs>
          <linearGradient id="tv-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--color-gold-bright)" stopOpacity="0.85" />
            <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0.12" />
          </linearGradient>
          <linearGradient id="tv-trend" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="var(--color-gold-bright)" stopOpacity="0" />
            <stop offset="22%" stopColor="var(--color-gold-bright)" stopOpacity="0.95" />
            <stop offset="78%" stopColor="var(--color-gold-light)" stopOpacity="0.95" />
            <stop offset="100%" stopColor="var(--color-gold-light)" stopOpacity="0" />
          </linearGradient>
          <radialGradient id="tv-glow" cx="50%" cy="72%" r="60%">
            <stop offset="0%" stopColor="var(--color-gold)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--color-gold)" stopOpacity="0" />
          </radialGradient>
        </defs>

        <rect width={FIELD_W} height={VIEW_H} fill="url(#tv-glow)" />

        {/* Two copies, one field apart: the group slides exactly one field and loops. */}
        <g style={{ animation: 'tapeSlide 42s linear infinite' }}>
          <Field offset={0} />
          <Field offset={FIELD_W} />
        </g>
      </svg>
    </div>
  )
}

export const MARKET_FIELD_WIDTH = FIELD_W
