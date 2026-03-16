/**
 * Structured JSON logger for Next.js route handlers.
 *
 * Every log line is a single JSON object with:
 *   level    — "info" | "warn" | "error"
 *   ts       — ISO 8601 timestamp
 *   traceId  — x-request-id header (injected by middleware on every request)
 *   service  — route/module identifier, e.g. "payments/pix"
 *   msg      — human-readable message
 *   ...data  — any additional key-value context
 *
 * Vercel captures all stdout/stderr lines. In the Vercel log viewer you can
 * search by traceId to see every log line for a single request end-to-end.
 *
 * Usage:
 *   import { createLogger } from '@/lib/logger'
 *
 *   export async function POST(request: NextRequest) {
 *     const log = createLogger('payments/pix', request)
 *     log.info('Charge initiated', { projectId, userId })
 *     log.error('AbacatePay error', { status, body })
 *   }
 */

type Level = 'info' | 'warn' | 'error'

export interface Logger {
  info(msg: string, data?: Record<string, unknown>): void
  warn(msg: string, data?: Record<string, unknown>): void
  error(msg: string, data?: Record<string, unknown>): void
}

/**
 * Creates a request-scoped structured logger.
 *
 * @param service  Short identifier for the route/module (e.g. "payments/pix")
 * @param req      NextRequest (or any object with a `headers.get` method)
 */
export function createLogger(
  service: string,
  req: { headers: { get(name: string): string | null } },
): Logger {
  const traceId = req.headers.get('x-request-id') ?? 'no-trace'

  function emit(level: Level, msg: string, data?: Record<string, unknown>): void {
    const line = JSON.stringify({
      level,
      ts: new Date().toISOString(),
      traceId,
      service,
      msg,
      ...data,
    })

    if (level === 'error') console.error(line)
    else if (level === 'warn') console.warn(line)
    else console.log(line)
  }

  return {
    info: (msg, data) => emit('info', msg, data),
    warn: (msg, data) => emit('warn', msg, data),
    error: (msg, data) => emit('error', msg, data),
  }
}
