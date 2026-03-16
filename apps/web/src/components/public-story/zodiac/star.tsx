'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface StarProps {
  cx: number
  cy: number
  size: number
  delay: number
  revealed: boolean
}

export function Star({ cx, cy, size, delay, revealed }: StarProps) {
  const reduce = useReducedMotion()

  return (
    <motion.circle
      cx={cx}
      cy={cy}
      r={size}
      fill="#F8F4EF"
      initial={{ scale: 0, opacity: 0 }}
      animate={
        revealed
          ? reduce
            ? { scale: 1, opacity: 1 }
            : { scale: [0, 1.3, 1], opacity: 1 }
          : { scale: 0, opacity: 0 }
      }
      transition={
        revealed && !reduce
          ? { type: 'spring', stiffness: 300, damping: 20, delay }
          : { duration: 0.2 }
      }
      style={{
        filter: `drop-shadow(0 0 ${size * 2}px rgba(232,154,174,0.6))`,
        transformOrigin: `${cx}px ${cy}px`,
      }}
    />
  )
}
