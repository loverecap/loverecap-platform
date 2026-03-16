'use client'

import { motion } from 'framer-motion'
import { Heart } from 'lucide-react'

interface StorySurpriseIntroProps {
  name1: string
  name2: string
  onStart: () => void
}

const FLOATING_HEARTS = [
  { x: '8%',  y: '12%', size: 14, delay: 0.4,  opacity: 0.14 },
  { x: '88%', y: '18%', size: 22, delay: 0.7,  opacity: 0.10 },
  { x: '15%', y: '72%', size: 11, delay: 1.0,  opacity: 0.13 },
  { x: '80%', y: '68%', size: 18, delay: 0.55, opacity: 0.12 },
  { x: '50%', y: '88%', size: 13, delay: 1.3,  opacity: 0.10 },
  { x: '93%', y: '48%', size: 17, delay: 0.85, opacity: 0.11 },
  { x: '4%',  y: '42%', size: 20, delay: 1.1,  opacity: 0.09 },
  { x: '60%', y: '8%',  size: 10, delay: 0.3,  opacity: 0.12 },
  { x: '32%', y: '90%', size: 16, delay: 0.65, opacity: 0.10 },
]

export function StorySurpriseIntro({ name1, name2, onStart }: StorySurpriseIntroProps) {
  return (
    <motion.div
      className="relative min-h-dvh overflow-hidden flex flex-col items-center justify-center px-6 text-center"
      style={{ background: 'linear-gradient(145deg, #FFF8F2 0%, #FFF0F3 40%, #F5E9E2 100%)' }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Radial glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 70% 60% at 50% 55%, rgba(255,200,220,0.28) 0%, transparent 70%)' }}
      />

      {/* Floating hearts */}
      {FLOATING_HEARTS.map((h, i) => (
        <motion.div
          key={i}
          className="absolute pointer-events-none"
          style={{ left: h.x, top: h.y }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: h.opacity, scale: [1, 1.25, 1], y: [0, -14, 0] }}
          transition={{
            opacity: { delay: h.delay + 0.6, duration: 0.5 },
            scale: { delay: h.delay + 0.6, duration: 3.5 + i * 0.2, repeat: Infinity, ease: 'easeInOut' },
            y:     { delay: h.delay + 0.6, duration: 4.5 + i * 0.3, repeat: Infinity, ease: 'easeInOut' },
          }}
        >
          <Heart style={{ width: h.size, height: h.size }} className="fill-[#FF4D6D] text-[#FF4D6D]" />
        </motion.div>
      ))}

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center max-w-sm w-full">
        {/* Hero heart */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.25, type: 'spring', stiffness: 150, damping: 12 }}
          className="mb-8"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.35, 1], opacity: [0.4, 0.15, 0.4] }}
              transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-[#FF4D6D]/25 blur-2xl"
            />
            <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-br from-[#FFD0DC] to-[#FFB0C8] shadow-xl shadow-[#FF4D6D]/20">
              <Heart className="h-11 w-11 fill-[#FF4D6D] text-[#FF4D6D] drop-shadow-sm" />
            </div>
          </div>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="mb-3 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#E89AAE]"
        >
          ✦ Alguém preparou algo especial para você ✦
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.72, duration: 0.7, ease: 'easeOut' }}
          className="font-story text-4xl font-bold text-[#2B2B2B] sm:text-5xl leading-tight mb-4"
        >
          {name1} <span className="text-[#FF4D6D] italic">&amp;</span> {name2}
        </motion.h1>

        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.9, duration: 0.5 }}
          className="mb-5 w-16 h-px bg-linear-to-r from-transparent via-[#E89AAE] to-transparent"
        />

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.0 }}
          className="text-[#6B6B6B] text-base leading-relaxed mb-10"
        >
          Uma história de amor espera por você
        </motion.p>

        {/* Single CTA */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.15 }}
          className="w-full sm:w-auto"
        >
          <motion.button
            whileHover={{ scale: 1.04, boxShadow: '0 16px 36px rgba(255,77,109,0.38)' }}
            whileTap={{ scale: 0.97 }}
            onClick={onStart}
            className="bg-[#FF4D6D] text-white px-10 py-4 rounded-full text-base font-semibold shadow-lg shadow-[#FF4D6D]/30 cursor-pointer w-full sm:w-auto"
          >
            Abrir a história
          </motion.button>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5 }}
          className="mt-8 text-[10px] text-neutral-300 tracking-widest uppercase"
        >
          Feito com LoveRecap
        </motion.p>
      </div>
    </motion.div>
  )
}
