'use client'

import { useState } from 'react'
import { motion, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { formatDate } from '@loverecap/utils'
import { HiddenSurprisePin } from './timeline/hidden-surprise-pin'
import { MemoryModal } from './memory-modal'

interface TimelineAsset {
  id: string
  url: string
  asset_type: string
}

interface TimelineMemory {
  id: string
  title: string
  description?: string | null
  short_description?: string | null
  occurred_at?: string | null
  emoji?: string | null
  position: number
  assets?: TimelineAsset[]
}

interface HiddenSurprise {
  id: string
  memory_id: string | null
  message: string
  emoji: string
  position: number
}

interface StoryTimelineProps {
  memories: TimelineMemory[]
  hiddenSurprises?: HiddenSurprise[]
}

// Soft gradient palettes for photo-less cards — cycles through these
const CARD_GRADIENTS = [
  'linear-gradient(135deg, #FFB0C8 0%, #FF4D6D 100%)',
  'linear-gradient(135deg, #F8C8DC 0%, #E89AAE 100%)',
  'linear-gradient(135deg, #C8B6E2 0%, #9B8FA0 100%)',
  'linear-gradient(135deg, #FFD0DC 0%, #FF6B87 100%)',
  'linear-gradient(135deg, #FFDDE8 0%, #F8A8C0 100%)',
]

export function StoryTimeline({ memories, hiddenSurprises = [] }: StoryTimelineProps) {
  const reduce = useReducedMotion()
  const [activeMemory, setActiveMemory] = useState<TimelineMemory | null>(null)

  if (memories.length === 0) return null

  const surprisesByMemoryId = hiddenSurprises.reduce<Record<string, HiddenSurprise>>((acc, s) => {
    if (s.memory_id) acc[s.memory_id] = s
    return acc
  }, {})

  const orphanSurprises = hiddenSurprises.filter((s) => !s.memory_id)

  return (
    <section
      className="py-20"
      style={{ background: 'linear-gradient(180deg, #FFF8F2 0%, #F5E9E2 50%, #FFF8F2 100%)' }}
    >
      {/* Section header */}
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="text-center px-5 mb-12"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-[#E89AAE] mb-3">
          Memórias
        </p>
        <h2 className="font-story text-3xl font-bold text-[#2B2B2B] sm:text-4xl leading-tight">
          Nossos momentos
        </h2>
        <motion.div
          initial={reduce ? {} : { scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-4 mx-auto w-14 h-px bg-linear-to-r from-transparent via-[#FF4D6D] to-transparent"
        />
      </motion.div>

      {/* Cards grid — vertical storyline */}
      <div className="px-4 max-w-lg mx-auto space-y-4">
        {memories.map((memory, i) => {
          const photo = memory.assets?.find((a) => a.asset_type === 'image')
          const surprise = surprisesByMemoryId[memory.id]
          const isFirst = i === 0
          const gradient = CARD_GRADIENTS[i % CARD_GRADIENTS.length]!
          const previewText = memory.short_description ?? memory.description

          return (
            <div key={memory.id}>
              <motion.article
                initial={reduce ? {} : { opacity: 0, y: 40 }}
                whileInView={reduce ? {} : { opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.05 }}
                transition={{ duration: 0.6, ease: 'easeOut' }}
                whileHover={reduce ? {} : {
                  scale: 1.02,
                  boxShadow: '0 12px 48px rgba(0,0,0,0.18), 0 2px 8px rgba(0,0,0,0.08)',
                }}
                onClick={() => setActiveMemory(memory)}
                className="relative overflow-hidden rounded-3xl cursor-pointer"
                style={{
                  aspectRatio: isFirst ? '4/3' : photo ? '3/2' : undefined,
                  minHeight: !photo ? 200 : undefined,
                  boxShadow: '0 4px 24px rgba(0,0,0,0.07), 0 1px 4px rgba(0,0,0,0.04)',
                }}
              >
                {photo ? (
                  /* ── Photo card ─────────────────────────────────────── */
                  <>
                    <Image
                      src={photo.url}
                      alt={memory.title}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) calc(100vw - 32px), 560px"
                    />
                    {/* Multi-stop gradient overlay — heavy at bottom for text legibility */}
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.28) 45%, rgba(0,0,0,0.02) 100%)',
                      }}
                    />
                  </>
                ) : (
                  /* ── Typographic card (no photo) ─────────────────── */
                  <>
                    <div className="absolute inset-0" style={{ background: gradient }} />
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{
                        background:
                          'linear-gradient(to top, rgba(0,0,0,0.40) 0%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0) 100%)',
                      }}
                    />
                    {/* Centered emoji for no-photo cards */}
                    {memory.emoji && (
                      <div className="absolute inset-0 flex items-center justify-center pb-16">
                        <motion.span
                          initial={reduce ? {} : { scale: 0, opacity: 0 }}
                          whileInView={reduce ? {} : { scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.2, type: 'spring', stiffness: 180, damping: 14 }}
                          className="text-6xl select-none"
                          style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}
                        >
                          {memory.emoji}
                        </motion.span>
                      </div>
                    )}
                  </>
                )}

                {/* ── Text overlay (bottom of every card) ───────────── */}
                <div className="absolute inset-x-0 bottom-0 px-5 pb-5 pt-8">
                  {/* Memory index + date row */}
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold text-white/60 tabular-nums">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {memory.occurred_at && (
                      <>
                        <span className="h-px w-3 bg-white/30" />
                        <span className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/60">
                          {formatDate(memory.occurred_at, 'pt-BR')}
                        </span>
                      </>
                    )}
                    {memory.emoji && photo && (
                      <span className="ml-auto text-lg select-none leading-none">
                        {memory.emoji}
                      </span>
                    )}
                  </div>

                  {/* Title */}
                  <h3 className="font-story text-xl font-bold text-white leading-snug mb-1 drop-shadow-sm">
                    {memory.title}
                  </h3>

                  {/* Preview text — short_description preferred, falls back to description */}
                  {previewText && (
                    <p className="text-sm text-white/75 leading-relaxed line-clamp-1">
                      {previewText}
                    </p>
                  )}
                </div>

                {/* Entrance shimmer effect */}
                {!reduce && (
                  <motion.div
                    className="absolute inset-0 pointer-events-none"
                    initial={{ opacity: 0.3, x: '-100%' }}
                    whileInView={{ opacity: 0, x: '100%' }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.1, ease: 'easeOut' }}
                    style={{
                      background:
                        'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.25) 50%, transparent 60%)',
                    }}
                  />
                )}
              </motion.article>

              {/* Hidden surprise pin for this memory */}
              {surprise && (
                <motion.div
                  initial={reduce ? {} : { opacity: 0, y: 12 }}
                  whileInView={reduce ? {} : { opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: 0.15 }}
                  className="mt-3"
                >
                  <HiddenSurprisePin message={surprise.message} emoji={surprise.emoji} />
                </motion.div>
              )}
            </div>
          )
        })}

        {/* Orphan surprises */}
        {orphanSurprises.map((surprise) => (
          <motion.div
            key={surprise.id}
            initial={reduce ? {} : { opacity: 0, y: 20 }}
            whileInView={reduce ? {} : { opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex justify-center py-4"
          >
            <HiddenSurprisePin message={surprise.message} emoji={surprise.emoji} />
          </motion.div>
        ))}
      </div>

      {/* Memory detail modal */}
      <MemoryModal
        memory={activeMemory ? {
          ...activeMemory,
          photoUrl: activeMemory.assets?.find((a) => a.asset_type === 'image')?.url ?? null,
        } : null}
        onClose={() => setActiveMemory(null)}
      />
    </section>
  )
}
