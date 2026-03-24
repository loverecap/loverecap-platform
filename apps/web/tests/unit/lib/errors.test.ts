import { describe, it, expect } from 'vitest'
import { AppError } from '@/lib/errors'

describe('AppError', () => {
  it('creates with correct properties', () => {
    const error = new AppError('PROJECT_NOT_FOUND', 404, 'Project not found')
    expect(error.code).toBe('PROJECT_NOT_FOUND')
    expect(error.statusCode).toBe(404)
    expect(error.message).toBe('Project not found')
    expect(error.name).toBe('AppError')
    expect(error).toBeInstanceOf(Error)
  })

  it('creates with details', () => {
    const details = { field: 'project_id', value: 'invalid' }
    const error = new AppError('VALIDATION_ERROR', 400, 'Invalid input', details)
    expect(error.details).toEqual(details)
  })

  it('AppError.unauthorized() produces 401', () => {
    const error = AppError.unauthorized()
    expect(error.statusCode).toBe(401)
    expect(error.code).toBe('UNAUTHORIZED')
  })

  it('AppError.forbidden() produces 403', () => {
    const error = AppError.forbidden()
    expect(error.statusCode).toBe(403)
    expect(error.code).toBe('FORBIDDEN')
  })

  it('AppError.rateLimited() produces 429', () => {
    const error = AppError.rateLimited()
    expect(error.statusCode).toBe(429)
    expect(error.code).toBe('RATE_LIMITED')
  })

  it('AppError.internal() produces 500', () => {
    const error = AppError.internal()
    expect(error.statusCode).toBe(500)
    expect(error.code).toBe('INTERNAL_ERROR')
  })

  it('is distinguishable from generic Error via instanceof', () => {
    const appErr = new AppError('FORBIDDEN', 403, 'Forbidden')
    const genericErr = new Error('Generic')
    expect(appErr instanceof AppError).toBe(true)
    expect(genericErr instanceof AppError).toBe(false)
  })
})
