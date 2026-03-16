'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface MoonSVGProps {
  phase: number // 0–1
}

// Two-circle clip technique:
// 1. Outer clipPath = moon boundary circle
// 2. "Bright" circle fills the clipped area (ivory)
// 3. "Shadow" circle overlaid, whose cx shifts based on phase
//    shadowCX = cx + r * cos(π * (1 - 2 * phase))
//    - phase=0 (new):  shadow fully covers bright
//    - phase=0.5 (full): shadow is far off screen
//    - waxing: right side revealed first
//    - waning: left side covered first

export function MoonSVG({ phase }: MoonSVGProps) {
  const reduce = useReducedMotion()
  const size = 200
  const cx = size / 2
  const cy = size / 2
  const r = 88

  // Shadow circle center x — shifts to reveal lit portion
  const shadowCX = cx + r * Math.cos(Math.PI * (1 - 2 * phase))

  // Glow radius scales with illumination
  const glowOpacity = 0.12 + phase * 0.28

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width="100%"
      height="auto"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      <defs>
        {/* Moon boundary clip */}
        <clipPath id="moon-clip">
          <circle cx={cx} cy={cy} r={r} />
        </clipPath>

        {/* Glow filter */}
        <filter id="moon-glow" x="-40%" y="-40%" width="180%" height="180%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        {/* Subtle texture gradient for the bright surface */}
        <radialGradient id="bright-surface" cx="42%" cy="38%" r="60%">
          <stop offset="0%" stopColor="#FFF8ED" />
          <stop offset="60%" stopColor="#F5E8D0" />
          <stop offset="100%" stopColor="#E8D4B0" />
        </radialGradient>

        {/* Shadow surface gradient */}
        <radialGradient id="shadow-surface" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1C2240" />
          <stop offset="100%" stopColor="#0A0B14" />
        </radialGradient>

        {/* Ambient outer glow */}
        <radialGradient id="moon-glow-grad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="rgba(245,232,208,0.35)" />
          <stop offset="60%" stopColor="rgba(245,232,208,0.08)" />
          <stop offset="100%" stopColor="rgba(245,232,208,0)" />
        </radialGradient>
      </defs>

      {/* Ambient glow behind moon */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={r + 32}
        fill="url(#moon-glow-grad)"
        animate={reduce ? {} : { opacity: [glowOpacity * 0.6, glowOpacity, glowOpacity * 0.6] }}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      />

      {/* Moon surface (clipped group) */}
      <g clipPath="url(#moon-clip)">
        {/* Lit surface — always full circle */}
        <circle cx={cx} cy={cy} r={r} fill="url(#bright-surface)" />

        {/* Shadow circle — shifts cx to reveal or cover lit side */}
        <circle cx={shadowCX} cy={cy} r={r} fill="url(#shadow-surface)" />

        {/* Subtle crater textures (decorative circles) */}
        <circle cx={cx - 18} cy={cy - 22} r={6} fill="rgba(0,0,0,0.04)" />
        <circle cx={cx + 24} cy={cy + 14} r={9} fill="rgba(0,0,0,0.035)" />
        <circle cx={cx + 8} cy={cy - 38} r={4} fill="rgba(0,0,0,0.03)" />
        <circle cx={cx - 34} cy={cy + 28} r={5} fill="rgba(0,0,0,0.025)" />
        <circle cx={cx + 30} cy={cy - 20} r={3.5} fill="rgba(0,0,0,0.04)" />
      </g>

      {/* Thin rim highlight (top-left edge) */}
      <circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.12)"
        strokeWidth={1.5}
      />
    </svg>
  )
}
