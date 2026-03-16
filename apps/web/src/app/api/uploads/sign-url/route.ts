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

// POST /api/uploads/sign-url
// Issues a short-lived signed upload URL so the browser can push a file
// directly to Supabase Storage without routing through the Next.js server.
//
// Flow:
//   1. Validate input (MIME type + size enforced by signUploadUrlSchema).
//   2. Verify project ownership — RLS double-checked by Supabase.
//   3. Build the storage path: {userId}/{projectId}/{uuid}.{ext}
//   4. Create the asset row (metadata pre-recorded before the upload).
//   5. Generate a signed upload URL via the admin client.
//   6. Return { assetId, signedUrl, storagePath } to the client.
//   7. Client uploads directly to storage using the signed URL (no bytes through Next.js).
//
// Rate limit: 20 signed URLs per user per 10 minutes.
export async function POST(request: NextRequest) {
  try {
    const supabase = await createRouteHandlerClient()
    const user = await requireUser(supabase).catch(() => null)
    if (!user) return unauthorizedError()

    // Enforce per-user rate limit — prevents runaway upload loops or abuse.
    const rl = rateLimit(`uploads:${user.id}`, 20, 10 * 60_000)
    if (!rl.success) {
      return err('Too many upload requests. Please wait before trying again.', 429, 'RATE_LIMITED')
    }

    const body: unknown = await request.json()
    const parsed = signUploadUrlSchema.safeParse(body)
    if (!parsed.success) return validationError(parsed.error)

    const { project_id, memory_id, file_name, mime_type, size_bytes } = parsed.data

    // Verify project ownership
    const project = await getProjectById(supabase, project_id).catch(
      (e: { code?: string }) => {
        if (e?.code === 'PGRST116') return null
        throw e
      },
    )

    if (!project) return notFoundError('Project')
    if (project.user_id !== user.id) return forbiddenError()

    // Sanitise the extension from the original filename — strip any path traversal.
    const rawExt = file_name.includes('.') ? file_name.split('.').pop()! : 'bin'
    const ext = rawExt.replace(/[^a-z0-9]/gi, '').toLowerCase().slice(0, 10) || 'bin'

    const uniqueId = generateSlug(16)
    const storagePath = `${user.id}/${project_id}/${uniqueId}.${ext}`
    const assetType = mime_type.startsWith('video/') ? 'video' : 'image'

    // Create asset row before the upload so the ID is immediately available.
    const asset = await createAsset(supabase, {
      project_id,
      memory_id: memory_id ?? null,
      storage_path: storagePath,
      storage_bucket: 'project-assets',
      mime_type,
      size_bytes,
      asset_type: assetType,
    })

    // Signed upload URLs require the admin client (service role).
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
