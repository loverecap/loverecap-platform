'use client'

import { useMemo, useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { getZodiacSign } from './zodiac/zodiac-utils'
import { CONSTELLATION_MAP } from './zodiac/constellation-data'
import { ConstellationSVG } from './zodiac/constellation-svg'

interface StoryZodiacProps {
  startDate: string
}

const NEBULA_STYLE = `
  @keyframes nebula-drift {
    0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.12; }
    50% { transform: translate(8px, -6px) scale(1.05); opacity: 0.2; }
  }
  @keyframes star-twinkle-z {
    0%, 100% { opacity: 0.12; }
    50% { opacity: 0.55; }
  }
`

const BG_STARS = [
  { x: 5,  y: 20, s: 1.2, d: 2.1 },
  { x: 92, y: 10, s: 1.0, d: 2.8 },
  { x: 78, y: 35, s: 1.5, d: 1.9 },
  { x: 15, y: 50, s: 1.3, d: 3.2 },
  { x: 88, y: 55, s: 1.1, d: 2.5 },
  { x: 60, y: 15, s: 1.8, d: 1.7 },
  { x: 25, y: 80, s: 1.4, d: 3.0 },
  { x: 70, y: 85, s: 1.2, d: 2.3 },
  { x: 10, y: 90, s: 1.0, d: 2.7 },
  { x: 50, y: 92, s: 1.6, d: 1.8 },
]

export function StoryZodiac({ startDate }: StoryZodiacProps) {
  const reduce = useReducedMotion()
  const zodiac = useMemo(() => getZodiacSign(startDate), [startDate])
  const constellation = CONSTELLATION_MAP[zodiac.sign]

  const [revealed, setRevealed] = useState(false)

  if (!constellation) return null

  return (
    <section
      aria-label="Constelação do zodíaco"
      style={{
        background:
          'linear-gradient(180deg,' +
          '#0A0B14 0%,' +
          '#0A0B14 60%,' +
          '#1D0A14 68%,' +
          '#621529 75%,' +
          '#C87090 83%,' +
          '#F9E5EE 91%,' +
          '#FFF8F2 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <style>{NEBULA_STYLE}</style>

      <div aria-hidden="true" style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
        {BG_STARS.map((star, i) => (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: `${star.x}%`,
              top: `${star.y}%`,
              width: star.s,
              height: star.s,
              borderRadius: '50%',
              backgroundColor: '#F8F4EF',
              animation: reduce ? 'none' : `star-twinkle-z ${star.d}s ease-in-out infinite`,
              animationDelay: `${i * 0.22}s`,
            }}
          />
        ))}
      </div>

      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          pointerEvents: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            left: '10%',
            top: '25%',
            width: '45%',
            height: '50%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(255,77,109,0.07) 0%, transparent 70%)',
            animation: reduce ? 'none' : 'nebula-drift 10s ease-in-out infinite',
          }}
        />
        <div
          style={{
            position: 'absolute',
            right: '8%',
            top: '30%',
            width: '40%',
            height: '45%',
            borderRadius: '50%',
            background: 'radial-gradient(ellipse, rgba(232,154,174,0.09) 0%, transparent 70%)',
            animation: reduce ? 'none' : 'nebula-drift 12s ease-in-out infinite reverse',
            animationDelay: '3s',
          }}
        />
      </div>

      <div className="relative z-10 px-5 py-24 max-w-lg mx-auto">
        
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          onViewportEnter={() => setRevealed(true)}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-10"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#E89AAE] mb-3">
            ✦ As estrelas estavam com vocês ✦
          </p>
          <h2 className="font-story text-2xl font-bold leading-tight sm:text-3xl" style={{ color: '#F8F4EF' }}>
            O céu pertencia a{' '}
            <span style={{ color: '#E89AAE' }}>{zodiac.name_pt}</span>
          </h2>
          <motion.div
            initial={reduce ? {} : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.35, duration: 0.5 }}
            className="mt-4 mx-auto w-14 h-px"
            style={{ background: 'linear-gradient(to right, transparent, rgba(255,77,109,0.6), transparent)' }}
          />
        </motion.div>

        <motion.div
          initial={reduce ? {} : { opacity: 0, scale: 0.9 }}
          whileInView={reduce ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.7, ease: 'easeOut', delay: 0.1 }}
          className="mx-auto mb-8"
          style={{ maxWidth: 320 }}
        >
          <ConstellationSVG data={constellation} revealed={revealed} />
        </motion.div>

        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 24 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.3 }}
          className="rounded-3xl px-6 py-6"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
          }}
        >
          
          <div className="flex items-center gap-3 mb-3">
            <span className="text-3xl" role="img" aria-label={zodiac.name_pt}>{zodiac.emoji}</span>
            <div>
              <p className="font-story text-xl font-bold" style={{ color: '#F8F4EF' }}>
                {zodiac.name_pt}
              </p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-sm">{zodiac.element_emoji}</span>
                <span className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
                  Elemento {zodiac.element}
                </span>
              </div>
            </div>
          </div>

          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Quando a história de vocês começou, a constelação de{' '}
            <span style={{ color: '#E89AAE', fontWeight: 600 }}>{zodiac.name_pt}</span>{' '}
            guiava o céu
          </p>

          <p
            className="text-sm leading-relaxed italic"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            "{zodiac.tagline}"
          </p>
        </motion.div>
      </div>

    </section>
  )
}
