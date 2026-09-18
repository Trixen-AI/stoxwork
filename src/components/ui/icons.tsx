/** Hand-drawn inline icons. One stroke weight, one cap style, one 24u grid. */
type IconProps = { className?: string }

export function ArrowRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden="true">
      <path d="M2 6h8M6.8 2.8 10 6l-3.2 3.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function ArrowUpRight({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3.5 2H10v6.5M10 2 2 10" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function Chevron({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M3 5l3 3 3-3" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

/** Guard icons: a live feed, a capped meter, a paused shield. */
export function FeedIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M3 14.5h3.2l2.1-6 3.1 11 2.4-8 1.7 3h5.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export function CapIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="3.5" y="9.5" width="17" height="11" rx="2.5" />
      <path d="M3.5 6.5h17" strokeLinecap="round" />
      <path d="M8.5 14.5h7" strokeLinecap="round" />
    </svg>
  )
}

export function PauseIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 2.8 20 6v6.1c0 4.6-3.2 7.9-8 9.1-4.8-1.2-8-4.5-8-9.1V6l8-3.2Z" strokeLinejoin="round" />
      <path d="M10 9.8v4.4M14 9.8v4.4" strokeLinecap="round" />
    </svg>
  )
}

export function LockIcon({ className }: IconProps) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <rect x="4.5" y="10.5" width="15" height="10" rx="2.5" />
      <path d="M8 10.5V7.8a4 4 0 0 1 8 0v2.7" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Social marks. X only, using the official X mark (path copied unmodified from
 * src/assets/social/x.svg, source listed in SOURCES.md), recoloured via
 * currentColor as the X brand guidelines allow for single-colour use.
 */
export function SocialIcon({ name, className }: { name: string; className?: string }) {
  if (name !== 'x') return null
  return (
    <svg className={className} viewBox="0 0 300 271" fill="currentColor" aria-hidden="true">
      <path d="m236 0h46l-101 115 118 156h-92.6l-72.5-94.8-83 94.8h-46l107-123-113-148h94.9l65.5 86.6zm-16.1 244h25.5l-165-218h-27.4z" />
    </svg>
  )
}
