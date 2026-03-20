import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getProjectBySlug, createAdminClient } from '@loverecap/database'
import { StoryExperience } from '@/components/public-story/story-experience'

interface StoryPageProps {
  params: Promise<{ slug: string }>
}

type RawAsset = {
  id: string
  memory_id: string | null
  storage_path: string
  storage_bucket: string
  asset_type: string
}

type RawMemory = {
  id: string
  title: string
  description: string | null
  occurred_at: string | null
  emoji: string | null
  position: number
}

type RawMusic = {
  track_title: string
  artist_name: string | null
  provider: string | null
  video_id: string | null
  thumbnail_url: string | null
  duration: string | null
  // Legacy
  storage_path: string | null
  external_url: string | null
}

type RawHiddenSurprise = {
  id: string
  memory_id: string | null
  message: string
  emoji: string
  position: number
}

type RawFutureMessage = {
  message: string
  reveal_at: string
  hint_text: string | null
}

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const project = await getProjectBySlug(createAdminClient(), slug).catch(() => null) as any

  if (!project) return { title: 'História não encontrada | LoveRecap' }

  const appUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://loverecap.app'
  const names = `${project.partner_name_1 as string} & ${project.partner_name_2 as string}`
  const pageUrl = `${appUrl}/s/${slug}`

  return {
    title: `${names} — LoveRecap`,
    description: `A história de amor de ${names}, guardada com carinho no LoveRecap. Uma linha do tempo de momentos especiais para nunca esquecer.`,
    alternates: {
      canonical: pageUrl,
    },
    openGraph: {
      title: `${names} — LoveRecap`,
      description: `A história de amor de ${names}, guardada com carinho no LoveRecap.`,
      url: pageUrl,
      type: 'website',
      locale: 'pt_BR',
      siteName: 'LoveRecap',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${names} — LoveRecap`,
      description: `A história de amor de ${names}, guardada com carinho no LoveRecap.`,
    },
    robots: {
      index: true,
      follow: true,
    },
  }
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params

  // Use the admin client (service role) for all data fetching on the public story page.
  // The `assets` table has an RLS policy that restricts reads to the project owner.
  // Unauthenticated visitors have no session → auth.uid() = null → RLS returns an
  // empty assets array → StoryGallery receives photos.length === 0 → section disappears.
  // The admin client bypasses RLS so any visitor sees the full story. This is safe
  // because only published projects are accessible here (slug is only created after payment).
  const admin = createAdminClient()

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const project = await getProjectBySlug(admin, slug).catch((e: { code?: string }) => {
    if (e?.code === 'PGRST116') return null
    throw e
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  }) as any

  if (!project) return notFound()

  const SIGNED_URL_EXPIRY = 60 * 60 * 24 * 365 // 1 year

  // ── Assets (photos / videos) ────────────────────────────────────
  const assetsWithUrls = await Promise.all(
    ((project.assets ?? []) as RawAsset[]).map(async (asset) => {
      const { data } = await admin.storage
        .from(asset.storage_bucket)
        .createSignedUrl(asset.storage_path, SIGNED_URL_EXPIRY)
      return { ...asset, url: data?.signedUrl ?? '' }
    }),
  )

  const assetsByMemoryId: Record<string, typeof assetsWithUrls> = {}
  const projectAssets: typeof assetsWithUrls = []

  for (const asset of assetsWithUrls) {
    if (asset.memory_id) {
      const memId = asset.memory_id
      if (!assetsByMemoryId[memId]) assetsByMemoryId[memId] = []
      assetsByMemoryId[memId]!.push(asset)
    } else if (asset.id !== project.cover_asset_id) {
      projectAssets.push(asset)
    }
  }

  const coverAsset = project.cover_asset_id
    ? assetsWithUrls.find((a) => a.id === (project.cover_asset_id as string))
    : null

  const memories = [...((project.memories ?? []) as RawMemory[])].sort(
    (a, b) => a.position - b.position,
  )

  // ── New feature tables — queried separately so the app works even
  //    before the migration has been pushed to the remote database.
  // ── Music ────────────────────────────────────────────────────────
  let musicProp: {
    provider: 'youtube' | 'file' | 'external_url'
    trackTitle: string
    artistName?: string | null
    videoId?: string | null
    thumbnail?: string | null
    audioUrl?: string | null
  } | null = null

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: musicRows } = await (admin as any)
      .from('project_music')
      .select('track_title, artist_name, provider, video_id, thumbnail_url, storage_path, external_url')
      .eq('project_id', project.id as string)
      .limit(1)

    const musicRow = (musicRows as RawMusic[] | null)?.[0]
    if (musicRow) {
      const provider = (musicRow.provider ?? 'file') as 'youtube' | 'file' | 'external_url'

      if (provider === 'youtube' && musicRow.video_id) {
        musicProp = {
          provider: 'youtube',
          trackTitle: musicRow.track_title,
          artistName: musicRow.artist_name,
          videoId: musicRow.video_id,
          thumbnail: musicRow.thumbnail_url,
        }
      } else {
        // Legacy: resolve audio URL from storage or external
        let audioUrl = musicRow.external_url ?? ''
        if (!audioUrl && musicRow.storage_path) {
          const { data } = await admin.storage
            .from('project-assets')
            .createSignedUrl(musicRow.storage_path, SIGNED_URL_EXPIRY)
          audioUrl = data?.signedUrl ?? ''
        }
        if (audioUrl) {
          musicProp = {
            provider,
            trackTitle: musicRow.track_title,
            artistName: musicRow.artist_name,
            audioUrl,
          }
        }
      }
    }
  } catch {
    // Table may not exist yet — fail silently
  }

  // ── Hidden surprises ─────────────────────────────────────────────
  let hiddenSurprises: { id: string; memory_id: string | null; message: string; emoji: string; position: number }[] = []
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: surpriseRows } = await (admin as any)
      .from('hidden_surprises')
      .select('id, memory_id, message, emoji, position')
      .eq('project_id', project.id as string)
      .order('position')

    hiddenSurprises = ((surpriseRows as RawHiddenSurprise[] | null) ?? []).map((s) => ({
      id: s.id,
      memory_id: s.memory_id,
      message: s.message,
      emoji: s.emoji ?? '💌',
      position: s.position,
    }))
  } catch {
    // Table may not exist yet — fail silently
  }

  // ── Future message ───────────────────────────────────────────────
  let futureProp: { message: string; revealAt: string; hintText?: string | null } | null = null
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: futureRows } = await (admin as any)
      .from('future_messages')
      .select('message, reveal_at, hint_text')
      .eq('project_id', project.id as string)
      .limit(1)

    const futureRow = (futureRows as RawFutureMessage[] | null)?.[0]
    if (futureRow) {
      futureProp = {
        message: futureRow.message,
        revealAt: futureRow.reveal_at,
        hintText: futureRow.hint_text,
      }
    }
  } catch {
    // Table may not exist yet — fail silently
  }

  const appUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://loverecap.app'

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: `${project.partner_name_1 as string} & ${project.partner_name_2 as string} — LoveRecap`,
    description: `A história de amor de ${project.partner_name_1 as string} & ${project.partner_name_2 as string}, guardada com carinho no LoveRecap.`,
    url: `${appUrl}/s/${slug}`,
    publisher: {
      '@type': 'Organization',
      name: 'LoveRecap',
      url: appUrl,
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <StoryExperience
      partnerName1={project.partner_name_1 as string}
      partnerName2={project.partner_name_2 as string}
      startDate={project.relationship_start_date as string}
      memories={memories}
      assetsByMemoryId={assetsByMemoryId}
      projectAssets={projectAssets}
      coverUrl={coverAsset?.url ?? null}
      finalMessage={project.final_message as string | null}
      authorName={project.partner_name_1 as string}
      shareUrl={`${appUrl}/s/${slug}`}
      shareTitle={`${project.partner_name_1 as string} & ${project.partner_name_2 as string} — LoveRecap`}
      music={musicProp}
      hiddenSurprises={hiddenSurprises}
      futureMessage={futureProp}
    />
    </>
  )
}
