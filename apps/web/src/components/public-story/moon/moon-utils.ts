
export interface MoonPhaseResult {
  phase: number
  age: number
  illumination: number
  name: string
  emoji: string
}

const SYNODIC = 29.530588853
const KNOWN_NEW_MOON_JD = 2451549.5

function dateToJD(dateStr: string): number {
  const d = new Date(dateStr + 'T12:00:00Z')
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
  const phase = cycles - Math.floor(cycles)
  const age = phase * SYNODIC
  const illumination = Math.round((1 - Math.cos(2 * Math.PI * phase)) / 2 * 100)
  const { name, emoji } = getPhaseName(phase)

  return { phase, age, illumination, name, emoji }
}
