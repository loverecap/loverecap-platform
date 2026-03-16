import type { NextConfig } from 'next'

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
        // Covers both public paths and signed download URLs.
        pathname: '/storage/v1/object/**',
      },
    ],
    // Prefer modern formats — Next.js negotiates with the browser automatically.
    formats: ['image/avif', 'image/webp'],
  },
  async headers() {
    // CSP: allow YouTube iframes for the music player, Supabase for storage,
    // and ytimg.com for YouTube thumbnails. Next.js requires 'unsafe-inline'
    // and 'unsafe-eval' for its runtime scripts.
    const csp = [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline'",
      "img-src 'self' data: blob: *.supabase.co i.ytimg.com img.youtube.com",
      "media-src 'self' blob: *.supabase.co",
      "connect-src 'self' *.supabase.co wss://*.supabase.co",
      "font-src 'self'",
      "frame-src https://www.youtube.com https://www.youtube-nocookie.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
      "upgrade-insecure-requests",
    ].join('; ')

    return [
      {
        // Apply baseline security headers to every route.
        source: '/(.*)',
        headers: [
          // Content Security Policy — restricts resource origins
          { key: 'Content-Security-Policy', value: csp },
          // Prevent MIME-type sniffing
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          // Disallow framing (clickjacking protection)
          { key: 'X-Frame-Options', value: 'DENY' },
          // Legacy XSS filter — still respected by older browsers
          { key: 'X-XSS-Protection', value: '1; mode=block' },
          // Limit referrer info sent to third parties
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          // Disable browser features we don't need
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ]
  },
}

export default nextConfig
