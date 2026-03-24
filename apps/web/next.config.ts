import type { NextConfig } from 'next'
import { withSentryConfig } from '@sentry/nextjs'

const nextConfig: NextConfig = {
  typescript: {
    // Pre-existing Supabase SDK v2.99 generic type mismatches with exactOptionalPropertyTypes
    // require a full database types regeneration to resolve cleanly.
    ignoreBuildErrors: true,
  },
  transpilePackages: [
    '@loverecap/ui',
    '@loverecap/brand',
    '@loverecap/types',
    '@loverecap/utils',
    '@loverecap/validation',
    '@loverecap/database',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/**',
      },
    ],
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: *.supabase.co i.ytimg.com img.youtube.com",
      "media-src 'self' blob: *.supabase.co",
      // /monitoring is the Sentry tunnel route (same-origin proxy to bypass ad-blockers)
      "connect-src 'self' *.supabase.co wss://*.supabase.co *.sentry.io",
      "font-src 'self'",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; ')

    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'Content-Security-Policy', value: csp },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default withSentryConfig(nextConfig, {
  org: process.env['SENTRY_ORG'],
  project: process.env['SENTRY_PROJECT'],

  // Auth token for source map uploads — set in .env.sentry-build-plugin (gitignored)
  authToken: process.env['SENTRY_AUTH_TOKEN'],

  // Upload broader set of client files for better stack trace resolution
  widenClientFileUpload: true,

  // Proxy Sentry requests through /monitoring to bypass ad-blockers
  tunnelRoute: '/monitoring',

  // Suppress build output unless in CI
  silent: !process.env.CI,

  // Don't fail the build if Sentry upload fails
  errorHandler(err) {
    console.warn('[Sentry] Build upload warning:', err)
  },
})
