
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
  supabaseUrl: () => requireEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: () => requireEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: () => requireEnv('SUPABASE_SERVICE_ROLE_KEY'),

  appUrl: () => requireEnv('NEXT_PUBLIC_APP_URL'),

  abacatePayApiKey: () => requireEnv('ABACATEPAY_API_KEY'),
  abacatePayWebhookSecret: () => process.env['ABACATEPAY_WEBHOOK_SECRET'],

  resendApiKey: () => process.env['RESEND_API_KEY'],
} as const
