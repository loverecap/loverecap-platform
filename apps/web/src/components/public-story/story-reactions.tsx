'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'

const EMOJIS = ['❤️', '😭', '🥰', '🔥'] as const
type Emoji = typeof EMOJIS[number]

interface ReactionRow {
  emoji: string
  count: number
}

interface StoryReactionsProps {
  slug: string
}

function getStoredReactions(slug: string): Set<Emoji> {
  try {
    const raw = localStorage.getItem(`lr_reactions_${slug}`)
    if (!raw) return new Set()
    return new Set(JSON.parse(raw) as Emoji[])
  } catch {
    return new Set()
  }
}

function storeReaction(slug: string, emoji: Emoji, current: Set<Emoji>) {
  try {
    const next = new Set(current)
    next.add(emoji)
    localStorage.setItem(`lr_reactions_${slug}`, JSON.stringify([...next]))
  } catch {}
}

export function StoryReactions({ slug }: StoryReactionsProps) {
  const reduce = useReducedMotion()
  const [counts, setCounts] = useState<Record<string, number>>({})
  const [reacted, setReacted] = useState<Set<Emoji>>(new Set())
  const [loading, setLoading] = useState(true)
  const [bursting, setBursting] = useState<Emoji | null>(null)

  useEffect(() => {
    setReacted(getStoredReactions(slug))
    fetch(`/api/stories/${slug}/reactions`)
      .then((r) => r.json())
      .then((body: { data?: ReactionRow[] }) => {
        const map: Record<string, number> = {}
        for (const row of body.data ?? []) map[row.emoji] = row.count
        setCounts(map)
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [slug])

  const react = useCallback(
    async (emoji: Emoji) => {
      if (reacted.has(emoji)) return

      // Optimistic update
      setCounts((prev) => ({ ...prev, [emoji]: (prev[emoji] ?? 0) + 1 }))
      setReacted((prev) => new Set([...prev, emoji]))
      storeReaction(slug, emoji, reacted)
      if (!reduce) {
        setBursting(emoji)
        setTimeout(() => setBursting(null), 700)
      }

      try {
        await fetch(`/api/stories/${slug}/reactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ emoji }),
        })
      } catch {}
    },
    [slug, reacted, reduce],
  )

  return (
    <section
      className="px-5 py-14 text-center"
      style={{ background: 'linear-gradient(180deg, #FFF8F2 0%, #FFF0F3 50%, #FFF8F2 100%)' }}
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E89AAE] mb-2"
      >
        O que essa história fez com você?
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="text-xs text-[#B8909E] mb-8"
      >
        Deixe uma reação — o casal vai adorar saber
      </motion.p>

      <div className="flex items-end justify-center gap-4">
        {EMOJIS.map((emoji, i) => {
          const count = counts[emoji] ?? 0
          const hasReacted = reacted.has(emoji)
          const isBursting = bursting === emoji

          return (
            <motion.div
              key={emoji}
              className="flex flex-col items-center gap-2"
              initial={reduce ? {} : { opacity: 0, y: 16 }}
              whileInView={reduce ? {} : { opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.07 }}
            >
              <div className="relative">
                {/* Burst ring */}
                <AnimatePresence>
                  {isBursting && (
                    <motion.span
                      className="absolute inset-0 rounded-full"
                      initial={{ scale: 1, opacity: 0.7 }}
                      animate={{ scale: 2.4, opacity: 0 }}
                      exit={{}}
                      transition={{ duration: 0.6, ease: 'easeOut' }}
                      style={{ background: 'rgba(255,77,109,0.25)', zIndex: 0 }}
                    />
                  )}
                </AnimatePresence>

                <motion.button
                  whileHover={reduce ? {} : { scale: 1.15, y: -2 }}
                  whileTap={reduce ? {} : { scale: 0.88 }}
                  onClick={() => react(emoji)}
                  disabled={hasReacted || loading}
                  aria-label={`Reagir com ${emoji}`}
                  className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl text-2xl transition-all duration-200 cursor-pointer disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D]/40"
                  style={{
                    background: hasReacted
                      ? 'linear-gradient(135deg, #FFE4EC 0%, #FFCCD8 100%)'
                      : 'rgba(255,255,255,0.9)',
                    boxShadow: hasReacted
                      ? '0 4px 16px rgba(255,77,109,0.22), inset 0 0 0 1.5px rgba(255,77,109,0.30)'
                      : '0 2px 12px rgba(0,0,0,0.08), inset 0 0 0 1px rgba(0,0,0,0.06)',
                    transform: hasReacted ? 'translateY(-2px)' : undefined,
                  }}
                >
                  {emoji}
                </motion.button>
              </div>

              <AnimatePresence mode="wait">
                {count > 0 && (
                  <motion.span
                    key={count}
                    initial={{ opacity: 0, y: 4, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.25, type: 'spring', stiffness: 300, damping: 20 }}
                    className="text-[11px] font-semibold tabular-nums"
                    style={{ color: hasReacted ? '#FF4D6D' : '#C4A0B0' }}
                  >
                    {count.toLocaleString('pt-BR')}
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.div>
          )
        })}
      </div>
    </section>
  )
}
