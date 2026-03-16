'use client'

import { motion, useReducedMotion } from 'framer-motion'

interface StoryNarrativeDividerProps {
  text: string
  /** Visual accent variant. Defaults to 'default'. */
  variant?: 'default' | 'dark'
}

/**
 * Emotional storytelling bridge between sections.
 * Renders a centered, italic sentence with flanking ornamental lines and a
 * scroll-triggered fade-in. Inspired by editorial chapter breaks.
 */
export function StoryNarrativeDivider({ text, variant = 'default' }: StoryNarrativeDividerProps) {
  const reduce = useReducedMotion()
  const isDark = variant === 'dark'

  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className="px-8 py-10 text-center"
      aria-hidden="true"
    >
      {/* Ornamental top line */}
      <div className="flex items-center justify-center gap-3 mb-5">
        <div
          className="h-px w-10 rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(to right, transparent, rgba(255,255,255,0.2))'
              : 'linear-gradient(to right, transparent, rgba(232,154,174,0.5))',
          }}
        />
        <div
          className="h-1 w-1 rounded-full"
          style={{ background: isDark ? 'rgba(255,255,255,0.3)' : '#E89AAE' }}
        />
        <div
          className="h-px w-10 rounded-full"
          style={{
            background: isDark
              ? 'linear-gradient(to left, transparent, rgba(255,255,255,0.2))'
              : 'linear-gradient(to left, transparent, rgba(232,154,174,0.5))',
          }}
        />
      </div>

      {/* Sentence */}
      <p
        className="font-story italic leading-relaxed max-w-xs mx-auto"
        style={{
          fontSize: '1.05rem',
          color: isDark ? 'rgba(255,255,255,0.72)' : '#7C5E6A',
          letterSpacing: '0.01em',
        }}
      >
        {text}
      </p>
    </motion.div>
  )
}
