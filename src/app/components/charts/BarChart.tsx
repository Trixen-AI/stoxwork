import { useState } from 'react'
import { niceTicks, useWidth } from './useWidth'

const H = 180
const AXIS = 24
const PAD = { l: 44, r: 8, t: 8 }
const MAX_BAR = 24
const R = 4

/** A column whose top corners are rounded 4px and whose base stays square. */
function column(x: number, y: number, w: number, h: number) {
  const r = Math.min(R, w / 2, h)
  return `M${x} ${y + h}V${y + r}Q${x} ${y} ${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h}Z`
}

/**
 * One series of columns from a single baseline. Bars are capped at 24px wide with
 * the leftover band as air; each bar is its own hover target (the whole band, not
 * only the painted pixels).
 */
export function BarChart({
  labels,
  values,
  format,
  seriesLabel,
  color = 'var(--chart-1)',
  tickEvery = 1,
}: {
  labels: string[]
  values: number[]
  format: (n: number) => string
  seriesLabel: string
  color?: string
  /** Show every n-th x label, so dense series stay legible. */
  tickEvery?: number
}) {
  const { ref, width } = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)

  const ticks = niceTicks(Math.max(...values) * 1.05)
  const top = ticks[ticks.length - 1]
  const plotW = Math.max(10, width - PAD.l - PAD.r)
  const band = plotW / values.length
  const barW = Math.max(2, Math.min(MAX_BAR, band - 2)) // at least a 2px surface gap
  const y = (v: number) => PAD.t + H - (v / top) * H

  return (
    <div ref={ref} className="relative w-full select-none">
      <svg width={width} height={H + PAD.t + AXIS} role="img" aria-label={seriesLabel} className="block">
        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={width - PAD.r} y1={y(t)} y2={y(t)} stroke="var(--grid-line-faint)" strokeWidth="1" />
            <text x={PAD.l - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-foreground/35 font-mono text-[10px]">
              {format(t)}
            </text>
          </g>
        ))}

        {values.map((v, i) => {
          const bx = PAD.l + i * band + (band - barW) / 2
          const by = y(v)
          const h = Math.max(0, PAD.t + H - by)
          return (
            <g key={labels[i]}>
              <path d={column(bx, by, barW, h)} fill={color} opacity={hover === null || hover === i ? 1 : 0.45} />
              <rect
                x={PAD.l + i * band}
                y={PAD.t}
                width={band}
                height={H}
                fill="transparent"
                tabIndex={0}
                aria-label={`${labels[i]}: ${format(v)}`}
                onPointerEnter={() => setHover(i)}
                onPointerLeave={() => setHover(null)}
                onFocus={() => setHover(i)}
                onBlur={() => setHover(null)}
                className="outline-none"
              />
              {i % tickEvery === 0 || i === values.length - 1 ? (
                <text x={PAD.l + i * band + band / 2} y={H + PAD.t + 16} textAnchor="middle" className="fill-foreground/35 font-mono text-[10px]">
                  {labels[i]}
                </text>
              ) : null}
            </g>
          )
        })}
      </svg>

      {hover !== null ? (
        <div
          className="pointer-events-none absolute top-0 rounded-lg border border-foreground/10 bg-background/95 px-3 py-2 shadow-lg shadow-black/40"
          style={{ left: Math.min(Math.max(PAD.l + hover * band + band / 2 - 65, 0), width - 130), width: 130 }}
        >
          <p className="tnum font-mono text-sm font-medium">{format(values[hover])}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-foreground/50">
            <span aria-hidden="true" className="inline-block h-2 w-2 rounded-[2px]" style={{ background: color }} />
            {seriesLabel} · {labels[hover]}
          </p>
        </div>
      ) : null}
    </div>
  )
}
