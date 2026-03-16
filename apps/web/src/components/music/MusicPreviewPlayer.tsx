'use client'

import { X } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface Props {
  videoId: string | null
  onClose: () => void
}

export function MusicPreviewPlayer({ videoId, onClose }: Props) {
  return (
    <AnimatePresence>
      {videoId && (
        <motion.div
          key={videoId}
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
          className="relative rounded-xl overflow-hidden border border-neutral-200 bg-neutral-900"
        >
          <button
            type="button"
            onClick={onClose}
            className="absolute top-2 right-2 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors cursor-pointer"
            aria-label="Fechar preview"
          >
            <X className="h-3.5 w-3.5" />
          </button>

          <iframe
            key={videoId}
            src={`https://www.youtube.com/embed/${videoId}?autoplay=1&modestbranding=1&rel=0&fs=0`}
            allow="autoplay; encrypted-media"
            width="100%"
            height="180"
            title="Preview da música"
            className="block"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
