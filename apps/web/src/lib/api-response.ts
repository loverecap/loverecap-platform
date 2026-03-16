import { NextResponse } from 'next/server'

// Standard API envelope: every response is { data, error }
// so clients always have a consistent shape to destructure.

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data, error: null }, { status })
}

export function err(message: string, status: number, code?: string) {
  return NextResponse.json({ data: null, error: { message, code } }, { status })
}

// Accepts any Zod-like error with a flatten() method — avoids cross-version type conflicts.
export function validationError(error: { flatten(): { fieldErrors: unknown } }) {
  return NextResponse.json(
    {
      data: null,
      error: {
        message: 'Validation failed',
        code: 'VALIDATION_ERROR',
        issues: error.flatten().fieldErrors,
      },
    },
    { status: 400 },
  )
}

export function unauthorizedError() {
  return err('Unauthorized', 401, 'UNAUTHORIZED')
}

export function notFoundError(resource = 'Resource') {
  return err(`${resource} not found`, 404, 'NOT_FOUND')
}

export function forbiddenError() {
  return err('Forbidden', 403, 'FORBIDDEN')
}

export function serverError(message = 'Internal server error') {
  return err(message, 500, 'INTERNAL_ERROR')
}
