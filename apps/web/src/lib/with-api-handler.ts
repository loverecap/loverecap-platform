import { type NextRequest, NextResponse } from 'next/server'
import * as Sentry from '@sentry/nextjs'
import { AppError } from './errors'
import { createLogger } from './logger'

type RouteHandler = (request: NextRequest) => Promise<NextResponse>

/**
 * withApiHandler — Next.js equivalent of NestJS GlobalExceptionFilter.
 *
 * Wraps a route handler to:
 * - Catch AppError → return structured { data: null, error: { code, message } }
 * - Catch unknown errors → log + capture in Sentry + return 500
 */
export function withApiHandler(serviceName: string, handler: RouteHandler): RouteHandler {
  return async (request) => {
    const log = createLogger(serviceName, request)
    try {
      return await handler(request)
    } catch (error) {
      if (error instanceof AppError) {
        if (error.statusCode >= 500) {
          log.error(error.message, { code: error.code, details: String(error.details ?? '') })
        } else {
          log.warn(error.message, { code: error.code })
        }

        return NextResponse.json(
          {
            data: null,
            error: {
              code: error.code,
              message: error.message,
              ...(error.details !== undefined ? { details: error.details } : {}),
            },
          },
          { status: error.statusCode },
        )
      }

      // Unexpected error — capture in Sentry with full context
      const message = error instanceof Error ? error.message : String(error)
      log.error('Unhandled exception', { error: message })
      Sentry.captureException(error, { tags: { service: serviceName } })

      return NextResponse.json(
        { data: null, error: { code: 'INTERNAL_ERROR', message: 'Internal server error' } },
        { status: 500 },
      )
    }
  }
}
