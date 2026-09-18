import { useId, useState } from 'react'
import { shortDate } from '@/lib/format'
import { niceTicks, useWidth } from './useWidth'

const H = 200 // plot height
const AXIS = 24 // x-axis band, inside the container so nothing clips
const PAD = { l: 44, r: 12, t: 8 }

/**
 * One series over time. 2px line, a 10% wash under it, solid hairline grid, and a
 * crosshair that snaps to the nearest day and reports the value first.
 */
export function AreaChart({
  dates,
  values,
  format,
  color = 'var(--chart-1)',
  seriesLabel,
}: {
  dates: Date[]
  values: number[]
  format: (n: number) => string
  color?: string
  seriesLabel: string
}) {
  const { ref, width } = useWidth<HTMLDivElement>()
  const [hover, setHover] = useState<number | null>(null)
  const gradId = useId()

  const ticks = niceTicks(Math.max(...values) * 1.05)
  const top = ticks[ticks.length - 1]
  const plotW = Math.max(10, width - PAD.l - PAD.r)
  const x = (i: number) => PAD.l + (i / Math.max(1, values.length - 1)) * plotW
  const y = (v: number) => PAD.t + H - (v / top) * H

  const line = values.map((v, i) => `${i ? 'L' : 'M'}${x(i).toFixed(1)} ${y(v).toFixed(1)}`).join(' ')
  const area = `${line} L${x(values.length - 1).toFixed(1)} ${y(0)} L${x(0).toFixed(1)} ${y(0)} Z`

  const onMove = (clientX: number, rect: DOMRect) => {
    const rel = (clientX - rect.left - PAD.l) / plotW
    setHover(Math.min(values.length - 1, Math.max(0, Math.round(rel * (values.length - 1)))))
  }

  const last = values.length - 1
  const hi = hover ?? null
  // label a few dates only: first, middle, last
  const dateTicks = [0, Math.floor(last / 2), last]

  return (
    <div ref={ref} className="relative w-full select-none">
      <svg
        width={width}
        height={H + PAD.t + AXIS}
        role="img"
        aria-label={`${seriesLabel}: ${format(values[last])} today`}
        onPointerMove={(e) => onMove(e.clientX, e.currentTarget.getBoundingClientRect())}
        onPointerLeave={() => setHover(null)}
        className="block touch-pan-y"
      >
        <defs>
          <linearGradient id={gradId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.14" />
            <stop offset="100%" stopColor={color} stopOpacity="0.02" />
          </linearGradient>
        </defs>

        {ticks.map((t) => (
          <g key={t}>
            <line x1={PAD.l} x2={width - PAD.r} y1={y(t)} y2={y(t)} stroke="var(--grid-line-faint)" strokeWidth="1" />
            <text x={PAD.l - 8} y={y(t)} dy="0.32em" textAnchor="end" className="fill-foreground/35 font-mono text-[10px]">
              {format(t)}
            </text>
          </g>
        ))}

        <path d={area} fill={`url(#${gradId})`} />
        <path d={line} fill="none" stroke={color} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />

        {/* end marker, ringed in the surface colour */}
        <circle cx={x(last)} cy={y(values[last])} r="4" fill={color} stroke="var(--color-card)" strokeWidth="2" />

        {dateTicks.map((i) => (
          <text
            key={i}
            x={x(i)}
            y={H + PAD.t + 16}
            textAnchor={i === 0 ? 'start' : i === last ? 'end' : 'middle'}
            className="fill-foreground/35 font-mono text-[10px]"
          >
            {shortDate(dates[i])}
          </text>
        ))}

        {hi !== null ? (
          <g pointerEvents="none">
            <line x1={x(hi)} x2={x(hi)} y1={PAD.t} y2={PAD.t + H} stroke="var(--grid-line-strong)" strokeWidth="1" />
            <circle cx={x(hi)} cy={y(values[hi])} r="4" fill={color} stroke="var(--color-card)" strokeWidth="2" />
          </g>
        ) : null}
      </svg>

      {hi !== null ? (
        <div
          className="pointer-events-none absolute top-0 rounded-lg border border-foreground/10 bg-background/95 px-3 py-2 shadow-lg shadow-black/40"
          style={{
            left: Math.min(Math.max(x(hi) - 70, 0), width - 140),
            width: 140,
          }}
        >
          <p className="tnum font-mono text-sm font-medium text-foreground">{format(values[hi])}</p>
          <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-foreground/50">
            <span aria-hidden="true" className="inline-block h-0.5 w-3 rounded-full" style={{ background: color }} />
            {seriesLabel} · {shortDate(dates[hi])}
          </p>
        </div>
      ) : null}
    </div>
  )
}
