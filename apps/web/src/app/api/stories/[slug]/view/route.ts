import { type NextRequest } from 'next/server'
import { createAdminClient } from '@loverecap/database'
import { ok, serverError } from '@/lib/api-response'

export async function POST(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const admin = createAdminClient()

    const { data: project } = await admin
      .from('projects')
      .select('id')
      .eq('slug', slug)
      .single()

    if (!project) return ok({ viewCount: 0 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (admin as any).rpc('increment_view_count', {
      p_project_id: project.id,
    })

    return ok({ viewCount: (data as number | null) ?? 0 })
  } catch (error) {
    console.error('[POST /api/stories/[slug]/view]', error)
    return serverError()
  }
}
