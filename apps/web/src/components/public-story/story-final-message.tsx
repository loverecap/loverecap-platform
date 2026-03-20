'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Heart, Mail } from 'lucide-react'

interface StoryFinalMessageProps {
  message: string
  authorName?: string | undefined
}

export function StoryFinalMessage({ message, authorName }: StoryFinalMessageProps) {
  const [revealed, setRevealed] = useState(false)

  return (
    <section
      className="relative px-6 py-20 overflow-hidden"
      style={{ background: 'linear-gradient(180deg, #FFF8F2 0%, #FFF0F3 30%, #F5E9E2 65%, #FFF8F2 100%)' }}
    >
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 60%, rgba(255,77,109,0.06) 0%, transparent 70%)' }}
      />

      <div className="relative z-10 max-w-sm mx-auto text-center">
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-10"
        >
          <motion.div
            initial={{ scale: 0 }}
            whileInView={{ scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 14 }}
            className="mx-auto mb-5 relative"
            style={{ width: 64, height: 64 }}
          >
            <motion.div
              animate={{ scale: [1, 1.4, 1], opacity: [0.35, 0.1, 0.35] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="absolute inset-0 rounded-full bg-[#FF4D6D]/20 blur-xl"
            />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-br from-[#FFD0DC] to-[#FFB0C8] shadow-lg shadow-[#FF4D6D]/20">
              <Heart className="h-7 w-7 fill-[#FF4D6D] text-[#FF4D6D]" />
            </div>
          </motion.div>

          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E89AAE] mb-3">
            Mensagem especial
          </p>
          <h2 className="font-story text-2xl font-bold text-[#2B2B2B]">
            Uma carta para você
          </h2>
        </motion.div>

        <AnimatePresence mode="wait">
          {!revealed ? (
            <motion.div
              key="locked"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.94, y: -8 }}
              transition={{ duration: 0.28 }}
              className="flex flex-col items-center gap-6"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: 'easeInOut' }}
                className="relative"
              >
                <div className="flex h-20 w-24 flex-col items-center justify-center rounded-2xl bg-white shadow-lg border border-[#F8C8DC]/50">
                  <Mail className="h-9 w-9 text-[#FF4D6D]" />
                  <div className="absolute -top-2 -right-2 h-6 w-6 rounded-full bg-[#FF4D6D] flex items-center justify-center shadow-md shadow-[#FF4D6D]/30">
                    <Heart className="h-3 w-3 fill-white text-white" />
                  </div>
                </div>
              </motion.div>

              <p className="text-sm text-[#6B6B6B] leading-relaxed max-w-55">
                Uma mensagem especial foi preparada com muito amor para você.
              </p>

              <motion.button
                whileHover={{ scale: 1.04, boxShadow: '0 14px 32px rgba(255,77,109,0.32)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setRevealed(true)}
                className="inline-flex items-center gap-2.5 bg-[#FF4D6D] text-white px-8 py-3.5 rounded-full text-sm font-semibold shadow-md shadow-[#FF4D6D]/25 cursor-pointer"
              >
                <Mail className="h-4 w-4" />
                Revelar a mensagem 💌
              </motion.button>
            </motion.div>
          ) : (
            <motion.div
              key="revealed"
              initial={{ opacity: 0, y: 24, scale: 0.94 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <div className="relative rounded-2xl bg-white border border-[#F8C8DC]/50 p-7 shadow-xl text-left">
                
                <div className="absolute top-0 left-0 right-0 h-1 rounded-t-2xl bg-linear-to-r from-[#FFD0DC] via-[#FF4D6D] to-[#FFD0DC]" />

                <div className="flex items-center gap-3 mb-5">
                  <div className="h-px flex-1 bg-linear-to-r from-transparent to-[#F8C8DC]" />
                  <Heart className="h-3.5 w-3.5 fill-[#FF4D6D] text-[#FF4D6D] shrink-0" />
                  <div className="h-px flex-1 bg-linear-to-l from-transparent to-[#F8C8DC]" />
                </div>

                <blockquote className="font-story text-[18px] italic text-[#2B2B2B] leading-relaxed text-center">
                  &ldquo;{message}&rdquo;
                </blockquote>

                {authorName && (
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.55 }}
                    className="mt-5 text-right text-sm text-[#E89AAE] font-medium font-story italic"
                  >
                    — {authorName} ♥
                  </motion.p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  )
}
