import { describe, it, expect, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { AppError } from '@/lib/errors'

// Mock Sentry to avoid initialization errors in tests
vi.mock('@sentry/nextjs', () => ({
  captureException: vi.fn(),
  captureMessage: vi.fn(),
  logger: {
    info: vi.fn(),
    warn: vi.fn(),
    error: vi.fn(),
  },
}))

// Import after mock
const { withApiHandler } = await import('@/lib/with-api-handler')

function makeRequest(path = '/api/test') {
  return new NextRequest(new URL(`http://localhost${path}`))
}

describe('withApiHandler', () => {
  it('passes through successful responses', async () => {
    const handler = withApiHandler('test', async () =>
      NextResponse.json({ data: { ok: true }, error: null }),
    )
    const res = await handler(makeRequest())
    const json = await res.json()
    expect(res.status).toBe(200)
    expect(json.data.ok).toBe(true)
  })

  it('converts AppError to structured error response', async () => {
    const handler = withApiHandler('test', async () => {
      throw new AppError('PROJECT_NOT_FOUND', 404, 'Project not found')
    })
    const res = await handler(makeRequest())
    const json = await res.json()
    expect(res.status).toBe(404)
    expect(json.error.code).toBe('PROJECT_NOT_FOUND')
    expect(json.error.message).toBe('Project not found')
    expect(json.data).toBeNull()
  })

  it('converts unauthorized AppError to 401', async () => {
    const handler = withApiHandler('test', async () => {
      throw AppError.unauthorized()
    })
    const res = await handler(makeRequest())
    expect(res.status).toBe(401)
    const json = await res.json()
    expect(json.error.code).toBe('UNAUTHORIZED')
  })

  it('converts unknown errors to 500 INTERNAL_ERROR', async () => {
    const handler = withApiHandler('test', async () => {
      throw new Error('Database exploded')
    })
    const res = await handler(makeRequest())
    const json = await res.json()
    expect(res.status).toBe(500)
    expect(json.error.code).toBe('INTERNAL_ERROR')
    expect(json.data).toBeNull()
  })

  it('includes details in AppError response when provided', async () => {
    const handler = withApiHandler('test', async () => {
      throw new AppError('VALIDATION_ERROR', 400, 'Invalid', { field: 'email' })
    })
    const res = await handler(makeRequest())
    const json = await res.json()
    expect(json.error.details).toEqual({ field: 'email' })
  })

  it('rate limit AppError returns 429', async () => {
    const handler = withApiHandler('test', async () => {
      throw AppError.rateLimited()
    })
    const res = await handler(makeRequest())
    expect(res.status).toBe(429)
    expect((await res.json()).error.code).toBe('RATE_LIMITED')
  })
})
