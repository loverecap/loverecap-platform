'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Lock, Unlock } from 'lucide-react'

interface StoryFutureMessageProps {
  message: string
  revealAt: string   // ISO timestamp (UTC)
  hintText?: string | null | undefined
}

interface Countdown {
  days: number
  hours: number
  minutes: number
  seconds: number
}

function computeCountdown(revealAt: string): Countdown {
  const diff = Math.max(0, new Date(revealAt).getTime() - Date.now())
  const totalSec = Math.floor(diff / 1000)
  return {
    days:    Math.floor(totalSec / 86400),
    hours:   Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  }
}

function pad(n: number) {
  return String(n).padStart(2, '0')
}

function ConfettiHeart({ delay, x }: { delay: number; x: number }) {
  return (
    <motion.span
      className="absolute text-lg pointer-events-none select-none"
      style={{ left: `${x}%`, top: '50%' }}
      initial={{ opacity: 0, y: 0, scale: 0 }}
      animate={{ opacity: [0, 1, 1, 0], y: -120, scale: [0, 1.2, 1, 0.8] }}
      transition={{ delay, duration: 1.6, ease: 'easeOut' }}
    >
      ❤️
    </motion.span>
  )
}

const CONFETTI_POSITIONS = [10, 25, 40, 55, 70, 85]

export function StoryFutureMessage({ message, revealAt, hintText }: StoryFutureMessageProps) {
  const reduce = useReducedMotion()
  const [unlocked, setUnlocked] = useState(false)
  const [countdown, setCountdown] = useState<Countdown>({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [revealed, setRevealed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const isUnlocked = new Date(revealAt).getTime() <= Date.now()
    setUnlocked(isUnlocked)
    if (isUnlocked) {
      return
    }
    setCountdown(computeCountdown(revealAt))
    const interval = setInterval(() => {
      const cd = computeCountdown(revealAt)
      setCountdown(cd)
      if (cd.days === 0 && cd.hours === 0 && cd.minutes === 0 && cd.seconds === 0) {
        setUnlocked(true)
        clearInterval(interval)
      }
    }, 1000)
    return () => clearInterval(interval)
  }, [revealAt])

  if (!mounted) return null

  const revealDate = new Date(revealAt).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  return (
    <motion.section
      initial={reduce ? {} : { opacity: 0, y: 32 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.65, ease: 'easeOut' }}
      className="relative px-5 py-24 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF8F2 0%, #F5E9E2 40%, #FFF0F3 70%, #FFF8F2 100%)' }}
    >
      {/* Subtle background blobs */}
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-[#F8C8DC]/25 -translate-y-1/3 translate-x-1/4 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-64 h-64 rounded-full bg-[#C8B6E2]/15 translate-y-1/3 -translate-x-1/4 blur-3xl pointer-events-none" />

      <div className="relative max-w-md mx-auto text-center">
        {/* Section label */}
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#C8B6E2] mb-3">
          ✦ Mensagem do futuro ✦
        </p>
        <h2 className="font-story text-2xl font-bold text-[#2B2B2B] mb-8 sm:text-3xl">
          {hintText ?? 'Uma mensagem aguarda por você'}
        </h2>

        <AnimatePresence mode="wait">
          {/* ── LOCKED STATE ── */}
          {!unlocked && (
            <motion.div
              key="locked"
              initial={reduce ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? {} : { opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl bg-white border border-[#F0ECE8] p-8 shadow-sm"
            >
              {/* Lock icon */}
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#F5E9E2]">
                <Lock className="h-7 w-7 text-[#E89AAE]" />
              </div>

              <p className="text-sm text-[#6B6B6B] mb-6 leading-relaxed">
                Esta mensagem será revelada em{' '}
                <span className="font-semibold text-[#2B2B2B]">{revealDate}</span>
              </p>

              {/* Countdown */}
              <div className="flex items-center justify-center gap-3 flex-wrap">
                {[
                  { value: countdown.days,    label: 'dias' },
                  { value: countdown.hours,   label: 'horas' },
                  { value: countdown.minutes, label: 'min' },
                  { value: countdown.seconds, label: 'seg' },
                ].map((item) => (
                  <div key={item.label} className="flex flex-col items-center">
                    <span
                      className="text-2xl font-bold tabular-nums text-[#2B2B2B] leading-none bg-[#FFF0F3] rounded-xl px-3 py-2 min-w-14 text-center"
                      suppressHydrationWarning
                    >
                      {pad(item.value)}
                    </span>
                    <span className="text-[9px] uppercase tracking-widest text-[#6B6B6B] mt-1.5">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          )}

          {/* ── UNLOCKED STATE (not yet revealed) ── */}
          {unlocked && !revealed && (
            <motion.div
              key="unlocked"
              initial={reduce ? {} : { opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={reduce ? {} : { opacity: 0, scale: 0.92 }}
              transition={{ duration: 0.4 }}
              className="rounded-3xl bg-white border border-[#F0ECE8] p-8 shadow-sm"
            >
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0F3]">
                <Unlock className="h-7 w-7 text-[#FF4D6D]" />
              </div>

              <p className="text-sm text-[#6B6B6B] mb-6 leading-relaxed">
                Chegou o momento! A mensagem está pronta para você.
              </p>

              <motion.button
                whileHover={reduce ? {} : { scale: 1.04, boxShadow: '0 12px 28px rgba(255,77,109,0.32)' }}
                whileTap={reduce ? {} : { scale: 0.97 }}
                onClick={() => setRevealed(true)}
                className="bg-[#FF4D6D] text-white px-8 py-3.5 rounded-full text-sm font-semibold shadow-md shadow-[#FF4D6D]/25 cursor-pointer"
              >
                Revelar mensagem 💌
              </motion.button>
            </motion.div>
          )}

          {/* ── REVEALED STATE ── */}
          {unlocked && revealed && (
            <motion.div
              key="revealed"
              initial={reduce ? {} : { opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ type: 'spring', stiffness: 180, damping: 18 }}
              className="relative rounded-3xl bg-white border border-[#F0ECE8] overflow-hidden shadow-lg"
            >
              {/* Top accent bar */}
              <div
                className="h-1.5 w-full"
                style={{ background: 'linear-gradient(90deg, #FF4D6D, #E89AAE, #C8B6E2)' }}
              />

              {/* Confetti hearts */}
              {!reduce && (
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                  {CONFETTI_POSITIONS.map((x, i) => (
                    <ConfettiHeart key={x} delay={i * 0.12} x={x} />
                  ))}
                </div>
              )}

              <div className="p-8 pt-7">
                <motion.div
                  initial={reduce ? {} : { scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 280, damping: 14, delay: 0.1 }}
                  className="text-4xl mb-5 select-none"
                >
                  💌
                </motion.div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E89AAE] mb-4">
                  Mensagem do futuro
                </p>

                <motion.p
                  initial={reduce ? {} : { opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="font-story text-lg text-[#2B2B2B] leading-relaxed"
                >
                  {message}
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  )
}
