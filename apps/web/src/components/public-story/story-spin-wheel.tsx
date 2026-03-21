'use client'

import { useState } from 'react'
import { motion, useReducedMotion, AnimatePresence } from 'framer-motion'
import { RefreshCw } from 'lucide-react'

// ─── Options ──────────────────────────────────────────────────────────────────

const OPTIONS = [
  { label: 'Restaurante' },
  { label: 'Cinema' },
  { label: 'Sorveteria' },
  { label: 'Parque' },
  { label: 'Pizza' },
  { label: 'Spa' },
  { label: 'Netflix' },
  { label: 'Praia' },
]

// 3-tone pink alternating palette — brand-consistent
const SLICE_COLORS = ['#FF4D6D', '#FF7A96', '#FFAEC0']

// ─── Geometry helpers ─────────────────────────────────────────────────────────

const N = OPTIONS.length
const SLICE_DEG = 360 / N
const CX = 160
const CY = 160
const R = 146

function polar(cx: number, cy: number, r: number, deg: number) {
  const rad = ((deg - 90) * Math.PI) / 180
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) }
}

function arcPath(cx: number, cy: number, r: number, start: number, end: number) {
  const s = polar(cx, cy, r, start)
  const e = polar(cx, cy, r, end)
  const large = end - start > 180 ? 1 : 0
  return `M${cx} ${cy} L${s.x.toFixed(2)} ${s.y.toFixed(2)} A${r} ${r} 0 ${large} 1 ${e.x.toFixed(2)} ${e.y.toFixed(2)}Z`
}

// ─── Confetti (deterministic — stable across renders) ─────────────────────────

const CONFETTI_COLORS = ['#FF4D6D', '#FF7A96', '#FFAEC0', '#FFD6E0', '#FFF0F3']
const CONFETTI = Array.from({ length: 32 }, (_, i) => {
  const angle = (i / 32) * 360
  const dist = 70 + (i % 6) * 22
  const rad = (angle * Math.PI) / 180
  return {
    id: i,
    x: Math.cos(rad) * dist,
    y: Math.sin(rad) * dist,
    color: CONFETTI_COLORS[i % CONFETTI_COLORS.length]!,
    size: 4 + (i % 5) * 2,
    rotate: angle * 3,
    delay: (i % 8) * 0.04,
  }
})

// ─── Component ────────────────────────────────────────────────────────────────

export function StorySpinWheel() {
  const reduce = useReducedMotion()
  const [totalDeg, setTotalDeg] = useState(0)
  const [spinning, setSpinning] = useState(false)
  const [winner, setWinner] = useState<string | null>(null)
  const [showConfetti, setShowConfetti] = useState(false)

  function spin() {
    if (spinning) return
    if (winner) { reset(); return }

    const extraSpins = reduce ? 1 : (4 + Math.random() * 4)
    const extraAngle = Math.random() * 360
    const next = totalDeg + extraSpins * 360 + extraAngle
    const duration = reduce ? 50 : 4200

    setTotalDeg(next)
    setSpinning(true)
    setWinner(null)
    setShowConfetti(false)

    setTimeout(() => {
      const norm = ((next % 360) + 360) % 360
      const offset = (360 - norm + 360) % 360
      const idx = Math.floor(offset / SLICE_DEG) % N
      setWinner(OPTIONS[idx]!.label)
      setShowConfetti(true)
      setSpinning(false)
    }, duration + 150)
  }

  function reset() {
    setWinner(null)
    setShowConfetti(false)
  }

  // Heart path (Lucide Heart, scaled to ~18px, centered at CX/CY)
  const hs = 0.78
  const htx = CX - 12 * hs
  const hty = CY - 12 * hs

  return (
    <section
      className="relative overflow-hidden py-16 px-5"
      style={{ background: 'linear-gradient(180deg, #1C0A12 0%, #100409 100%)' }}
    >
      {/* Ambient pink glow top */}
      <div
        className="pointer-events-none absolute -top-16 left-1/2 -translate-x-1/2 h-64 w-64 rounded-full opacity-25"
        style={{ background: 'radial-gradient(ellipse, #FF4D6D 0%, transparent 70%)' }}
      />

      <div className="relative mx-auto max-w-sm">

        {/* ── Header ── */}
        <div className="mb-8 text-center">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.28em] text-[#FF8FA3]">
            Jogo do casal
          </p>
          <h2 className="font-story text-[1.7rem] font-bold leading-snug text-white">
            Para onde vocês vão hoje?
          </h2>
          <p className="mt-2 text-[13px] leading-relaxed text-white/45">
            Girem a roleta e deixem o destino decidir
          </p>
        </div>

        {/* ── Wheel container ── */}
        <div className="flex flex-col items-center">

          {/* Pointer triangle */}
          <div className="relative z-10 mb-[-2px]">
            <svg width="22" height="15" viewBox="0 0 22 15" aria-hidden="true">
              <polygon
                points="11,13 1,1 21,1"
                fill="#FF4D6D"
                stroke="#FF4D6D"
                strokeWidth="1"
                strokeLinejoin="round"
                style={{ filter: 'drop-shadow(0 3px 6px rgba(255,77,109,0.7))' }}
              />
            </svg>
          </div>

          {/* Wheel SVG */}
          <div className="relative w-full" style={{ maxWidth: 320 }}>
            <motion.svg
              viewBox="0 0 320 320"
              className="w-full drop-shadow-xl"
              animate={{ rotate: totalDeg }}
              transition={
                spinning
                  ? { duration: 4.2, ease: [0.15, 0.65, 0.10, 0.99] }
                  : { duration: 0 }
              }
              aria-label="Roleta de ideias para o casal"
            >
              {/* Outer decorative ring */}
              <circle
                cx={CX} cy={CY} r={R + 5}
                fill="none"
                stroke="rgba(255,77,109,0.18)"
                strokeWidth="3"
              />

              {/* Slices */}
              {OPTIONS.map((opt, i) => {
                const start = i * SLICE_DEG
                const end = start + SLICE_DEG
                const mid = start + SLICE_DEG / 2
                const color = SLICE_COLORS[i % SLICE_COLORS.length]!
                const lp = polar(CX, CY, R * 0.62, mid)
                const textRot = mid - 90

                return (
                  <g key={i}>
                    <path
                      d={arcPath(CX, CY, R, start, end)}
                      fill={color}
                      stroke="#1C0A12"
                      strokeWidth="1.5"
                    />
                    <text
                      x={lp.x}
                      y={lp.y}
                      textAnchor="middle"
                      dominantBaseline="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="700"
                      letterSpacing="0.015em"
                      transform={`rotate(${textRot}, ${lp.x}, ${lp.y})`}
                      style={{ userSelect: 'none', pointerEvents: 'none' }}
                    >
                      {opt.label}
                    </text>
                  </g>
                )
              })}

              {/* Center glow */}
              <circle cx={CX} cy={CY} r={30} fill="rgba(0,0,0,0.35)" />
              {/* Center circle */}
              <circle
                cx={CX} cy={CY} r={24}
                fill="url(#centerGrad)"
              />
              {/* Gradient def */}
              <defs>
                <radialGradient id="centerGrad" cx="40%" cy="35%">
                  <stop offset="0%" stopColor="#FF7A96" />
                  <stop offset="100%" stopColor="#E8003E" />
                </radialGradient>
              </defs>
              {/* Heart icon (Lucide path scaled) */}
              <path
                d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
                fill="white"
                fillOpacity="0.92"
                transform={`translate(${htx.toFixed(1)}, ${hty.toFixed(1)}) scale(${hs})`}
              />
            </motion.svg>

            {/* ── Winner overlay ── */}
            <AnimatePresence>
              {winner && (
                <motion.div
                  className="absolute inset-0 flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {/* Confetti burst */}
                  {showConfetti && !reduce && CONFETTI.map((p) => (
                    <motion.div
                      key={p.id}
                      className="absolute rounded-full"
                      style={{
                        width: p.size,
                        height: p.size,
                        background: p.color,
                        top: '50%',
                        left: '50%',
                        marginTop: -p.size / 2,
                        marginLeft: -p.size / 2,
                      }}
                      initial={{ x: 0, y: 0, opacity: 1, scale: 0, rotate: 0 }}
                      animate={{ x: p.x, y: p.y, opacity: 0, scale: 1.2, rotate: p.rotate }}
                      transition={{ duration: 0.85, delay: p.delay, ease: 'easeOut' }}
                    />
                  ))}

                  {/* Winner card */}
                  <motion.div
                    className="relative rounded-2xl px-7 py-5 text-center"
                    style={{
                      background: 'rgba(16, 4, 9, 0.92)',
                      border: '1px solid rgba(255,77,109,0.45)',
                      backdropFilter: 'blur(16px)',
                      boxShadow: '0 0 32px rgba(255,77,109,0.25), 0 16px 48px rgba(0,0,0,0.6)',
                    }}
                    initial={{ scale: 0.6, opacity: 0, y: 10 }}
                    animate={{ scale: 1, opacity: 1, y: 0 }}
                    exit={{ scale: 0.8, opacity: 0 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 22, delay: 0.1 }}
                  >
                    <p className="text-[10px] font-semibold uppercase tracking-[0.26em] text-[#FF8FA3]">
                      Destino escolhido
                    </p>
                    <p className="mt-1.5 font-story text-[1.6rem] font-bold text-white">
                      {winner}
                    </p>
                    <p className="mt-1 text-xs text-white/50">
                      Aproveitem o programa! 🎉
                    </p>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Buttons ── */}
          <div className="mt-6 w-full space-y-3">
            <button
              onClick={spin}
              disabled={spinning}
              className="flex h-14 w-full cursor-pointer items-center justify-center gap-2.5 rounded-full text-[15px] font-semibold text-white transition-all active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60"
              style={{
                background: winner
                  ? 'rgba(255,77,109,0.18)'
                  : spinning
                    ? 'rgba(255,77,109,0.35)'
                    : 'linear-gradient(135deg, #FF4D6D 0%, #E8003E 100%)',
                border: winner ? '1px solid rgba(255,77,109,0.4)' : 'none',
                boxShadow: winner || spinning ? 'none' : '0 8px 28px rgba(255,77,109,0.44)',
              }}
              aria-label={spinning ? 'Girando roleta' : winner ? 'Girar de novo' : 'Girar a roleta'}
            >
              {spinning ? (
                <>
                  <motion.span
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    className="inline-flex"
                  >
                    <RefreshCw className="h-4 w-4" />
                  </motion.span>
                  Girando…
                </>
              ) : winner ? (
                <>
                  <RefreshCw className="h-4 w-4" />
                  Girar de novo
                </>
              ) : (
                'Girar a roleta'
              )}
            </button>
          </div>

          {/* ── Footer note ── */}
          <p className="mt-5 text-center text-[11px] text-white/25">
            Joguem juntos · a escolha é do destino
          </p>
        </div>
      </div>
    </section>
  )
}
