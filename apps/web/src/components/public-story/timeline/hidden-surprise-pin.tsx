'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { X } from 'lucide-react'

interface HiddenSurprisePinProps {
  message: string
  emoji?: string
}

export function HiddenSurprisePin({ message, emoji = '💌' }: HiddenSurprisePinProps) {
  const [open, setOpen] = useState(false)
  const reduce = useReducedMotion()

  return (
    <>
      
      <motion.button
        onClick={() => setOpen(true)}
        className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#FFD0DC] bg-[#FFF0F3] text-[#FF4D6D] text-xs font-semibold cursor-pointer select-none"
        whileHover={reduce ? {} : { scale: 1.04 }}
        whileTap={reduce ? {} : { scale: 0.96 }}
        aria-label="Abrir surpresa escondida"
      >
        
        {!reduce && (
          <span className="relative flex h-4 w-4 shrink-0">
            <motion.span
              className="absolute inline-flex h-full w-full rounded-full bg-[#FF4D6D]/40"
              animate={{ scale: [1, 1.8, 1.8], opacity: [0.7, 0, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: 'easeOut' }}
            />
            <span className="relative inline-flex h-4 w-4 rounded-full bg-[#FF4D6D]/20 items-center justify-center text-[10px]">
              {emoji}
            </span>
          </span>
        )}
        {reduce && <span>{emoji}</span>}
        Surpresa escondida
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reduce ? 0 : 0.2 }}
          >
            
            <motion.div
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setOpen(false)}
            />

            <motion.div
              className="relative z-10 w-full max-w-sm rounded-3xl bg-white shadow-2xl shadow-[#FF4D6D]/10 overflow-hidden"
              initial={reduce ? {} : { scale: 0.82, opacity: 0, y: 20 }}
              animate={reduce ? {} : { scale: 1, opacity: 1, y: 0 }}
              exit={reduce ? {} : { scale: 0.88, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 280, damping: 22 }}
            >
              
              <div
                className="h-1.5 w-full"
                style={{ background: 'linear-gradient(90deg, #FF4D6D, #E89AAE, #C8B6E2)' }}
              />

              <div className="p-8 text-center">
                
                <motion.div
                  initial={reduce ? {} : { scale: 0 }}
                  animate={reduce ? {} : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.1 }}
                  className="text-5xl mb-5 select-none"
                >
                  {emoji}
                </motion.div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E89AAE] mb-4">
                  Uma surpresa para você
                </p>

                <motion.p
                  initial={reduce ? {} : { opacity: 0, y: 10 }}
                  animate={reduce ? {} : { opacity: 1, y: 0 }}
                  transition={{ delay: 0.18, duration: 0.45 }}
                  className="font-story text-lg text-[#2B2B2B] leading-relaxed"
                >
                  {message}
                </motion.p>
              </div>

              <div className="px-8 pb-7 flex justify-center">
                <button
                  onClick={() => setOpen(false)}
                  className="inline-flex items-center gap-2 text-xs text-[#6B6B6B] hover:text-[#2B2B2B] transition-colors cursor-pointer"
                  aria-label="Fechar"
                >
                  <X className="h-3.5 w-3.5" />
                  Fechar
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
