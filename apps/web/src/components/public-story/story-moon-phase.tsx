'use client'

import { useMemo } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import { formatDate } from '@loverecap/utils'
import { getMoonPhase } from './moon/moon-utils'
import { MoonSVG } from './moon/moon-svg'

interface StoryMoonPhaseProps {
  startDate: string
}

const STAR_STYLE = `
  @keyframes twinkle {
    0%, 100% { opacity: 0.15; transform: scale(1); }
    50% { opacity: 0.7; transform: scale(1.3); }
  }
`

const STARS = [
  { x: 8,  y: 15, s: 1.5, d: 1.8 },
  { x: 18, y: 32, s: 1.0, d: 2.4 },
  { x: 82, y: 12, s: 2.0, d: 1.5 },
  { x: 91, y: 28, s: 1.2, d: 3.1 },
  { x: 74, y: 45, s: 1.8, d: 2.2 },
  { x: 6,  y: 58, s: 1.4, d: 2.8 },
  { x: 95, y: 65, s: 1.0, d: 1.9 },
  { x: 25, y: 72, s: 1.6, d: 3.5 },
  { x: 88, y: 80, s: 2.2, d: 2.0 },
  { x: 12, y: 85, s: 1.1, d: 2.6 },
  { x: 55, y: 10, s: 1.3, d: 1.7 },
  { x: 44, y: 88, s: 1.9, d: 3.0 },
  { x: 65, y: 75, s: 1.4, d: 2.3 },
  { x: 35, y: 20, s: 1.0, d: 1.6 },
  { x: 78, y: 92, s: 1.7, d: 2.9 },
]

export function StoryMoonPhase({ startDate }: StoryMoonPhaseProps) {
  const reduce = useReducedMotion()
  const moon = useMemo(() => getMoonPhase(startDate), [startDate])
  const formattedDate = useMemo(() => formatDate(startDate, 'pt-BR'), [startDate])

  const romanticCaptions: Record<string, string> = {
    'Lua Nova': 'Um novo começo, cheio de possibilidades infinitas',
    'Lua Crescente': 'O amor crescia, como a própria lua naquela noite',
    'Quarto Crescente': 'A metade do caminho revelada, a outra esperando por vocês',
    'Lua Gibosa Crescente': 'Quase plena, assim como o que sentiram naquele instante',
    'Lua Cheia': 'Em toda a sua glória, iluminando o início de tudo',
    'Lua Gibosa Minguante': 'Cheia de memórias, preservando cada detalhe precioso',
    'Quarto Minguante': 'Refletindo a beleza de tudo que estava por vir',
    'Lua Minguante': 'Suave e misteriosa, guardando segredos do universo',
  }

  const caption = romanticCaptions[moon.name] ?? 'O universo conspirou a favor de vocês'

  return (
    <section
      aria-label="Fase da lua"
      style={{
        background:
          'linear-gradient(180deg,' +
          '#FFF8F2 0%,' +
          '#F9E5EE 7%,' +
          '#C87090 17%,' +
          '#621529 25%,' +
          '#1D0A14 33%,' +
          '#0A0B14 42%,' +
          '#0A0B14 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      
      <style>{STAR_STYLE}</style>

      <div
        aria-hidden="true"
        style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}
      >
        {STARS.map((star, i) => (
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
              animation: reduce ? 'none' : `twinkle ${star.d}s ease-in-out infinite`,
              animationDelay: `${i * 0.18}s`,
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
          background:
            'radial-gradient(ellipse 40% 30% at 20% 40%, rgba(255,77,109,0.06) 0%, transparent 70%), ' +
            'radial-gradient(ellipse 35% 25% at 80% 60%, rgba(232,154,174,0.08) 0%, transparent 70%)',
        }}
      />

      <div className="relative z-10 px-5 py-24 max-w-lg mx-auto">
        
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center mb-10"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#E89AAE] mb-3">
            ✦ No início de tudo ✦
          </p>
          <h2 className="font-story text-2xl font-bold leading-tight sm:text-3xl" style={{ color: '#F8F4EF' }}>
            Como a lua estava quando
            <br />
            <span style={{ color: '#E89AAE' }}>nossa história começou</span>
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
          initial={reduce ? {} : { opacity: 0, scale: 0.8 }}
          whileInView={reduce ? {} : { opacity: 1, scale: 1 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ type: 'spring', stiffness: 120, damping: 14, delay: 0.1 }}
          className="mx-auto mb-8"
          style={{ maxWidth: 200 }}
        >
          
          <motion.div
            animate={reduce ? {} : { y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          >
            <MoonSVG phase={moon.phase} />
          </motion.div>
        </motion.div>

        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 24 }}
          whileInView={reduce ? {} : { opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.05 }}
          transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          className="rounded-3xl px-6 py-6 text-center"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
            backdropFilter: 'blur(8px)',
          }}
        >
          
          <div className="flex items-center justify-center gap-3 mb-3">
            <span className="text-4xl" role="img" aria-label={moon.name}>{moon.emoji}</span>
            <div className="text-left">
              <p className="font-story text-xl font-bold" style={{ color: '#F8F4EF' }}>
                {moon.name}
              </p>
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {moon.illumination}% iluminada
              </p>
            </div>
          </div>

          <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Em <span style={{ color: '#E89AAE', fontWeight: 600 }}>{formattedDate}</span>
            {' '}a lua estava em{' '}
            <span style={{ color: '#F8F4EF', fontWeight: 600 }}>{moon.name.toLowerCase()}</span>
          </p>

          <p
            className="text-sm leading-relaxed italic"
            style={{ color: 'rgba(255,255,255,0.45)' }}
          >
            "{caption}"
          </p>
        </motion.div>
      </div>
    </section>
  )
}
