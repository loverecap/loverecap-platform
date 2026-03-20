
type Level = 'info' | 'warn' | 'error'

export interface Logger {
  info(msg: string, data?: Record<string, unknown>): void
  warn(msg: string, data?: Record<string, unknown>): void
  error(msg: string, data?: Record<string, unknown>): void
}

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
