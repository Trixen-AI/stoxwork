import { useState, type ReactNode } from 'react'
import { Segmented } from '@/app/components/Segmented'

export type Row = { label: string; values: Array<string> }

/**
 * Wraps a chart with its title and a Chart / Table switch, so every value in the
 * chart is also reachable without hovering (the table view).
 */
export function ChartFrame({
  title,
  subtitle,
  columns,
  rows,
  children,
}: {
  title: string
  subtitle?: ReactNode
  columns: string[]
  rows: Row[]
  children: ReactNode
}) {
  const [view, setView] = useState<'chart' | 'table'>('chart')
  return (
    <div>
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h3 className="text-sm font-medium">{title}</h3>
          {subtitle ? <p className="mt-0.5 text-xs text-foreground/45">{subtitle}</p> : null}
        </div>
        <Segmented
          label={`${title} view`}
          value={view}
          onChange={setView}
          options={[
            { value: 'chart', label: 'Chart' },
            { value: 'table', label: 'Table' },
          ]}
        />
      </div>
      {view === 'chart' ? (
        children
      ) : (
        <div className="max-h-[240px] overflow-auto rounded-lg border border-foreground/[0.07]">
          <table className="w-full text-left text-xs">
            <thead className="sticky top-0 bg-card">
              <tr className="border-b border-foreground/[0.07] text-foreground/45">
                {columns.map((c, i) => (
                  <th key={c} scope="col" className={`px-3 py-2 font-medium ${i ? 'text-right' : ''}`}>
                    {c}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.label} className="border-b border-foreground/[0.04] last:border-0">
                  <th scope="row" className="px-3 py-1.5 font-normal text-foreground/60">
                    {r.label}
                  </th>
                  {r.values.map((v, i) => (
                    <td key={i} className="tnum px-3 py-1.5 text-right font-mono text-foreground/80">
                      {v}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
