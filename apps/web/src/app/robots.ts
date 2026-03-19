import type { MetadataRoute } from 'next'

const APP_URL =
  process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://loverecap.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: [
          '/api',
          '/create',
          '/checkout',
          '/dashboard',
          '/login',
          '/admin',
        ],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}