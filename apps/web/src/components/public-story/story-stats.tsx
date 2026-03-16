'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Heart, ImageIcon, Music2, Sparkles } from 'lucide-react'
import { daysBetween } from '@loverecap/utils'

interface StoryStatsProps {
  startDate: string
  memoriesCount: number
  musicTrack?: string | null
  photosCount?: number | undefined
}

interface StatCardProps {
  icon: React.ReactNode
  value: string
  label: string
  delay: number
  accent?: string | undefined
}

const CARD_GRADIENTS = [
  'linear-gradient(135deg, #FF4D6D 0%, #FF85A1 100%)',
  'linear-gradient(135deg, #E89AAE 0%, #C8B6E2 100%)',
  'linear-gradient(135deg, #FFB0C8 0%, #FF4D6D 100%)',
  'linear-gradient(135deg, #C8B6E2 0%, #9B8FA0 100%)',
]

function StatCard({ icon, value, label, delay, accent }: StatCardProps) {
  const reduce = useReducedMotion()

  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y: 28, scale: 0.94 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className="relative overflow-hidden rounded-2xl p-5 text-center flex flex-col items-center gap-2"
      style={{
        background: accent ?? CARD_GRADIENTS[0],
        boxShadow: '0 4px 20px rgba(255,77,109,0.18), 0 1px 4px rgba(0,0,0,0.06)',
      }}
    >
      {/* Subtle noise texture overlay for depth */}
      <div
        className="absolute inset-0 pointer-events-none rounded-2xl"
        style={{ opacity: 0.04, backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 200 200\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23n)\'/%3E%3C/svg%3E")' }}
      />

      {/* Icon */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
        {icon}
      </div>

      {/* Value */}
      <p
        className="font-story font-bold text-white leading-none tabular-nums"
        style={{ fontSize: 'clamp(1.75rem, 8vw, 2.5rem)' }}
      >
        {value}
      </p>

      {/* Label */}
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-white/75 leading-tight">
        {label}
      </p>
    </motion.div>
  )
}

/**
 * "Estatísticas do Amor" — shareable stats section.
 * Designed to look great in a screenshot (Spotify Wrapped aesthetic):
 * high-contrast gradient cards, large numbers, minimal text.
 */
export function StoryStats({ startDate, memoriesCount, musicTrack, photosCount }: StoryStatsProps) {
  const reduce = useReducedMotion()
  const days = daysBetween(startDate)
  const formattedDays = days.toLocaleString('pt-BR')

  const stats: StatCardProps[] = [
    {
      icon: <Heart className="h-5 w-5 fill-white text-white" />,
      value: formattedDays,
      label: 'Dias juntos',
      delay: 0,
      accent: CARD_GRADIENTS[0],
    },
    {
      icon: <Sparkles className="h-5 w-5 text-white" />,
      value: String(memoriesCount),
      label: 'Memórias criadas',
      delay: 0.08,
      accent: CARD_GRADIENTS[1],
    },
    ...(musicTrack
      ? [
          {
            icon: <Music2 className="h-5 w-5 text-white" />,
            value: '♪',
            label: musicTrack,
            delay: 0.16,
            accent: CARD_GRADIENTS[2],
          } satisfies StatCardProps,
        ]
      : []),
    ...(photosCount && photosCount > 0
      ? [
          {
            icon: <ImageIcon className="h-5 w-5 text-white" />,
            value: String(photosCount),
            label: 'Fotos compartilhadas',
            delay: musicTrack ? 0.24 : 0.16,
            accent: CARD_GRADIENTS[3],
          } satisfies StatCardProps,
        ]
      : []),
  ]

  return (
    <section
      className="relative overflow-hidden px-5 py-20"
      style={{
        background: 'linear-gradient(180deg, #FFF8F2 0%, #F5E9E2 50%, #FFF8F2 100%)',
      }}
    >
      {/* Background ambient blobs */}
      <div
        className="absolute -top-20 -left-20 h-64 w-64 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(255,176,200,0.25) 0%, transparent 70%)',
          filter: 'blur(40px)',
        }}
      />
      <div
        className="absolute -bottom-16 -right-16 h-56 w-56 rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(circle, rgba(200,182,226,0.22) 0%, transparent 70%)',
          filter: 'blur(36px)',
        }}
      />

      <div className="relative z-10 max-w-xs mx-auto">
        {/* Section header */}
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="text-center mb-8"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#E89AAE] mb-3">
            Nossa história em números
          </p>
          <h2 className="font-story text-3xl font-bold text-[#2B2B2B] leading-tight">
            Estatísticas<br />do Amor
          </h2>
          <motion.div
            initial={reduce ? {} : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 mx-auto w-10 h-px"
            style={{
              background: 'linear-gradient(to right, transparent, #FF4D6D, transparent)',
            }}
          />
        </motion.div>

        {/* Stats grid */}
        <div
          className={
            stats.length >= 4
              ? 'grid grid-cols-2 gap-3'
              : stats.length === 3
                ? 'grid grid-cols-2 gap-3'
                : 'grid grid-cols-1 gap-3'
          }
        >
          {stats.map((stat) => (
            <StatCard key={stat.label} {...stat} />
          ))}
        </div>

      </div>
    </section>
  )
}
