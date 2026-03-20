import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'LoveRecap — Transforme sua história de amor em uma memória linda'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #FF2D55 0%, #FF4D6D 45%, #FF8FA3 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px 80px',
          position: 'relative',
        }}
      >
        {/* Decorative hearts */}
        <div style={{ position: 'absolute', top: 48, left: 72, fontSize: 36, opacity: 0.25 }}>❤️</div>
        <div style={{ position: 'absolute', bottom: 56, right: 80, fontSize: 28, opacity: 0.2 }}>❤️</div>
        <div style={{ position: 'absolute', top: 120, right: 100, fontSize: 22, opacity: 0.18 }}>❤️</div>

        {/* Logo area */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '36px',
          }}
        >
          <span style={{ fontSize: '72px', lineHeight: 1 }}>❤️</span>
          <span
            style={{
              fontSize: '68px',
              fontWeight: 800,
              color: 'white',
              letterSpacing: '-2px',
            }}
          >
            LoveRecap
          </span>
        </div>

        {/* Tagline */}
        <p
          style={{
            fontSize: '28px',
            color: 'rgba(255,255,255,0.92)',
            textAlign: 'center',
            maxWidth: '800px',
            margin: '0 0 40px',
            lineHeight: 1.45,
            fontWeight: 400,
          }}
        >
          Transforme sua história de amor em uma memória linda para sempre
        </p>

        {/* Brand pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '100px',
            padding: '10px 28px',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>
            loverecap.app
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
