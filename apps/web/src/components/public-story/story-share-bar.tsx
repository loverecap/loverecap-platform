'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Share2, Check, Link } from 'lucide-react'

interface StoryShareBarProps {
  url: string
  title: string
}

export function StoryShareBar({ url, title }: StoryShareBarProps) {
  const [copied, setCopied] = useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
    }
  }

  async function handleShare() {
    if (typeof navigator !== 'undefined' && navigator.share) {
      try {
        await navigator.share({ title, url })
      } catch {
      }
    } else {
      await handleCopy()
    }
  }

  return (
    <motion.div
      initial={{ y: 88, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ delay: 0.6, type: 'spring', stiffness: 200, damping: 26 }}
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-[#F8C8DC]/30 bg-white/95 px-4 py-3 backdrop-blur-md"
    >
      <div className="flex gap-2.5 max-w-sm mx-auto">
        <button
          onClick={handleCopy}
          className="flex flex-1 items-center justify-center gap-2 rounded-full border border-[#F0D0D8] bg-white py-3 text-sm font-semibold text-[#2B2B2B] hover:bg-[#FFF0F3] transition-colors"
        >
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              Copiado!
            </>
          ) : (
            <>
              <Link className="h-4 w-4 text-[#E89AAE]" />
              Copiar link
            </>
          )}
        </button>
        <button
          onClick={handleShare}
          className="flex flex-1 items-center justify-center gap-2.5 rounded-full bg-[#FF4D6D] py-3 text-sm font-semibold text-white shadow-md shadow-[#FF4D6D]/25 hover:bg-[#FF2E63] transition-colors"
        >
          <Share2 className="h-4 w-4" />
          Compartilhar
        </button>
      </div>
    </motion.div>
  )
}
