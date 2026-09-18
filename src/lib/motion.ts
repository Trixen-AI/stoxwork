import type { Variants } from 'motion/react'

/** Section children rise 16px and fade as the section scrolls into view. */
export const riseIn: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: { opacity: 1, y: 0 },
}

/** Applied to the section wrapper: one observer, children staggered 60ms apart. */
export const sectionReveal = {
  initial: 'hidden' as const,
  whileInView: 'visible' as const,
  viewport: { once: true, margin: '-100px' },
  transition: { staggerChildren: 0.06 },
}

export const childTransition = { duration: 0.4 }

/** The ease every deliberate entrance uses. */
export const EASE_OUT_EXPO = [0.22, 1, 0.36, 1] as const

export const ROTATE_INTERVAL_MS = 2200
