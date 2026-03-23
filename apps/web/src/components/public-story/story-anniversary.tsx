'use client'

import { useMemo, useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

interface StoryAnniversaryProps {
  startDate: string
  name1: string
  name2: string
}

interface Particle {
  id: number
  x: number
  y: number
  color: string
  size: number
  angle: number
  speed: number
}

const COLORS = ['#FF4D6D', '#FF85A1', '#FFB0C8', '#FFD700', '#FF6B35', '#C8B6E2']

function createParticles(count: number): Particle[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    x: 35 + Math.random() * 30, // centered horizontally (%)
    y: 30 + Math.random() * 20, // starts mid-page (%)
    color: COLORS[i % COLORS.length]!,
    size: 4 + Math.random() * 6,
    angle: Math.random() * 360,
    speed: 60 + Math.random() * 120,
  }))
}

export function StoryAnniversary({ startDate, name1, name2 }: StoryAnniversaryProps) {
  const reduce = useReducedMotion()
  const [showConfetti, setShowConfetti] = useState(false)
  const particles = useMemo(() => createParticles(40), [])

  const { isAnniversary, years } = useMemo(() => {
    const start = new Date(startDate)
    const now = new Date()
    const same =
      start.getMonth() === now.getMonth() && start.getDate() === now.getDate()
    const y = now.getFullYear() - start.getFullYear()
    return { isAnniversary: same, years: y }
  }, [startDate])

  useEffect(() => {
    if (!isAnniversary || reduce) return
    const t = setTimeout(() => setShowConfetti(true), 400)
    return () => clearTimeout(t)
  }, [isAnniversary, reduce])

  if (!isAnniversary) return null

  return (
    <div className="relative overflow-hidden">
      {/* Confetti burst */}
      <AnimatePresence>
        {showConfetti && (
          <div className="pointer-events-none fixed inset-0 z-50" aria-hidden="true">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                className="absolute rounded-sm"
                style={{
                  left: `${p.x}%`,
                  top: `${p.y}%`,
                  width: p.size,
                  height: p.size,
                  background: p.color,
                  rotate: p.angle,
                }}
                initial={{ opacity: 1, scale: 0, y: 0 }}
                animate={{
                  opacity: [1, 1, 0],
                  scale: [0, 1, 0.8],
                  y: p.speed * -1,
                  x: (Math.random() - 0.5) * 200,
                  rotate: p.angle + 360 * (Math.random() > 0.5 ? 1 : -1),
                }}
                transition={{ duration: 1.8 + Math.random() * 0.8, ease: 'easeOut' }}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Anniversary card */}
      <motion.section
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative overflow-hidden px-6 py-14 text-center"
        style={{
          background: 'linear-gradient(135deg, #FF4D6D 0%, #FF6B87 50%, #FF8FAA 100%)',
        }}
      >
        {/* Glow blobs */}
        <div
          className="pointer-events-none absolute -top-16 -right-16 h-64 w-64 rounded-full opacity-30 blur-3xl"
          style={{ background: '#FFB0C8' }}
        />
        <div
          className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full opacity-20 blur-3xl"
          style={{ background: '#FF2E63' }}
        />

        <div className="relative z-10">
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 250, damping: 14 }}
            className="text-5xl mb-4"
          >
            🎉
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70 mb-3"
          >
            Hoje é um dia especial
          </motion.p>

          <motion.h2
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.6 }}
            className="font-story text-3xl font-bold text-white leading-snug mb-2"
          >
            Feliz aniversário,<br />
            <span className="italic">
              {name1.split(' ')[0]} & {name2.split(' ')[0]}!
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
            className="text-white/80 text-sm leading-relaxed mb-1"
          >
            {years === 1
              ? '1 ano juntos. E essa história já vale para sempre ❤️'
              : `${years} anos juntos. Que venham mais tantos ❤️`}
          </motion.p>
        </div>
      </motion.section>
    </div>
  )
}
