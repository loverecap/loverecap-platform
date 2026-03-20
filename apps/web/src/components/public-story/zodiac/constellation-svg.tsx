'use client'

import { Star } from './star'
import { ConnectionLine } from './connection-line'
import type { ConstellationData } from './constellation-data'

interface ConstellationSVGProps {
  data: ConstellationData
  revealed: boolean
  width?: number
  height?: number
}

export function ConstellationSVG({ data, revealed, width = 320, height = 240 }: ConstellationSVGProps) {
  const padding = 20

  function sx(x: number) {
    return padding + x * (width - padding * 2)
  }
  function sy(y: number) {
    return padding + y * (height - padding * 2)
  }

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      height="auto"
      aria-hidden="true"
      style={{ overflow: 'visible' }}
    >
      
      {data.connections.map(([ai, bi], i) => {
        const a = data.stars[ai]
        const b = data.stars[bi]
        if (!a || !b) return null
        const starDelay = Math.max(ai, bi) * 0.15
        return (
          <ConnectionLine
            key={i}
            x1={sx(a.x)}
            y1={sy(a.y)}
            x2={sx(b.x)}
            y2={sy(b.y)}
            delay={starDelay + 0.4}
            revealed={revealed}
          />
        )
      })}

      {data.stars.map((star, i) => (
        <Star
          key={i}
          cx={sx(star.x)}
          cy={sy(star.y)}
          size={star.size}
          delay={i * 0.15}
          revealed={revealed}
        />
      ))}
    </svg>
  )
}
