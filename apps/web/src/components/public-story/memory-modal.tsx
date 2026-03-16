'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import { X } from 'lucide-react'
import { formatDate } from '@loverecap/utils'

interface MemoryModalMemory {
  title: string
  description?: string | null
  short_description?: string | null
  occurred_at?: string | null
  emoji?: string | null
  photoUrl?: string | null
}

interface MemoryModalProps {
  memory: MemoryModalMemory | null
  onClose: () => void
}

// Matches the gradients used in story-timeline for typographic cards
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #FFB0C8 0%, #FF4D6D 100%)',
  'linear-gradient(135deg, #F8C8DC 0%, #E89AAE 100%)',
  'linear-gradient(135deg, #C8B6E2 0%, #9B8FA0 100%)',
]

export function MemoryModal({ memory, onClose }: MemoryModalProps) {
  // Dismiss on Escape
  useEffect(() => {
    if (!memory) return
    function onKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [memory, onClose])

  // Lock body scroll when open
  useEffect(() => {
    if (memory) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [memory])

  return (
    <AnimatePresence>
      {memory && (
        <motion.div
          className="fixed inset-0 z-50 flex flex-col bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
        >
          {/* Background: photo or gradient */}
          <div className="absolute inset-0">
            {memory.photoUrl ? (
              <Image
                src={memory.photoUrl}
                alt={memory.title}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            ) : (
              <div
                className="absolute inset-0"
                style={{ background: CARD_GRADIENTS[0] }}
              />
            )}

            {/* Heavy bottom gradient for text legibility */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background:
                  'linear-gradient(to top, rgba(0,0,0,0.88) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.12) 80%, rgba(0,0,0,0) 100%)',
              }}
            />
          </div>

          {/* Close button */}
          <div className="relative z-10 flex justify-end p-4">
            <button
              onClick={onClose}
              className="flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-sm hover:bg-black/60 transition-colors"
              aria-label="Fechar"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Content — bottom anchored */}
          <div className="relative z-10 mt-auto px-6 pb-12">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1, duration: 0.4, ease: 'easeOut' }}
            >
              {memory.occurred_at && (
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/60 mb-3">
                  {formatDate(memory.occurred_at, 'pt-BR')}
                </p>
              )}
              {memory.emoji && (
                <span className="text-4xl mb-3 block select-none">{memory.emoji}</span>
              )}
              <h2 className="font-story text-3xl font-bold text-white leading-tight mb-4">
                {memory.title}
              </h2>
              {memory.description && (
                <p className="text-base text-white/80 leading-relaxed">
                  {memory.description}
                </p>
              )}
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
