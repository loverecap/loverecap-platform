'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface StoryViewCounterProps {
  slug: string
  initialCount: number
}

export function StoryViewCounter({ slug, initialCount }: StoryViewCounterProps) {
  const [count, setCount] = useState(initialCount)
  const [visible, setVisible] = useState(initialCount > 0)

  useEffect(() => {
    const key = `lr_viewed_${slug}`
    const alreadyCounted = sessionStorage.getItem(key)

    if (!alreadyCounted) {
      sessionStorage.setItem(key, '1')
      fetch(`/api/stories/${slug}/view`, { method: 'POST' })
        .then((r) => r.json())
        .then((body: { data?: { viewCount?: number } }) => {
          const newCount = body.data?.viewCount ?? initialCount
          setCount(newCount)
          if (newCount > 0) setVisible(true)
        })
        .catch(() => {})
    } else if (initialCount > 0) {
      setVisible(true)
    }
  }, [slug, initialCount])

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, delay: 1.8 }}
          className="flex items-center justify-center gap-1.5 py-3"
        >
          <span className="text-[11px] text-[#C4A0B0]">
            {count.toLocaleString('pt-BR')} {count === 1 ? 'pessoa se emocionou' : 'pessoas se emocionaram'} com essa história
          </span>
          <span className="text-[11px]">❤️</span>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
