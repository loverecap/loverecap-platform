'use client'

import { useState, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Image from 'next/image'
import { X, Expand } from 'lucide-react'

interface GalleryAsset {
  id: string
  url: string
  asset_type: string
}

interface StoryGalleryProps {
  assets: GalleryAsset[]
}

export function StoryGallery({ assets }: StoryGalleryProps) {
  const photos = assets.filter((a) => a.asset_type === 'image')
  const reduce = useReducedMotion()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [lightbox, setLightbox] = useState<string | null>(null)

  if (photos.length === 0) return null

  // Tracks active index based on scroll position fraction
  function onScroll() {
    const el = scrollRef.current
    if (!el || photos.length <= 1) return
    const progress = el.scrollLeft / Math.max(1, el.scrollWidth - el.clientWidth)
    setActive(Math.max(0, Math.min(photos.length - 1, Math.round(progress * (photos.length - 1)))))
  }

  // Smooth-scroll to a specific photo via dot click
  function scrollTo(i: number) {
    const el = scrollRef.current
    if (!el) return
    const target = (i / Math.max(1, photos.length - 1)) * (el.scrollWidth - el.clientWidth)
    el.scrollTo({ left: target, behavior: 'smooth' })
  }

  return (
    <>
      <section
        className="py-20"
        style={{ background: 'linear-gradient(180deg, #FFF8F2 0%, #F5E9E2 50%, #FFF8F2 100%)' }}
      >
        {/* Header */}
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="text-center px-5 mb-10"
        >
          <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E89AAE] mb-3">
            Nossa galeria
          </p>
          <h2 className="font-story text-3xl font-bold text-[#2B2B2B]">
            Em fotos
          </h2>
          <motion.div
            initial={reduce ? {} : { scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-4 mx-auto w-14 h-px bg-linear-to-r from-transparent via-[#FF4D6D] to-transparent"
          />
        </motion.div>

        {/* ── Horizontal snap scroll ─────────────────────────────────────── */}
        {photos.length === 1 ? (
          /* Single photo — full-width hero */
          <motion.div
            initial={reduce ? {} : { opacity: 0, scale: 0.96 }}
            whileInView={reduce ? {} : { opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="px-5 mx-auto max-w-sm"
          >
            <div
              className="relative overflow-hidden rounded-3xl cursor-pointer"
              style={{ aspectRatio: '3/4', boxShadow: '0 16px 48px rgba(0,0,0,0.14)' }}
              onClick={() => setLightbox(photos[0]!.url)}
            >
              <Image
                src={photos[0]!.url}
                alt="Memória especial"
                fill
                className="object-cover"
                sizes="(max-width: 640px) calc(100vw - 40px), 360px"
              />
              <div className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm">
                <Expand className="h-3.5 w-3.5 text-white" />
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            {/* Constrain to max-w-lg so % padding and vw-based card widths
                are calculated relative to a consistent container, not the full
                viewport. Without this, 11% = 158px on a 1440px screen and
                78vw = 1123px (capped at 340px), breaking the layout. */}
            <div className="max-w-lg mx-auto">
            <div
              ref={scrollRef}
              onScroll={onScroll}
              className="flex gap-4"
              style={{
                overflowX: 'auto',
                overflowY: 'hidden',
                scrollSnapType: 'x mandatory',
                WebkitOverflowScrolling: 'touch',
                overscrollBehavior: 'contain',
                scrollbarWidth: 'none',
                paddingLeft: '11%',
                paddingRight: '11%',
                paddingBottom: 4,
              }}
            >
              {photos.map((photo, i) => (
                <motion.div
                  key={photo.id}
                  initial={reduce ? {} : { opacity: 0, x: 32 }}
                  whileInView={reduce ? {} : { opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.05 }}
                  transition={{ duration: 0.5, delay: Math.min(i * 0.07, 0.28), ease: 'easeOut' }}
                  className="shrink-0 cursor-pointer"
                  style={{ width: '78%', scrollSnapAlign: 'center' }}
                  onClick={() => {
                    if (active !== i) {
                      scrollTo(i)
                    } else {
                      setLightbox(photo.url)
                    }
                  }}
                >
                  {/* Card — scale & shadow change based on active */}
                  <div
                    className="relative overflow-hidden rounded-3xl"
                    style={{
                      aspectRatio: '3/4',
                      boxShadow:
                        active === i
                          ? '0 20px 56px rgba(0,0,0,0.18), 0 4px 12px rgba(0,0,0,0.10)'
                          : '0 6px 20px rgba(0,0,0,0.07)',
                      transform: active === i ? 'scale(1)' : 'scale(0.94)',
                      opacity: active === i ? 1 : 0.6,
                      transition: reduce ? 'none' : 'transform 0.35s ease, opacity 0.35s ease, box-shadow 0.35s ease',
                    }}
                  >
                    <Image
                      src={photo.url}
                      alt={`Memória ${i + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 78vw, 340px"
                    />

                    {/* Bottom gradient + counter */}
                    <div
                      className="absolute inset-x-0 bottom-0 h-20 pointer-events-none"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.50), transparent)' }}
                    />
                    <span className="absolute bottom-3.5 right-4 text-[11px] font-semibold tabular-nums text-white/70">
                      {i + 1}/{photos.length}
                    </span>

                    {/* Expand hint on active card only */}
                    <AnimatePresence>
                      {active === i && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          transition={{ duration: 0.2 }}
                          className="absolute top-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-black/25 backdrop-blur-sm"
                        >
                          <Expand className="h-3.5 w-3.5 text-white" />
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {/* Active: subtle pink glow border */}
                    {active === i && (
                      <motion.div
                        className="absolute inset-0 rounded-3xl ring-2 ring-[#FF4D6D]/40 pointer-events-none"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.25 }}
                      />
                    )}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* ── Dot navigation ─────────────────────────────────────────── */}
            <div className="flex justify-center items-center gap-1.5 mt-6 px-5">
              {photos.map((_, i) => (
                <motion.button
                  key={i}
                  onClick={() => scrollTo(i)}
                  aria-label={`Ir para foto ${i + 1}`}
                  className="cursor-pointer rounded-full focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2"
                  animate={{
                    width: active === i ? 20 : 6,
                    backgroundColor: active === i ? '#FF4D6D' : '#F0B8C8',
                  }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  style={{ height: 6, borderRadius: 999 }}
                />
              ))}
            </div>
          </div>{/* closes max-w-lg mx-auto */}
          </>
        )}
      </section>

      {/* ── Lightbox ──────────────────────────────────────────────────────── */}
      <AnimatePresence>
        {lightbox && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 px-5"
            onClick={() => setLightbox(null)}
          >
            {/* Blurred background of the same photo */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <img
                src={lightbox}
                alt=""
                aria-hidden="true"
                className="w-full h-full object-cover scale-110 opacity-30"
                style={{ filter: 'blur(32px)' }}
              />
            </div>

            <motion.div
              initial={reduce ? {} : { scale: 0.84, opacity: 0, y: 20 }}
              animate={reduce ? {} : { scale: 1, opacity: 1, y: 0 }}
              exit={reduce ? {} : { scale: 0.88, opacity: 0, y: 12 }}
              transition={{ type: 'spring', stiffness: 280, damping: 26 }}
              className="relative w-full max-w-sm z-10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Photo */}
              <div
                className="relative overflow-hidden rounded-3xl"
                style={{ aspectRatio: '3/4', boxShadow: '0 24px 64px rgba(0,0,0,0.5)' }}
              >
                <Image
                  src={lightbox}
                  alt="Memória"
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 90vw, 360px"
                />
              </div>

              {/* Close button */}
              <motion.button
                whileHover={reduce ? {} : { scale: 1.1 }}
                whileTap={reduce ? {} : { scale: 0.92 }}
                onClick={() => setLightbox(null)}
                className="absolute -top-4 -right-2 flex h-10 w-10 items-center justify-center rounded-full bg-white shadow-lg cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2"
                aria-label="Fechar"
              >
                <X className="h-4.5 w-4.5 text-[#2B2B2B]" />
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
