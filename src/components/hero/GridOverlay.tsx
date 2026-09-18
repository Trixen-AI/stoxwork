/**
 * Container-query lattice.
 *
 * Cells are square in container units, so the grid keeps its rhythm at any width
 * without a media query: N columns across, rows sized `100cqw / N`.
 */
export function GridOverlay({ columns, rows, tone = 'strong' }: { columns: number; rows: number; tone?: 'strong' | 'faint' }) {
  const line = tone === 'strong' ? 'var(--grid-line-strong)' : 'var(--grid-line-faint)'
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${columns}, 1fr)`,
        gridAutoRows: `calc(100cqw / ${columns})`,
      }}
    >
      {Array.from({ length: columns * rows }, (_, i) => (
        <div key={i} style={{ borderRight: `1px solid ${line}`, borderBottom: `1px solid ${line}` }} />
      ))}
    </div>
  )
}
