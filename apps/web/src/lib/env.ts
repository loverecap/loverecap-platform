/**
 * Centralised environment variable access.
 *
 * Using these helpers instead of `process.env.X` directly ensures that
 * misconfiguration fails loudly at the call site rather than silently
 * producing `undefined` that causes confusing downstream errors.
 */

function requireEnv(name: string): string {
  const value = process.env[name]
  if (!value) {
    throw new Error(
      `Missing required environment variable: "${name}". ` +
        `Ensure it is present in your .env.local file or deployment environment.`,
    )
  }
  return value
}

export const env = {
  // ── Supabase ──────────────────────────────────────────────
  supabaseUrl: () => requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: () => requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: () => requireEnv('SUPABASE_SERVICE_ROLE_KEY'),

  // ── App ───────────────────────────────────────────────────
  appUrl: () => requireEnv('NEXT_PUBLIC_APP_URL'),

  // ── Payments — AbacatePay PIX ─────────────────────────────────────────
  abacatePayApiKey: () => requireEnv('ABACATEPAY_API_KEY'),
  abacatePayWebhookSecret: () => process.env['ABACATEPAY_WEBHOOK_SECRET'],

  // ── Email — Resend ────────────────────────────────────────────────────
  resendApiKey: () => process.env['RESEND_API_KEY'],
} as const
