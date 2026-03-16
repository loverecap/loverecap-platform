import { type NextRequest, NextResponse } from 'next/server'
import { rateLimit, getClientIp } from '@/lib/rate-limit'

const YT_KEY = process.env.YOUTUBE_API_KEY

function parseDuration(iso: string): string {
  const m = iso.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/)
  if (!m) return '0:00'
  const h = Number(m[1] ?? 0)
  const min = Number(m[2] ?? 0)
  const s = Number(m[3] ?? 0)
  const ss = String(s).padStart(2, '0')
  if (h > 0) return `${h}:${String(min).padStart(2, '0')}:${ss}`
  return `${min}:${ss}`
}

type SnippetThumbnail = { url: string; width?: number; height?: number }

type SearchItem = {
  id: { videoId: string }
  snippet: {
    title: string
    channelTitle: string
    thumbnails: {
      medium?: SnippetThumbnail
      high?: SnippetThumbnail
      default?: SnippetThumbnail
    }
  }
}

type VideoItem = {
  id: string
  contentDetails: { duration: string }
}

// GET /api/music/search?q=<query>
// Proxies YouTube Data API v3 — never exposes the API key to the client.
export async function GET(req: NextRequest) {
  if (!YT_KEY) {
    return NextResponse.json({ error: 'YouTube API not configured' }, { status: 500 })
  }

  // Rate limit: 60 searches per IP per 10 minutes
  const ip = getClientIp(req)
  const rl = rateLimit(`music-search:${ip}`, 60, 10 * 60 * 1000)
  if (!rl.success) {
    return NextResponse.json({ error: 'Too many requests' }, { status: 429 })
  }

  const rawQ = req.nextUrl.searchParams.get('q')?.trim() ?? ''
  // Enforce max query length and strip control characters to prevent API abuse
  const q = rawQ.replace(/[\x00-\x1F\x7F]/g, '').slice(0, 150)
  if (!q || q.length < 2) return NextResponse.json({ items: [] })

  try {
    // 1. Search for videos (category 10 = Music)
    const searchUrl = new URL('https://www.googleapis.com/youtube/v3/search')
    searchUrl.searchParams.set('part', 'snippet')
    searchUrl.searchParams.set('type', 'video')
    searchUrl.searchParams.set('videoCategoryId', '10')
    searchUrl.searchParams.set('q', q)
    searchUrl.searchParams.set('maxResults', '10')
    searchUrl.searchParams.set('key', YT_KEY)

    const searchRes = await fetch(searchUrl.toString(), { next: { revalidate: 300 } })
    if (!searchRes.ok) return NextResponse.json({ items: [] }, { status: 502 })

    const searchData = await searchRes.json() as { items?: SearchItem[] }
    const items = (searchData.items ?? []).filter((i) => i.id?.videoId)
    if (items.length === 0) return NextResponse.json({ items: [] })

    // 2. Fetch durations via videos endpoint
    const ids = items.map((i) => i.id.videoId).join(',')
    const videosUrl = new URL('https://www.googleapis.com/youtube/v3/videos')
    videosUrl.searchParams.set('part', 'contentDetails')
    videosUrl.searchParams.set('id', ids)
    videosUrl.searchParams.set('key', YT_KEY)

    const videosRes = await fetch(videosUrl.toString(), { next: { revalidate: 300 } })
    const videosData = await videosRes.json() as { items?: VideoItem[] }

    const durationMap: Record<string, string> = {}
    for (const v of (videosData.items ?? [])) {
      durationMap[v.id] = parseDuration(v.contentDetails.duration)
    }

    return NextResponse.json({
      items: items.map((i) => ({
        videoId: i.id.videoId,
        title: i.snippet.title,
        artist: i.snippet.channelTitle,
        thumbnail:
          i.snippet.thumbnails.medium?.url ??
          i.snippet.thumbnails.high?.url ??
          i.snippet.thumbnails.default?.url ??
          '',
        duration: durationMap[i.id.videoId] ?? '--:--',
      })),
    })
  } catch {
    return NextResponse.json({ items: [] }, { status: 502 })
  }
}
