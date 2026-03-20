import type { ZodiacSign } from './zodiac-utils'

export interface StarPoint {
  x: number
  y: number
  size: number
  name?: string
}

export interface ConstellationData {
  sign: ZodiacSign
  stars: StarPoint[]
  connections: Array<[number, number]>
}

const constellations: ConstellationData[] = [
  {
    sign: 'Aries',
    stars: [
      { x: 0.55, y: 0.28, size: 3.2, name: 'Hamal' },
      { x: 0.47, y: 0.42, size: 2.6, name: 'Sheratan' },
      { x: 0.41, y: 0.52, size: 2.0, name: 'Mesarthim' },
      { x: 0.62, y: 0.18, size: 1.8 },
      { x: 0.36, y: 0.62, size: 1.5 },
    ],
    connections: [[0, 1], [1, 2], [2, 4], [0, 3]],
  },
  {
    sign: 'Taurus',
    stars: [
      { x: 0.50, y: 0.35, size: 3.4, name: 'Aldebaran' },
      { x: 0.38, y: 0.28, size: 2.0 },
      { x: 0.44, y: 0.22, size: 1.8 },
      { x: 0.32, y: 0.34, size: 1.6 },
      { x: 0.62, y: 0.42, size: 2.2 },
      { x: 0.68, y: 0.30, size: 1.7 },
      { x: 0.58, y: 0.52, size: 1.9 },
    ],
    connections: [[0, 1], [1, 2], [1, 3], [0, 4], [4, 5], [4, 6]],
  },
  {
    sign: 'Gemini',
    stars: [
      { x: 0.32, y: 0.20, size: 3.1, name: 'Castor' },
      { x: 0.44, y: 0.18, size: 3.3, name: 'Pollux' },
      { x: 0.28, y: 0.35, size: 2.0 },
      { x: 0.26, y: 0.50, size: 1.8 },
      { x: 0.30, y: 0.65, size: 2.2 },
      { x: 0.40, y: 0.32, size: 1.9 },
      { x: 0.42, y: 0.48, size: 2.0 },
      { x: 0.44, y: 0.62, size: 1.7 },
    ],
    connections: [[0, 2], [2, 3], [3, 4], [1, 5], [5, 6], [6, 7], [2, 5]],
  },
  {
    sign: 'Cancer',
    stars: [
      { x: 0.50, y: 0.40, size: 2.2, name: 'Asellus Australis' },
      { x: 0.50, y: 0.28, size: 2.0, name: 'Asellus Borealis' },
      { x: 0.34, y: 0.50, size: 2.4 },
      { x: 0.66, y: 0.50, size: 2.3 },
      { x: 0.42, y: 0.65, size: 1.6 },
      { x: 0.58, y: 0.65, size: 1.5 },
    ],
    connections: [[2, 0], [0, 3], [1, 0], [0, 4], [0, 5]],
  },
  {
    sign: 'Leo',
    stars: [
      { x: 0.50, y: 0.32, size: 3.5, name: 'Regulus' },
      { x: 0.36, y: 0.22, size: 2.4 },
      { x: 0.28, y: 0.30, size: 2.0 },
      { x: 0.30, y: 0.44, size: 1.8 },
      { x: 0.40, y: 0.48, size: 2.2 },
      { x: 0.62, y: 0.28, size: 2.6, name: 'Denebola' },
      { x: 0.68, y: 0.22, size: 1.9 },
      { x: 0.56, y: 0.48, size: 1.7 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 5], [5, 6], [5, 7]],
  },
  {
    sign: 'Virgo',
    stars: [
      { x: 0.50, y: 0.28, size: 3.4, name: 'Spica' },
      { x: 0.36, y: 0.20, size: 2.2 },
      { x: 0.28, y: 0.32, size: 2.0 },
      { x: 0.34, y: 0.46, size: 1.8 },
      { x: 0.50, y: 0.50, size: 2.0 },
      { x: 0.64, y: 0.36, size: 2.3 },
      { x: 0.70, y: 0.22, size: 1.9 },
      { x: 0.62, y: 0.56, size: 1.6 },
    ],
    connections: [[1, 2], [2, 3], [3, 4], [4, 0], [0, 5], [5, 6], [5, 7], [1, 6]],
  },
  {
    sign: 'Libra',
    stars: [
      { x: 0.50, y: 0.25, size: 2.8, name: 'Zubenelgenubi' },
      { x: 0.38, y: 0.42, size: 2.6 },
      { x: 0.62, y: 0.42, size: 2.3 },
      { x: 0.50, y: 0.58, size: 2.0 },
      { x: 0.30, y: 0.60, size: 1.5 },
      { x: 0.70, y: 0.60, size: 1.5 },
    ],
    connections: [[0, 1], [0, 2], [1, 3], [2, 3], [1, 4], [2, 5]],
  },
  {
    sign: 'Scorpio',
    stars: [
      { x: 0.38, y: 0.22, size: 3.4, name: 'Antares' },
      { x: 0.30, y: 0.18, size: 2.0 },
      { x: 0.28, y: 0.32, size: 2.0 },
      { x: 0.34, y: 0.44, size: 1.8 },
      { x: 0.42, y: 0.52, size: 2.0 },
      { x: 0.50, y: 0.60, size: 1.8 },
      { x: 0.58, y: 0.65, size: 1.7 },
      { x: 0.66, y: 0.60, size: 2.0 },
      { x: 0.70, y: 0.50, size: 1.6 },
    ],
    connections: [[1, 0], [0, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8]],
  },
  {
    sign: 'Sagittarius',
    stars: [
      { x: 0.50, y: 0.30, size: 2.8 },
      { x: 0.36, y: 0.24, size: 2.4 },
      { x: 0.28, y: 0.38, size: 2.0 },
      { x: 0.36, y: 0.50, size: 2.2 },
      { x: 0.50, y: 0.50, size: 2.0 },
      { x: 0.62, y: 0.42, size: 2.3 },
      { x: 0.68, y: 0.28, size: 1.9 },
      { x: 0.56, y: 0.62, size: 1.7 },
      { x: 0.44, y: 0.66, size: 1.6 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 0], [0, 5], [5, 6], [4, 7], [7, 8], [8, 3]],
  },
  {
    sign: 'Capricorn',
    stars: [
      { x: 0.28, y: 0.30, size: 2.8, name: 'Algedi' },
      { x: 0.38, y: 0.25, size: 2.4 },
      { x: 0.50, y: 0.22, size: 2.0 },
      { x: 0.62, y: 0.30, size: 2.2 },
      { x: 0.70, y: 0.42, size: 1.9 },
      { x: 0.62, y: 0.55, size: 1.8 },
      { x: 0.50, y: 0.62, size: 2.0 },
      { x: 0.38, y: 0.55, size: 1.7 },
      { x: 0.28, y: 0.46, size: 1.6 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 0]],
  },
  {
    sign: 'Aquarius',
    stars: [
      { x: 0.36, y: 0.25, size: 2.8, name: 'Sadalsuud' },
      { x: 0.50, y: 0.32, size: 2.3 },
      { x: 0.42, y: 0.44, size: 2.0 },
      { x: 0.28, y: 0.50, size: 1.8 },
      { x: 0.56, y: 0.52, size: 1.9 },
      { x: 0.48, y: 0.62, size: 1.7 },
      { x: 0.60, y: 0.68, size: 1.6 },
      { x: 0.36, y: 0.70, size: 1.5 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [2, 4], [4, 5], [5, 6], [5, 7]],
  },
  {
    sign: 'Pisces',
    stars: [
      { x: 0.30, y: 0.30, size: 2.4 },
      { x: 0.22, y: 0.42, size: 2.0 },
      { x: 0.28, y: 0.54, size: 1.8 },
      { x: 0.38, y: 0.60, size: 2.0 },
      { x: 0.50, y: 0.55, size: 2.2, name: 'Alrescha' },
      { x: 0.62, y: 0.50, size: 2.0 },
      { x: 0.70, y: 0.38, size: 1.8 },
      { x: 0.68, y: 0.26, size: 2.0 },
      { x: 0.58, y: 0.22, size: 1.7 },
    ],
    connections: [[0, 1], [1, 2], [2, 3], [3, 4], [4, 5], [5, 6], [6, 7], [7, 8], [8, 0]],
  },
]

export const CONSTELLATION_MAP: Record<ZodiacSign, ConstellationData> = Object.fromEntries(
  constellations.map((c) => [c.sign, c])
) as Record<ZodiacSign, ConstellationData>
