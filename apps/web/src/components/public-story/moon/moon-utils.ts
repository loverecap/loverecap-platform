// Pure JS moon phase calculator — no external packages
// Algorithm: Julian Day Number with known new moon anchor
// Known new moon: Jan 6, 2000 00:00 UTC = JD 2451549.5
// Synodic period: 29.530588853 days

export interface MoonPhaseResult {
  phase: number        // 0–1 (0=new, 0.25=first quarter, 0.5=full, 0.75=last quarter)
  age: number          // days since last new moon (0–29.53)
  illumination: number // 0–100 percent
  name: string         // Portuguese phase name
  emoji: string
}

const SYNODIC = 29.530588853
const KNOWN_NEW_MOON_JD = 2451549.5 // Jan 6, 2000 UTC

function dateToJD(dateStr: string): number {
  const d = new Date(dateStr + 'T12:00:00Z')
  // Julian Day Number formula
  const y = d.getUTCFullYear()
  const m = d.getUTCMonth() + 1
  const day = d.getUTCDate()

  const a = Math.floor((14 - m) / 12)
  const yr = y + 4800 - a
  const mo = m + 12 * a - 3

  return (
    day +
    Math.floor((153 * mo + 2) / 5) +
    365 * yr +
    Math.floor(yr / 4) -
    Math.floor(yr / 100) +
    Math.floor(yr / 400) -
    32045
  )
}

function getPhaseName(phase: number): { name: string; emoji: string } {
  if (phase < 0.033 || phase >= 0.967) return { name: 'Lua Nova', emoji: '🌑' }
  if (phase < 0.185) return { name: 'Lua Crescente', emoji: '🌒' }
  if (phase < 0.315) return { name: 'Quarto Crescente', emoji: '🌓' }
  if (phase < 0.435) return { name: 'Lua Gibosa Crescente', emoji: '🌔' }
  if (phase < 0.565) return { name: 'Lua Cheia', emoji: '🌕' }
  if (phase < 0.685) return { name: 'Lua Gibosa Minguante', emoji: '🌖' }
  if (phase < 0.815) return { name: 'Quarto Minguante', emoji: '🌗' }
  return { name: 'Lua Minguante', emoji: '🌘' }
}

export function getMoonPhase(dateStr: string): MoonPhaseResult {
  const jd = dateToJD(dateStr)
  const daysSinceAnchor = jd - KNOWN_NEW_MOON_JD
  const cycles = daysSinceAnchor / SYNODIC
  const phase = cycles - Math.floor(cycles) // 0–1
  const age = phase * SYNODIC
  // Illumination: approximate — increases from 0 to 100 and back
  const illumination = Math.round((1 - Math.cos(2 * Math.PI * phase)) / 2 * 100)
  const { name, emoji } = getPhaseName(phase)

  return { phase, age, illumination, name, emoji }
}
