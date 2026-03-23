'use client'

import { useRef, useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion'
import { Play, Pause, Music2 } from 'lucide-react'

interface StoryMusicPlayerProps {
  provider: 'youtube' | 'file' | 'external_url'
  trackTitle: string
  artistName: string | null | undefined
  videoId: string | null | undefined
  thumbnail: string | null | undefined
  audioUrl: string | null | undefined
  autoPlay?: boolean
}

const BAR_HEIGHTS = [0.5, 1.0, 0.65, 0.85, 0.55, 0.75, 0.45]

function EqualizerBars({ playing }: { playing: boolean }) {
  const reduce = useReducedMotion()
  return (
    <div className="flex items-end gap-px" style={{ height: 20 }} aria-hidden="true">
      {BAR_HEIGHTS.map((h, i) => (
        <motion.span
          key={i}
          className="block w-0.5 rounded-full bg-white/80"
          animate={
            playing && !reduce
              ? { scaleY: [0.25, h, 0.25] }
              : { scaleY: 0.25 }
          }
          transition={
            playing && !reduce
              ? { duration: 0.7 + i * 0.05, repeat: Infinity, delay: i * 0.1, ease: 'easeInOut' }
              : { duration: 0.25 }
          }
          style={{ height: 20, transformOrigin: 'bottom' }}
        />
      ))}
    </div>
  )
}

function sendYT(iframe: HTMLIFrameElement | null, func: string) {
  iframe?.contentWindow?.postMessage(
    JSON.stringify({ event: 'command', func, args: [] }),
    'https://www.youtube.com',
  )
}

function YouTubeMusicPlayer({
  videoId,
  trackTitle,
  artistName,
  thumbnail,
  autoPlay,
}: {
  videoId: string
  trackTitle: string
  artistName: string | null | undefined
  thumbnail: string | null | undefined
  autoPlay?: boolean
}) {
  const iframeRef = useRef<HTMLIFrameElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    function onMessage(e: MessageEvent) {
      if (typeof e.data !== 'string') return
      try {
        const data = JSON.parse(e.data) as { event?: string; info?: number }
        if (data.event === 'onReady' && autoPlay && !reduce) {
          sendYT(iframeRef.current, 'playVideo')
        }
        if (data.event === 'onStateChange') {
          setPlaying(data.info === 1)
        }
      } catch {  }
    }
    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoPlay, reduce])

  function handleIframeLoad() {
    iframeRef.current?.contentWindow?.postMessage(
      JSON.stringify({ event: 'listening', id: 'loverecap-player' }),
      'https://www.youtube.com',
    )
  }

  const toggle = useCallback(() => {
    if (playing) {
      setPlaying(false)
      sendYT(iframeRef.current, 'pauseVideo')
    } else {
      setPlaying(true)
      sendYT(iframeRef.current, 'playVideo')
    }
  }, [playing])

  const thumbSrc = thumbnail ?? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`

  return (
    <div className="relative">
      
      <div
        aria-hidden="true"
        style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden', pointerEvents: 'none' }}
      >
        <iframe
          ref={iframeRef}
          src={`https://www.youtube.com/embed/${videoId}?enablejsapi=1&autoplay=0&controls=0&loop=1&playlist=${videoId}&modestbranding=1&rel=0`}
          allow="autoplay; encrypted-media"
          title={`${trackTitle} — audio`}
          onLoad={handleIframeLoad}
          width="1"
          height="1"
        />
      </div>

      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 28 }}
        whileInView={reduce ? {} : { opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.05 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className="mx-auto max-w-sm w-full"
      >
        <div
          className="overflow-hidden rounded-3xl"
          style={{ boxShadow: '0 8px 32px rgba(255,77,109,0.16), 0 2px 8px rgba(0,0,0,0.06)' }}
        >
          
          <div className="flex" style={{ minHeight: 160 }}>

            <div className="relative w-1/2 shrink-0">
              <img
                src={thumbSrc}
                alt={trackTitle}
                className="h-full w-full object-cover"
                style={{ minHeight: 160 }}
                loading="lazy"
              />
              
              <div
                className="absolute inset-y-0 right-0 w-8 pointer-events-none"
                style={{ background: 'linear-gradient(to right, transparent, rgba(255,255,255,0.9))' }}
              />
              
              {playing && !reduce && (
                <motion.div
                  className="absolute inset-0 pointer-events-none"
                  animate={{ opacity: [0.2, 0.45, 0.2] }}
                  transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
                  style={{ background: 'linear-gradient(135deg, rgba(255,77,109,0.25), transparent)' }}
                />
              )}
            </div>

            <div
              className="flex flex-1 flex-col justify-between px-4 py-4"
              style={{ background: 'linear-gradient(135deg, #FFFFFF 0%, #FFF5F7 100%)' }}
            >
              
              <div className="flex items-center justify-between">
                <span className="text-[9px] font-semibold uppercase tracking-[0.22em] text-[#E89AAE]">
                  Nossa música
                </span>
                <AnimatePresence>
                  {playing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                    >
                      <EqualizerBars playing={playing} />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="space-y-0.5 my-2">
                <p className="font-story text-base font-bold text-[#2B2B2B] leading-snug line-clamp-2">
                  {trackTitle}
                </p>
                {artistName && (
                  <p className="text-xs text-[#9B8FA0] truncate">{artistName}</p>
                )}
              </div>

              <div className="flex items-center">
                <motion.button
                  whileHover={reduce ? {} : { scale: 1.1 }}
                  whileTap={reduce ? {} : { scale: 0.9 }}
                  onClick={toggle}
                  aria-label={playing ? 'Pausar música' : 'Tocar música'}
                  className="relative flex h-11 w-11 items-center justify-center rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2"
                  style={{
                    background: 'linear-gradient(135deg, #FF6B87 0%, #FF4D6D 100%)',
                    boxShadow: playing
                      ? '0 6px 20px rgba(255,77,109,0.50)'
                      : '0 4px 14px rgba(255,77,109,0.32)',
                  }}
                >
                  
                  {playing && !reduce && (
                    <motion.span
                      className="absolute inset-0 rounded-full border border-[#FF4D6D]/60"
                      animate={{ scale: [1, 1.6], opacity: [0.7, 0] }}
                      transition={{ duration: 1.4, repeat: Infinity, ease: 'easeOut' }}
                    />
                  )}
                  <AnimatePresence mode="wait" initial={false}>
                    {playing ? (
                      <motion.span
                        key="pause"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        className="flex"
                      >
                        <Pause className="h-5 w-5 text-white fill-white" />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="play"
                        initial={{ scale: 0.6, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0.6, opacity: 0 }}
                        transition={{ duration: 0.12 }}
                        className="flex translate-x-px"
                      >
                        <Play className="h-5 w-5 text-white fill-white" />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

function LegacyAudioPlayer({
  audioUrl,
  trackTitle,
  artistName,
  autoPlay,
}: {
  audioUrl: string
  trackTitle: string
  artistName: string | null | undefined
  autoPlay?: boolean
}) {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [playing, setPlaying] = useState(false)
  const reduce = useReducedMotion()

  useEffect(() => {
    const audio = new Audio(audioUrl)
    audio.loop = true
    audio.volume = 0.35
    audioRef.current = audio
    if (autoPlay && !reduce) {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
    return () => { audio.pause(); audio.src = '' }
  }, [audioUrl]) // eslint-disable-line react-hooks/exhaustive-deps

  function toggle() {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
      setPlaying(false)
    } else {
      audio.play().then(() => setPlaying(true)).catch(() => {})
    }
  }

  return (
    <motion.div
      initial={reduce ? {} : { opacity: 0, y: 28 }}
      whileInView={reduce ? {} : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.05 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="mx-auto max-w-sm w-full"
    >
      <div
        className="flex items-center gap-4 rounded-3xl bg-white px-5 py-4"
        style={{ boxShadow: '0 4px 24px rgba(255,77,109,0.10), 0 1px 4px rgba(0,0,0,0.06)' }}
      >
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#FFF0F3]">
          <Music2 className="h-6 w-6 text-[#FF4D6D]" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-story text-sm font-bold text-[#2B2B2B] truncate">{trackTitle}</p>
          {artistName && <p className="text-xs text-[#9B8FA0] truncate">{artistName}</p>}
        </div>
        <motion.button
          whileHover={reduce ? {} : { scale: 1.1 }}
          whileTap={reduce ? {} : { scale: 0.9 }}
          onClick={toggle}
          aria-label={playing ? 'Pausar' : 'Tocar'}
          className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2"
          style={{
            background: 'linear-gradient(135deg, #FF6B87 0%, #FF4D6D 100%)',
            boxShadow: '0 4px 14px rgba(255,77,109,0.30)',
          }}
        >
          {playing
            ? <Pause className="h-5 w-5 fill-white text-white" />
            : <Play className="h-5 w-5 fill-white text-white translate-x-px" />
          }
        </motion.button>
      </div>
    </motion.div>
  )
}

export function StoryMusicPlayer({
  provider,
  trackTitle,
  artistName,
  videoId,
  thumbnail,
  audioUrl,
  autoPlay,
}: StoryMusicPlayerProps) {
  return (
    <section
      aria-label="Música da história"
      className="px-5 py-14"
      style={{ background: 'linear-gradient(180deg, #FFF8F2 0%, #FFF0F3 60%, #FFF8F2 100%)' }}
    >
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E89AAE] mb-6"
      >
        ♪ A trilha sonora desta história
      </motion.p>

      {provider === 'youtube' && videoId ? (
        <YouTubeMusicPlayer
          videoId={videoId}
          trackTitle={trackTitle}
          artistName={artistName}
          thumbnail={thumbnail}
          {...(autoPlay ? { autoPlay } : {})}
        />
      ) : audioUrl ? (
        <LegacyAudioPlayer
          audioUrl={audioUrl}
          trackTitle={trackTitle}
          artistName={artistName}
          {...(autoPlay ? { autoPlay } : {})}
        />
      ) : null}
    </section>
  )
}
