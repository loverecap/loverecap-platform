export type AppErrorCode =
  // Auth
  | 'UNAUTHORIZED'
  | 'FORBIDDEN'
  // Resources
  | 'PROJECT_NOT_FOUND'
  | 'MEMORY_NOT_FOUND'
  | 'ASSET_NOT_FOUND'
  | 'PAYMENT_NOT_FOUND'
  // Validation
  | 'VALIDATION_ERROR'
  | 'RATE_LIMITED'
  // Business rules
  | 'PUBLISH_FAILED'
  | 'PAYMENT_FAILED'
  | 'UPLOAD_FAILED'
  | 'PROJECT_NOT_DRAFT'
  | 'DUPLICATE_PROJECT'
  // Generic
  | 'INTERNAL_ERROR'

export class AppError extends Error {
  constructor(
    public readonly code: AppErrorCode,
    public readonly statusCode: number,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message)
    this.name = 'AppError'
  }

  static unauthorized(message = 'Unauthorized') {
    return new AppError('UNAUTHORIZED', 401, message)
  }

  static forbidden(message = 'Forbidden') {
    return new AppError('FORBIDDEN', 403, message)
  }

  static notFound(resource: string) {
    return new AppError('PROJECT_NOT_FOUND', 404, `${resource} not found`)
  }

  static rateLimited(message = 'Too many requests. Try again later.') {
    return new AppError('RATE_LIMITED', 429, message)
  }

  static internal(message = 'Internal server error') {
    return new AppError('INTERNAL_ERROR', 500, message)
  }
}
