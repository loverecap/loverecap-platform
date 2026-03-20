import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

type Props = { params: Promise<{ slug: string }> }

export default async function Image({ params }: Props) {
  const { slug } = await params

  let partnerName1 = ''
  let partnerName2 = ''

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

    const res = await fetch(
      `${supabaseUrl}/rest/v1/projects?slug=eq.${encodeURIComponent(slug)}&select=partner_name_1,partner_name_2&limit=1`,
      {
        headers: {
          apikey: serviceKey,
          Authorization: `Bearer ${serviceKey}`,
        },
      },
    )

    const rows = (await res.json()) as Array<{
      partner_name_1: string
      partner_name_2: string
    }>

    partnerName1 = rows[0]?.partner_name_1 ?? ''
    partnerName2 = rows[0]?.partner_name_2 ?? ''
  } catch {
    // fail silently — render generic image
  }

  const names =
    partnerName1 && partnerName2
      ? `${partnerName1} & ${partnerName2}`
      : 'Uma história de amor'

  const fontSize = names.length > 34 ? 48 : names.length > 24 ? 58 : 70

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #FF2D55 0%, #FF4D6D 40%, #FF8FA3 100%)',
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
        <div style={{ position: 'absolute', top: 44, left: 68, fontSize: 32, opacity: 0.25 }}>❤️</div>
        <div style={{ position: 'absolute', bottom: 52, right: 76, fontSize: 26, opacity: 0.2 }}>❤️</div>

        {/* Heart icon */}
        <div style={{ fontSize: '72px', marginBottom: '28px', lineHeight: 1 }}>❤️</div>

        {/* Couple names */}
        <p
          style={{
            fontSize,
            fontWeight: 800,
            color: 'white',
            textAlign: 'center',
            margin: '0 0 20px',
            letterSpacing: '-1.5px',
            lineHeight: 1.15,
          }}
        >
          {names}
        </p>

        {/* Subtitle */}
        <p
          style={{
            fontSize: '24px',
            color: 'rgba(255,255,255,0.85)',
            textAlign: 'center',
            margin: '0 0 44px',
            lineHeight: 1.4,
          }}
        >
          Uma história de amor guardada para sempre
        </p>

        {/* Brand pill */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            background: 'rgba(255,255,255,0.22)',
            borderRadius: '100px',
            padding: '10px 28px',
            border: '1px solid rgba(255,255,255,0.3)',
          }}
        >
          <span style={{ fontSize: '18px', fontWeight: 600, color: 'white' }}>
            ❤ loverecap.app
          </span>
        </div>
      </div>
    ),
    { ...size },
  )
}
