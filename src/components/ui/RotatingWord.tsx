import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { useEffect, useState } from 'react'
import { EASE_OUT_EXPO, ROTATE_INTERVAL_MS } from '@/lib/motion'

/**
 * One slot in a heading that cycles through words.
 *
 * Each word rises half its own em, un-blurring as it lands, while the outgoing one
 * leaves upward. `popLayout` takes the leaving word out of flow so the line never
 * jumps. With reduced motion it simply holds the first word.
 */
export function RotatingWord({
  words,
  className = '',
  interval = ROTATE_INTERVAL_MS,
}: {
  words: string[]
  className?: string
  interval?: number
}) {
  const [index, setIndex] = useState(0)
  const reduced = useReducedMotion()

  useEffect(() => {
    if (reduced || words.length <= 1) return
    const id = setInterval(() => setIndex((i) => (i + 1) % words.length), interval)
    return () => clearInterval(id)
  }, [reduced, interval, words.length])

  return (
    <span className="relative -mb-[0.18em] flex items-start justify-center">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={index}
          className={`inline-block pb-[0.18em] whitespace-nowrap ${className}`}
          initial={{ y: '0.55em', opacity: 0, filter: 'blur(6px)' }}
          animate={{ y: 0, opacity: 1, filter: 'blur(0px)' }}
          exit={{ y: '-0.55em', opacity: 0, filter: 'blur(6px)' }}
          transition={{ duration: 0.5, ease: EASE_OUT_EXPO }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  )
}
