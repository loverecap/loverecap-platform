import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { getProjectById } from '@loverecap/database'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import {
  ok,
  err,
  validationError,
  unauthorizedError,
  notFoundError,
  forbiddenError,
  serverError,
} from '@/lib/api-response'

const schema = z
  .object({
    project_id: z.string().uuid(),
    track_title: z.string().min(1).max(200),
    artist_name: z.string().max(200).optional(),
    // YouTube fields (primary provider)
    provider: z.enum(['youtube', 'file', 'external_url']).default('youtube'),
    video_id: z.string().optional(),
    thumbnail_url: z.string().url().optional().or(z.literal('')),
    duration: z.string().optional(),
    // Legacy fields — kept for backward compatibility; not used in new UI
    storage_path: z.string().optional(),
    external_url: z.string().url().optional(),
  })
  .refine(
    (d) => d.video_id || d.storage_path || d.external_url,
    { message: 'Forneça video_id, storage_path ou external_url' },
  )

// POST /api/projects/music
// Upserts a music track for a project (one track per project).
export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()
    const user = await requireUser(supabase).catch(() => null)
    if (!user) return unauthorizedError()

    const body: unknown = await request.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const {
      project_id,
      track_title,
      artist_name,
      provider,
      video_id,
      thumbnail_url,
      duration,
      storage_path,
      external_url,
    } = parsed.data

    const project = await getProjectById(supabase, project_id).catch(
      (e: { code?: string }) => {
        if (e?.code === 'PGRST116') return null
        throw e
      },
    )

    if (!project) return notFoundError('Project')
    if (project.user_id !== user.id) return forbiddenError()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error } = await (supabase as any)
      .from('project_music')
      .upsert(
        {
          project_id,
          track_title,
          artist_name: artist_name ?? null,
          provider,
          video_id: video_id ?? null,
          thumbnail_url: thumbnail_url || null,
          duration: duration ?? null,
          // Legacy
          storage_path: storage_path ?? null,
          external_url: external_url ?? null,
        },
        { onConflict: 'project_id' },
      )
      .select()
      .single()

    if (error) throw error

    return ok(data, 201)
  } catch (error) {
    console.error('[POST /api/projects/music]', error)
    return serverError()
  }
}

// DELETE /api/projects/music?project_id=<uuid>
// Removes the music track from a project.
export async function DELETE(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()
    const user = await requireUser(supabase).catch(() => null)
    if (!user) return unauthorizedError()

    const { searchParams } = new URL(request.url)
    const project_id = searchParams.get('project_id')
    if (!project_id) return err('project_id is required', 400, 'VALIDATION_ERROR')

    const project = await getProjectById(supabase, project_id).catch(
      (e: { code?: string }) => {
        if (e?.code === 'PGRST116') return null
        throw e
      },
    )

    if (!project) return notFoundError('Project')
    if (project.user_id !== user.id) return forbiddenError()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { error } = await (supabase as any)
      .from('project_music')
      .delete()
      .eq('project_id', project_id)

    if (error) throw error

    return ok({ deleted: true })
  } catch (error) {
    console.error('[DELETE /api/projects/music]', error)
    return serverError()
  }
}
