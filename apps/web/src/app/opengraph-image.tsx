import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'LoveRecap — Turn your love story into a beautiful memory'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #FF4D6D 0%, #FF6B8A 50%, #FFB3C1 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          padding: '60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '20px',
            marginBottom: '32px',
          }}
        >
          <span style={{ fontSize: '72px' }}>❤️</span>
          <span
            style={{
              fontSize: '64px',
              fontWeight: 700,
              color: 'white',
              letterSpacing: '-1px',
            }}
          >
            LoveRecap
          </span>
        </div>
        <p
          style={{
            fontSize: '30px',
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            maxWidth: '760px',
            margin: '0',
            lineHeight: 1.4,
          }}
        >
          Turn your love story into a beautiful shareable memory
        </p>
        <p
          style={{
            fontSize: '20px',
            color: 'rgba(255,255,255,0.65)',
            marginTop: '20px',
            margin: '20px 0 0',
          }}
        >
          loverecap.app
        </p>
      </div>
    ),
    { ...size },
  )
}
