
export type ZodiacSign =
  | 'Aries' | 'Taurus' | 'Gemini' | 'Cancer' | 'Leo' | 'Virgo'
  | 'Libra' | 'Scorpio' | 'Sagittarius' | 'Capricorn' | 'Aquarius' | 'Pisces'

export interface ZodiacResult {
  sign: ZodiacSign
  name_pt: string
  element: string
  element_emoji: string
  tagline: string
  emoji: string
}

interface SignEntry {
  sign: ZodiacSign
  name_pt: string
  element: string
  element_emoji: string
  tagline: string
  emoji: string
  startMonth: number
  startDay: number
  endMonth: number
  endDay: number
}

const SIGNS: SignEntry[] = [
  {
    sign: 'Capricorn', name_pt: 'Capricórnio', element: 'Terra', element_emoji: '🌍', emoji: '♑',
    tagline: 'Determinados e leais, construíram algo para durar para sempre',
    startMonth: 12, startDay: 22, endMonth: 1, endDay: 19,
  },
  {
    sign: 'Aquarius', name_pt: 'Aquário', element: 'Ar', element_emoji: '💨', emoji: '♒',
    tagline: 'Únicos e visionários, a história de vocês não segue regras',
    startMonth: 1, startDay: 20, endMonth: 2, endDay: 18,
  },
  {
    sign: 'Pisces', name_pt: 'Peixes', element: 'Água', element_emoji: '💧', emoji: '♓',
    tagline: 'Sonhadores e intuitivos, o amor de vocês é puro e profundo',
    startMonth: 2, startDay: 19, endMonth: 3, endDay: 20,
  },
  {
    sign: 'Aries', name_pt: 'Áries', element: 'Fogo', element_emoji: '🔥', emoji: '♈',
    tagline: 'Corajosos e apaixonados, escolheram o amor sem hesitar',
    startMonth: 3, startDay: 21, endMonth: 4, endDay: 19,
  },
  {
    sign: 'Taurus', name_pt: 'Touro', element: 'Terra', element_emoji: '🌍', emoji: '♉',
    tagline: 'Devotados e constantes, um amor que só fica mais forte com o tempo',
    startMonth: 4, startDay: 20, endMonth: 5, endDay: 20,
  },
  {
    sign: 'Gemini', name_pt: 'Gêmeos', element: 'Ar', element_emoji: '💨', emoji: '♊',
    tagline: 'Curiosos e comunicativos, sempre têm algo novo para descobrir juntos',
    startMonth: 5, startDay: 21, endMonth: 6, endDay: 20,
  },
  {
    sign: 'Cancer', name_pt: 'Câncer', element: 'Água', element_emoji: '💧', emoji: '♋',
    tagline: 'Sensíveis e protetores, o lar de vocês é onde está o coração',
    startMonth: 6, startDay: 21, endMonth: 7, endDay: 22,
  },
  {
    sign: 'Leo', name_pt: 'Leão', element: 'Fogo', element_emoji: '🔥', emoji: '♌',
    tagline: 'Generosos e leais, o amor de vocês brilha para todo o mundo ver',
    startMonth: 7, startDay: 23, endMonth: 8, endDay: 22,
  },
  {
    sign: 'Virgo', name_pt: 'Virgem', element: 'Terra', element_emoji: '🌍', emoji: '♍',
    tagline: 'Dedicados e cuidadosos, cada detalhe da relação é cultivado com amor',
    startMonth: 8, startDay: 23, endMonth: 9, endDay: 22,
  },
  {
    sign: 'Libra', name_pt: 'Libra', element: 'Ar', element_emoji: '💨', emoji: '♎',
    tagline: 'Harmoniosos e justos, encontraram o equilíbrio perfeito um no outro',
    startMonth: 9, startDay: 23, endMonth: 10, endDay: 22,
  },
  {
    sign: 'Scorpio', name_pt: 'Escorpião', element: 'Água', element_emoji: '💧', emoji: '♏',
    tagline: 'Intensos e apaixonados, a profundidade do amor de vocês é imensurável',
    startMonth: 10, startDay: 23, endMonth: 11, endDay: 21,
  },
  {
    sign: 'Sagittarius', name_pt: 'Sagitário', element: 'Fogo', element_emoji: '🔥', emoji: '♐',
    tagline: 'Aventureiros e otimistas, o mundo é uma aventura que vivem juntos',
    startMonth: 11, startDay: 22, endMonth: 12, endDay: 21,
  },
]

export function getZodiacSign(dateStr: string): ZodiacResult {
  const d = new Date(dateStr + 'T12:00:00Z')
  const month = d.getUTCMonth() + 1
  const day = d.getUTCDate()

  for (const entry of SIGNS) {
    if (entry.sign === 'Capricorn') {
      if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) {
        return { sign: entry.sign, name_pt: entry.name_pt, element: entry.element, element_emoji: entry.element_emoji, tagline: entry.tagline, emoji: entry.emoji }
      }
      continue
    }
    if (
      (month === entry.startMonth && day >= entry.startDay) ||
      (month === entry.endMonth && day <= entry.endDay)
    ) {
      return { sign: entry.sign, name_pt: entry.name_pt, element: entry.element, element_emoji: entry.element_emoji, tagline: entry.tagline, emoji: entry.emoji }
    }
  }

  const fallback = SIGNS[0]!
  return { sign: fallback.sign, name_pt: fallback.name_pt, element: fallback.element, element_emoji: fallback.element_emoji, tagline: fallback.tagline, emoji: fallback.emoji }
}
