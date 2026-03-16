import type { MetadataRoute } from 'next'

const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://loverecap.app'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        // Keep builder, checkout, and API routes out of search indexes.
        disallow: ['/api/', '/create/', '/checkout/'],
      },
    ],
    sitemap: `${APP_URL}/sitemap.xml`,
  }
}
