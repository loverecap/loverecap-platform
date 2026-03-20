import { type NextRequest } from 'next/server'
import { signUploadUrlSchema } from '@loverecap/validation'
import { getProjectById, createAsset, generateSignedUploadUrl } from '@loverecap/database'
import { createAdminClient } from '@loverecap/database'
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
import { rateLimit } from '@/lib/rate-limit'
import { generateSlug } from '@loverecap/utils'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()
    const user = await requireUser(supabase).catch(() => null)
    if (!user) return unauthorizedError()

    const rl = rateLimit(`uploads:${user.id}`, 20, 10 * 60_000)
    if (!rl.success) {
      return err('Too many upload requests. Please wait before trying again.', 429, 'RATE_LIMITED')
    }

    const body: unknown = await request.json()
    const parsed = signUploadUrlSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const { project_id, memory_id, file_name, mime_type, size_bytes } = parsed.data

    const project = await getProjectById(supabase, project_id).catch(
      (e: { code?: string }) => {
        if (e?.code === 'PGRST116') return null
        throw e
      },
    )

    if (!project) return notFoundError('Project')
    if (project.user_id !== user.id) return forbiddenError()

    const rawExt = file_name.includes('.') ? file_name.split('.').pop()! : 'bin'
    const ext = rawExt.replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 10) || 'bin'

    const uniqueId = generateSlug(16)
    const storagePath = `${user.id}/${project_id}/${uniqueId}.${ext}`
    const assetType = mime_type.startsWith('video/') ? 'video' : 'image'

    const asset = await createAsset(supabase, {
      project_id,
      memory_id: memory_id ?? null,
      storage_path: storagePath,
      storage_bucket: 'project-assets',
      mime_type,
      size_bytes,
      asset_type: assetType,
    })

    const admin = createAdminClient()
    const { signedUrl, token } = await generateSignedUploadUrl(admin, storagePath)

    return ok(
      {
        asset_id: asset.id,
        signed_url: signedUrl,
        token,
        storage_path: storagePath,
      },
      201,
    )
  } catch (error) {
    console.error('[POST /api/uploads/sign-url]', error)
    return serverError()
  }
}
