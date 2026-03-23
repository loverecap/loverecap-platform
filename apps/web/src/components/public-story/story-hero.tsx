'use client'

import { useEffect, useState } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'framer-motion'
import { Heart, Calendar, ChevronDown } from 'lucide-react'
import { formatDate } from '@loverecap/utils'

interface StoryHeroProps {
  partnerName1: string
  partnerName2: string
  startDate: string
  coverUrl?: string | null | undefined
}

interface Metrics {
  days: number
  hours: number
  minutes: number
}

function computeMetrics(startDate: string): Metrics {
  const diffMs = Math.max(0, Date.now() - new Date(startDate).getTime())
  return {
    days: Math.floor(diffMs / 86_400_000),
    hours: Math.floor(diffMs / 3_600_000),
    minutes: Math.floor(diffMs / 60_000),
  }
}

function AnimatedNumber({ value }: { value: number }) {
  const [display, setDisplay] = useState(0)
  const reduce = useReducedMotion()

  useEffect(() => {
    if (reduce) {
      setDisplay(value)
      return
    }
    const duration = 1800
    const start = Date.now()
    const from = 0
    const raf = (cb: FrameRequestCallback) => requestAnimationFrame(cb)
    let id: number
    const step = () => {
      const elapsed = Date.now() - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setDisplay(Math.round(from + (value - from) * eased))
      if (progress < 1) id = raf(step)
    }
    id = raf(step)
    return () => cancelAnimationFrame(id)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setDisplay(value)
  }, [value])

  return (
    <span className="tabular-nums" suppressHydrationWarning>
      {display.toLocaleString('pt-BR')}
    </span>
  )
}

const METRICS_CONFIG = [
  { icon: '❤️', label: 'dias juntos' },
  { icon: '🌙', label: 'horas' },
  { icon: '✨', label: 'minutos' },
] as const

export function StoryHero({ partnerName1, partnerName2, startDate, coverUrl }: StoryHeroProps) {
  const reduce = useReducedMotion()
  const [metrics, setMetrics] = useState<Metrics>({ days: 0, hours: 0, minutes: 0 })
  const [mounted, setMounted] = useState(false)

  const { scrollY } = useScroll()
  const bgY = useTransform(scrollY, [0, 700], [0, 200])
  const blobY = useTransform(scrollY, [0, 700], [0, 80])

  useEffect(() => {
    setMounted(true)
    setMetrics(computeMetrics(startDate))
    const interval = setInterval(() => {
      setMetrics(computeMetrics(startDate))
    }, 60_000)
    return () => clearInterval(interval)
  }, [startDate])

  const formattedStart = formatDate(startDate, 'pt-BR')
  const hasCover = Boolean(coverUrl)
  const years = Math.floor(metrics.days / 365)

  const metricValues = [metrics.days, metrics.hours, metrics.minutes]

  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden"
      style={{
        ...(!hasCover
          ? { background: 'linear-gradient(180deg, #FFF8F2 0%, #F8C8DC 45%, #F5E9E2 75%, #FFF8F2 100%)' }
          : {}),
      }}
    >
      
      {hasCover && coverUrl && (
        <>
          <motion.div
            className="absolute inset-0 bg-cover bg-center scale-110"
            style={{ backgroundImage: `url(${coverUrl})`, y: reduce ? 0 : bgY }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/30 via-black/35 to-black/65" />
        </>
      )}

      {!hasCover && (
        <motion.div
          className="pointer-events-none absolute inset-0"
          style={{ y: reduce ? 0 : blobY }}
        >
          <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-[#F8C8DC]/35 -translate-y-1/2 translate-x-1/3 blur-3xl" />
          <div className="absolute bottom-0 left-0 w-72 h-72 rounded-full bg-[#FFE0E8]/22 -translate-x-1/3 -translate-y-1/4 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full bg-[#FFF0F3]/60 blur-3xl" />
        </motion.div>
      )}

      {hasCover && (
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 pointer-events-none z-2"
          style={{ height: 80, background: 'linear-gradient(to bottom, transparent, #FFF8F2)' }}
        />
      )}

      <div className="relative z-10 flex flex-col items-center text-center px-6 py-20 w-full max-w-2xl mx-auto">
        
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="flex items-center gap-2.5 mb-6"
        >
          <div className={`h-px w-8 ${hasCover ? 'bg-white/40' : 'bg-[#E89AAE]/50'}`} />
          <span className={`text-[10px] font-semibold uppercase tracking-[0.22em] ${hasCover ? 'text-white/75' : 'text-[#E89AAE]'}`}>
            Uma história de amor
          </span>
          <div className={`h-px w-8 ${hasCover ? 'bg-white/40' : 'bg-[#E89AAE]/50'}`} />
        </motion.div>

        <motion.h1
          initial={reduce ? {} : { opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.32, duration: 0.8, ease: 'easeOut' }}
          className={`font-story text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight mb-10 ${hasCover ? 'text-white' : 'text-[#2B2B2B]'}`}
        >
          {partnerName1}
          <span className={`block italic ${hasCover ? 'text-[#FFB0C8]' : 'text-[#FF4D6D]'}`}>
            &amp; {partnerName2}
          </span>
        </motion.h1>

        {mounted && (
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-wrap items-stretch justify-center gap-3 mb-6 w-full"
          >
            {METRICS_CONFIG.map((cfg, i) => (
              <motion.div
                key={cfg.label}
                initial={reduce ? {} : { opacity: 0, y: 16, scale: 0.92 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: 0.55 + i * 0.1, duration: 0.5, ease: 'easeOut' }}
                className={`flex flex-col items-center gap-0.5 rounded-2xl px-5 py-4 min-w-25 ${
                  hasCover
                    ? 'bg-white/15 backdrop-blur-md text-white border border-white/20'
                    : 'bg-white/80 backdrop-blur-sm shadow-sm text-[#2B2B2B] border border-[#F0ECE8]'
                }`}
              >
                <span className="text-xl leading-none mb-1" aria-hidden="true">{cfg.icon}</span>
                <span className={`text-2xl font-bold tabular-nums leading-none ${hasCover ? 'text-white' : 'text-[#2B2B2B]'}`}>
                  <AnimatedNumber value={metricValues[i] ?? 0} />
                </span>
                <span className={`text-[10px] font-medium uppercase tracking-wide mt-0.5 ${hasCover ? 'text-white/65' : 'text-[#6B6B6B]'}`}>
                  {cfg.label}
                </span>
              </motion.div>
            ))}
          </motion.div>
        )}

        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.78, duration: 0.5 }}
          className={`flex items-center gap-2 text-sm mb-6 ${hasCover ? 'text-white/70' : 'text-[#6B6B6B]'}`}
        >
          <Calendar className="h-3.5 w-3.5 shrink-0 text-[#E89AAE]" />
          <span>Desde {formattedStart}</span>
        </motion.div>

        {years > 0 && (
          <motion.div
            initial={reduce ? {} : { opacity: 0, scale: 0.75 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, type: 'spring', stiffness: 200, damping: 14 }}
            className="inline-flex items-center gap-2 bg-[#FF4D6D] text-white text-xs font-semibold px-5 py-2 rounded-full shadow-lg shadow-[#FF4D6D]/35"
          >
            <Heart className="h-3 w-3 fill-white text-white" />
            <span>{years} {years === 1 ? 'ano' : 'anos'} de amor</span>
          </motion.div>
        )}
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1"
      >
        <span className={`text-[9px] uppercase tracking-widest ${hasCover ? 'text-white/50' : 'text-neutral-400'}`}>
          Rolar
        </span>
        <motion.div
          animate={reduce ? {} : { y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <ChevronDown className={`h-5 w-5 ${hasCover ? 'text-white/50' : 'text-neutral-400'}`} />
        </motion.div>
      </motion.div>
    </motion.section>
  )
}
