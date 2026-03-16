'use client'

import { useEffect, useRef } from 'react'
import { motion, useReducedMotion } from 'framer-motion'

interface ConnectionLineProps {
  x1: number
  y1: number
  x2: number
  y2: number
  delay: number
  revealed: boolean
}

export function ConnectionLine({ x1, y1, x2, y2, delay, revealed }: ConnectionLineProps) {
  const reduce = useReducedMotion()
  const pathRef = useRef<SVGLineElement>(null)
  const length = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)

  // We use stroke-dashoffset animation via Framer Motion
  // Framer handles the SVG attribute animation directly
  return (
    <motion.line
      ref={pathRef}
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke="rgba(255,77,109,0.45)"
      strokeWidth={1}
      strokeLinecap="round"
      strokeDasharray={length}
      initial={{ strokeDashoffset: length, opacity: 0 }}
      animate={
        revealed
          ? { strokeDashoffset: 0, opacity: 1 }
          : { strokeDashoffset: length, opacity: 0 }
      }
      transition={
        revealed && !reduce
          ? { duration: 0.6, ease: 'easeOut', delay }
          : { duration: 0.15 }
      }
    />
  )
}
