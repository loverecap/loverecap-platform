'use client'

import { useState } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import { StorySurpriseIntro } from './story-surprise-intro'
import { StoryHero } from './story-hero'
import { StoryTimeline } from './story-timeline'
import { StoryGallery } from './story-gallery'
import { StoryFinalMessage } from './story-final-message'
import { StoryFutureMessage } from './story-future-message'
import { StoryShareBar } from './story-share-bar'
import { StoryMusicPlayer } from './story-music-player'
import { StoryMoonPhase } from './story-moon-phase'
import { StoryZodiac } from './story-zodiac'
import { StoryToday } from './story-today'
import { StoryStats } from './story-stats'
import { StoryNarrativeDivider } from './story-narrative-divider'
import { SectionReveal } from './section-reveal'

interface Asset {
  id: string
  url: string
  asset_type: string
}

interface Memory {
  id: string
  title: string
  description?: string | null
  short_description?: string | null
  occurred_at?: string | null
  emoji?: string | null
  position: number
}

interface HiddenSurprise {
  id: string
  memory_id: string | null
  message: string
  emoji: string
  position: number
}

interface Music {
  provider: 'youtube' | 'file' | 'external_url'
  trackTitle: string
  artistName?: string | null
  videoId?: string | null
  thumbnail?: string | null
  audioUrl?: string | null
}

interface FutureMessage {
  message: string
  revealAt: string
  hintText?: string | null
}

interface StoryExperienceProps {
  partnerName1: string
  partnerName2: string
  startDate: string
  memories: Memory[]
  assetsByMemoryId?: Record<string, Asset[]>
  projectAssets?: Asset[]
  coverUrl?: string | null
  finalMessage?: string | null
  authorName?: string
  shareUrl?: string
  shareTitle?: string
  music?: Music | null
  hiddenSurprises?: HiddenSurprise[]
  futureMessage?: FutureMessage | null
}

export function StoryExperience({
  partnerName1,
  partnerName2,
  startDate,
  memories,
  assetsByMemoryId = {},
  projectAssets = [],
  coverUrl,
  finalMessage,
  authorName,
  shareUrl = '',
  shareTitle = '',
  music,
  hiddenSurprises = [],
  futureMessage,
}: StoryExperienceProps) {
  const [started, setStarted] = useState(false)
  const reduce = useReducedMotion()

  const memoriesWithAssets = memories.map((m) => ({
    ...m,
    assets: assetsByMemoryId[m.id] ?? [],
  }))

  const musicLabel = music
    ? [music.trackTitle, music.artistName].filter(Boolean).join(' — ')
    : null

  const photoCount = projectAssets.filter((a) => a.asset_type === 'image').length

  return (
    <>
      <AnimatePresence mode="wait" initial={false}>
        {!started ? (
          <StorySurpriseIntro
            key="intro"
            name1={partnerName1}
            name2={partnerName2}
            onStart={() => setStarted(true)}
          />
        ) : (
          <motion.div
            key="story"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="pb-20 bg-[#FFF8F2]"
          >
            {/* ── Hero ─────────────────────────────────────────────────── */}
            <StoryHero
              partnerName1={partnerName1}
              partnerName2={partnerName2}
              startDate={startDate}
              coverUrl={coverUrl}
            />

            {/* ── Music ────────────────────────────────────────────────── */}
            {music && (
              <SectionReveal>
                <StoryMusicPlayer
                  provider={music.provider}
                  trackTitle={music.trackTitle}
                  artistName={music.artistName}
                  videoId={music.videoId}
                  thumbnail={music.thumbnail}
                  audioUrl={music.audioUrl}
                />
              </SectionReveal>
            )}

            {/* ── Narrative bridge: music → memories ───────────────────── */}
            {memoriesWithAssets.length > 0 && (
              <StoryNarrativeDivider text="Toda história é feita de pequenos momentos." />
            )}

            {/* ── Timeline ─────────────────────────────────────────────── */}
            {memoriesWithAssets.length > 0 && (
              <SectionReveal>
                <StoryTimeline
                  memories={memoriesWithAssets}
                  hiddenSurprises={hiddenSurprises}
                />
              </SectionReveal>
            )}

            {/* ── General gallery ──────────────────────────────────────── */}
            {projectAssets.length > 0 && (
              <SectionReveal>
                <StoryGallery assets={projectAssets} />
              </SectionReveal>
            )}

            {/* ── Narrative bridge: memories → letter ──────────────────── */}
            {finalMessage && (
              <StoryNarrativeDivider text="Algumas palavras merecem ser guardadas para sempre." />
            )}

            {/* ── Love letter ──────────────────────────────────────────── */}
            {finalMessage && (
              <SectionReveal>
                <StoryFinalMessage message={finalMessage} authorName={authorName} />
              </SectionReveal>
            )}

            {/* ── "Hoje" section ───────────────────────────────────────── */}
            <SectionReveal>
              <StoryToday startDate={startDate} />
            </SectionReveal>

            {/* ── Stats section ────────────────────────────────────────── */}
            <SectionReveal>
              <StoryStats
                startDate={startDate}
                memoriesCount={memories.length}
                musicTrack={musicLabel}
                photosCount={photoCount > 0 ? photoCount : undefined}
              />
            </SectionReveal>

            {/* ── Moon phase & Zodiac ──────────────────────────────────── */}
            <SectionReveal>
              <StoryMoonPhase startDate={startDate} />
            </SectionReveal>
            <SectionReveal>
              <StoryZodiac startDate={startDate} />
            </SectionReveal>

            {/* ── Future message ───────────────────────────────────────── */}
            {futureMessage && (
              <SectionReveal>
                <StoryFutureMessage
                  message={futureMessage.message}
                  revealAt={futureMessage.revealAt}
                  hintText={futureMessage.hintText}
                />
              </SectionReveal>
            )}

            {/* ── CTA ──────────────────────────────────────────────────── */}
            <motion.section
              initial={reduce ? {} : { opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
              className="relative overflow-hidden px-6 py-24 text-center"
              style={{
                background:
                  'linear-gradient(180deg, #FFF8F2 0%, #FFF0F3 35%, #FDF2F8 70%, #FFFFFF 100%)',
              }}
            >
              {/* Ambient glow */}
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background:
                    'radial-gradient(ellipse 65% 50% at 50% 60%, rgba(255,77,109,0.07) 0%, transparent 70%)',
                }}
              />

              <div className="relative z-10">
                {/* Beating heart icon */}
                <motion.div
                  initial={reduce ? {} : { scale: 0 }}
                  whileInView={{ scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1, type: 'spring', stiffness: 200, damping: 14 }}
                  className="mx-auto mb-6 relative"
                  style={{ width: 56, height: 56 }}
                >
                  {!reduce && (
                    <motion.div
                      animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0.08, 0.3] }}
                      transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                      className="absolute inset-0 rounded-full blur-xl"
                      style={{ background: 'rgba(255,77,109,0.28)' }}
                    />
                  )}
                  <div
                    className="relative flex h-14 w-14 items-center justify-center rounded-full shadow-lg"
                    style={{
                      background: 'linear-gradient(135deg, #FFD0DC 0%, #FFB0C8 100%)',
                      boxShadow: '0 6px 20px rgba(255,77,109,0.28)',
                    }}
                  >
                    <Heart className="h-6 w-6 fill-[#FF4D6D] text-[#FF4D6D]" />
                  </div>
                </motion.div>

                <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E89AAE] mb-3">
                  Crie o seu
                </p>

                <h2 className="font-story text-2xl font-bold text-[#2B2B2B] mb-3 leading-snug">
                  Transforme sua história<br />em uma retrospectiva
                </h2>

                <p className="text-sm leading-relaxed mb-8 max-w-60 mx-auto" style={{ color: '#7C5E6A' }}>
                  Crie o seu LoveRecap em minutos e compartilhe com quem você ama.
                </p>

                {/* Primary CTA button */}
                <motion.div
                  whileHover={reduce ? {} : { scale: 1.04, y: -2 }}
                  whileTap={reduce ? {} : { scale: 0.97 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="inline-block"
                >
                  <Link
                    href="/create"
                    className="inline-flex items-center gap-2.5 text-white px-8 py-4 rounded-full text-sm font-semibold transition-all"
                    style={{
                      background: 'linear-gradient(135deg, #FF4D6D 0%, #FF2E63 100%)',
                      boxShadow: '0 8px 24px rgba(255,77,109,0.35), 0 2px 6px rgba(255,77,109,0.2)',
                    }}
                  >
                    <Heart className="h-4 w-4 fill-white text-white shrink-0" />
                    Crie a história de amor de vocês
                    <ArrowRight className="h-4 w-4 shrink-0" />
                  </Link>
                </motion.div>

                <p className="mt-8 text-[10px] uppercase tracking-[0.2em]" style={{ color: '#D4B8C2' }}>
                  Feito com LoveRecap
                </p>
              </div>
            </motion.section>
          </motion.div>
        )}
      </AnimatePresence>

      {started && shareUrl && <StoryShareBar url={shareUrl} title={shareTitle} />}
    </>
  )
}
