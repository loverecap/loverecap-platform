import type { MetadataRoute } from 'next'
import { createAdminClient } from '@loverecap/database'

const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://loverecap.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: APP_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${APP_URL}/example`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${APP_URL}/pricing`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${APP_URL}/faq`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${APP_URL}/privacy-policy`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${APP_URL}/terms`,
      lastModified: new Date(),
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  // Include all published story pages so they are discoverable via search engines.
  let storyPages: MetadataRoute.Sitemap = []
  try {
    const admin = createAdminClient()
    const { data: projects } = await admin
      .from('projects')
      .select('slug, updated_at')
      .eq('status', 'published')

    if (projects) {
      storyPages = projects.map((p) => ({
        url: `${APP_URL}/story/${p.slug}`,
        lastModified: new Date(p.updated_at),
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))
    }
  } catch {
    // Sitemap generation should never crash the build if Supabase is unavailable.
  }

  return [...staticPages, ...storyPages]
}
