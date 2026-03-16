import { ImageResponse } from 'next/og'
import { createAdminClient, getProjectBySlug } from '@loverecap/database'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const revalidate = 3600

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const admin = createAdminClient()
  const project = await getProjectBySlug(admin, slug).catch(() => null)

  const name1 = project?.partner_name_1 ?? '?'
  const name2 = project?.partner_name_2 ?? '?'
  const isPublished = project?.status === 'published'

  // Fall back to a generic branded card if the story isn't found / not published.
  if (!project || !isPublished) {
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
          }}
        >
          <span style={{ fontSize: '80px', marginBottom: '24px' }}>❤️</span>
          <span style={{ fontSize: '48px', fontWeight: 700, color: 'white' }}>LoveRecap</span>
        </div>
      ),
      { ...size },
    )
  }

  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #FF4D6D 0%, #FF2E63 100%)',
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
        <span style={{ fontSize: '80px', marginBottom: '32px' }}>❤️</span>
        <h1
          style={{
            fontSize: '56px',
            fontWeight: 700,
            color: 'white',
            textAlign: 'center',
            margin: '0 0 16px',
            letterSpacing: '-1px',
          }}
        >
          {name1} &amp; {name2}
        </h1>
        <p
          style={{
            fontSize: '26px',
            color: 'rgba(255,255,255,0.8)',
            textAlign: 'center',
            margin: '0',
          }}
        >
          Nossa história — feita com LoveRecap
        </p>
      </div>
    ),
    { ...size },
  )
}
