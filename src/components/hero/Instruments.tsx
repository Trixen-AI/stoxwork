/**
 * Hero instrumentation: the quiet layer that sits between the artwork and the copy.
 *
 * Two breathing rings, a pulsing node with its crosshair, and a pair of rules that run
 * out of it. Positions are in `vw` so the constellation scales with the viewport the
 * way the lattice behind it does.
 */
export function Instruments() {
  return (
    <div className="pointer-events-none absolute inset-0" aria-hidden="true">
      <div
        className="absolute rounded-full animate-[breathe_8s_ease-in-out_infinite]"
        style={{
          left: '63.33vw',
          top: '-2vw',
          width: '33.33vw',
          aspectRatio: '1 / 1',
          border: '1px solid var(--grid-line-strong)',
        }}
      />
      <div
        className="absolute rounded-full animate-[breathe_8s_ease-in-out_infinite_3s]"
        style={{
          left: '2.22vw',
          top: '30vw',
          width: '22.22vw',
          aspectRatio: '1 / 1',
          border: '1px solid var(--grid-line-subtle)',
        }}
      />

      {/* pulsing node at a lattice intersection, with its crosshair */}
      <div
        className="absolute rounded-full animate-[node-pulse_6s_ease-in-out_infinite]"
        style={{
          left: 'calc(11.11vw - 20px)',
          top: 'calc(11.11vw - 20px)',
          width: '40px',
          height: '40px',
          background: 'radial-gradient(circle, var(--vis-gold-mid), transparent 70%)',
        }}
      />
      <div
        className="absolute"
        style={{
          left: '11.11vw',
          top: '11.11vw',
          width: '40%',
          height: '1px',
          background: 'linear-gradient(to right, var(--grid-line-strong), transparent)',
        }}
      />
      <div
        className="absolute"
        style={{
          left: '77.77vw',
          top: '33.33vw',
          width: '1px',
          height: '22.22vw',
          background: 'linear-gradient(to bottom, var(--grid-line), transparent)',
        }}
      />
      <div className="absolute" style={{ left: '66.66vw', top: '44.44vw' }}>
        <div style={{ position: 'absolute', left: '-6px', top: '-0.5px', width: '13px', height: '1px', background: 'var(--grid-line)' }} />
        <div style={{ position: 'absolute', left: '-0.5px', top: '-6px', width: '1px', height: '13px', background: 'var(--grid-line)' }} />
      </div>

      {/* two settlement marks that twinkle out of phase */}
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-[twinkle_5s_ease-in-out_infinite]"
        style={{ left: '27.46vw', top: '33.33vw', width: '6px', height: '6px', background: 'radial-gradient(circle, var(--vis-accent-gold), transparent 70%)' }}
      />
      <div
        className="absolute -translate-x-1/2 -translate-y-1/2 rounded-full animate-[twinkle_5s_ease-in-out_infinite_2.5s]"
        style={{ left: '84.2vw', top: '18vw', width: '5px', height: '5px', background: 'radial-gradient(circle, var(--vis-accent-blue), transparent 70%)' }}
      />
    </div>
  )
}
