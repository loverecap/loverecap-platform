import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { createAdminClient } from '@loverecap/database'
import { ok, serverError, validationError } from '@/lib/api-response'

const VALID_EMOJIS = ['❤️', '😭', '🥰', '🔥'] as const
const reactSchema = z.object({
  emoji: z.enum(VALID_EMOJIS),
})

async function getProject(slug: string) {
  const admin = createAdminClient()
  const { data } = await admin
    .from('projects')
    .select('id')
    .eq('slug', slug)
    .single()
  return { admin, project: data }
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const { admin, project } = await getProject(slug)
    if (!project) return ok([])

    const { data: rows } = await admin
      .from('story_reactions')
      .select('emoji, count')
      .eq('project_id', project.id)

    return ok(rows ?? [])
  } catch (error) {
    console.error('[GET /api/stories/[slug]/reactions]', error)
    return serverError()
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params
    const parsed = reactSchema.safeParse(await req.json())
    if (!parsed.success) return validationError(parsed.error)

    const { admin, project } = await getProject(slug)
    if (!project) return ok({ count: 0 })

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data } = await (admin as any).rpc('upsert_reaction', {
      p_project_id: project.id,
      p_emoji: parsed.data.emoji,
    })

    return ok({ count: (data as number | null) ?? 1 })
  } catch (error) {
    console.error('[POST /api/stories/[slug]/reactions]', error)
    return serverError()
  }
}
