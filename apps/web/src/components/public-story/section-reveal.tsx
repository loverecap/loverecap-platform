'use client'

import { motion, useReducedMotion } from 'framer-motion'

/**
 * Shared entrance wrapper for all story sections.
 *
 * Rules applied (UI-UX-Pro-Max §7):
 *   - transform/opacity only (no width/height) → no CLS
 *   - ease-out enter: custom [0.22, 1, 0.36, 1] — natural deceleration
 *   - 600ms duration for section-level reveals (cinematic, not jarring)
 *   - amount 0.05: fires when 5% of the element enters the viewport — avoids
 *     iOS Safari bug where negative rootMargin prevents IntersectionObserver
 *   - once: true — sections never re-animate on scroll back
 *   - prefers-reduced-motion: skips all transforms, content is instant
 *   - opacity never lingers below 0.2 (fades fully in one shot)
 */

interface SectionRevealProps {
  children: React.ReactNode
  /** Extra delay in seconds. Use only for elements that need choreographic offset. */
  delay?: number
  className?: string
}

export function SectionReveal({ children, delay = 0, className }: SectionRevealProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{
        duration: 0.6,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
    >
      {children}
    </motion.div>
  )
}
