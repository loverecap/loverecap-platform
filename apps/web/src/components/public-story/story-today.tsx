'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Heart } from 'lucide-react'
import { daysBetween } from '@loverecap/utils'

interface StoryTodayProps {
  startDate: string
}

/**
 * "Hoje" section — connects past memories with the present.
 * Displays the live day counter with a soft glowing heart and a subtitle
 * that reinforces the ongoing nature of the story.
 */
export function StoryToday({ startDate }: StoryTodayProps) {
  const reduce = useReducedMotion()
  const days = daysBetween(startDate)

  const formattedDays = days.toLocaleString('pt-BR')

  return (
    <section
      className="relative overflow-hidden px-6 py-20 text-center"
      style={{
        background: 'linear-gradient(180deg, #FFF8F2 0%, #FFF0F3 40%, #FDF2F8 80%, #FFF8F2 100%)',
      }}
    >
      {/* Soft radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(255,77,109,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 max-w-xs mx-auto">
        {/* Section eyebrow */}
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.55, ease: 'easeOut' }}
          className="mb-8"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#E89AAE] mb-3">
            Hoje
          </p>
          <h2 className="font-story text-3xl font-bold text-[#2B2B2B] leading-tight">
            Ainda escrevendo<br />nossa história
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

        {/* Pulsing heart + day counter card */}
        <motion.div
          initial={reduce ? {} : { opacity: 0, scale: 0.88, y: 24 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-fit"
        >
          {/* Ambient glow ring */}
          {!reduce && (
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.3, 0.08, 0.3] }}
              transition={{ duration: 3.2, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-3xl blur-xl pointer-events-none"
              style={{ background: 'rgba(255,77,109,0.22)' }}
            />
          )}

          {/* Card */}
          <div
            className="relative rounded-3xl px-10 py-8 border"
            style={{
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              borderColor: 'rgba(248,200,220,0.5)',
              boxShadow: '0 8px 32px rgba(255,77,109,0.10), 0 1px 4px rgba(0,0,0,0.04)',
            }}
          >
            {/* Heart icon */}
            <motion.div
              animate={reduce ? {} : { scale: [1, 1.12, 1] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full"
              style={{
                background: 'linear-gradient(135deg, #FFD0DC 0%, #FFB0C8 100%)',
                boxShadow: '0 4px 16px rgba(255,77,109,0.22)',
              }}
            >
              <Heart className="h-5 w-5 fill-[#FF4D6D] text-[#FF4D6D]" />
            </motion.div>

            {/* Day counter */}
            <p
              className="font-story font-bold text-[#2B2B2B] tabular-nums leading-none mb-1"
              style={{ fontSize: 'clamp(2.5rem, 10vw, 3.5rem)' }}
            >
              {formattedDays}
            </p>
            <p className="text-sm font-medium text-[#E89AAE] tracking-wide">
              {days === 1 ? 'dia juntos' : 'dias juntos'}
            </p>
          </div>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={reduce ? {} : { opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.35, duration: 0.55, ease: 'easeOut' }}
          className="mt-7 text-sm leading-relaxed"
          style={{ color: '#7C5E6A' }}
        >
          Cada dia, um novo capítulo.<br />E o melhor ainda está por vir.
        </motion.p>
      </div>
    </section>
  )
}
