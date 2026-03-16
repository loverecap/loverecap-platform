import { z } from 'zod'

const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/gif',
  'video/mp4',
  'video/webm',
] as const

const MAX_IMAGE_BYTES = 10 * 1024 * 1024  // 10 MB
const MAX_VIDEO_BYTES = 200 * 1024 * 1024 // 200 MB

export const signUploadUrlSchema = z
  .object({
    project_id: z.string().uuid('Invalid project ID'),
    memory_id: z.string().uuid().optional(),
    file_name: z.string().min(1).max(255),
    mime_type: z.enum(ALLOWED_MIME_TYPES, {
      errorMap: () => ({ message: `Allowed types: ${ALLOWED_MIME_TYPES.join(', ')}` }),
    }),
    size_bytes: z.number().int().positive(),
  })
  .superRefine((val, ctx) => {
    const isVideo = val.mime_type.startsWith('video/')
    const limit = isVideo ? MAX_VIDEO_BYTES : MAX_IMAGE_BYTES
    if (val.size_bytes > limit) {
      ctx.addIssue({
        code: z.ZodIssueCode.too_big,
        type: 'number',
        maximum: limit,
        inclusive: true,
        message: `File too large. Max size: ${limit / 1024 / 1024} MB`,
      })
    }
  })

export type SignUploadUrlInput = z.infer<typeof signUploadUrlSchema>

export { ALLOWED_MIME_TYPES }
