import type { MetadataRoute } from 'next'
import { createAdminClient } from '@loverecap/database'

const APP_URL =
  process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://loverecap.app'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: APP_URL,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 1,
    },
    {
      url: `${APP_URL}/create`,
      lastModified: now,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${APP_URL}/example`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: `${APP_URL}/pricing`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${APP_URL}/faq`,
      lastModified: now,
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${APP_URL}/privacy-policy`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
    {
      url: `${APP_URL}/terms`,
      lastModified: now,
      changeFrequency: 'yearly',
      priority: 0.3,
    },
  ]

  let storyPages: MetadataRoute.Sitemap = []

  try {
    const admin = createAdminClient()

    const { data: projects } = await admin
      .from('projects')
      .select('slug, updated_at')
      .eq('status', 'published')

    if (projects?.length) {
      storyPages = projects.map((p) => ({
        url: `${APP_URL}/s/${p.slug}`,
        lastModified: p.updated_at ? new Date(p.updated_at) : now,
        changeFrequency: 'monthly' as const,
        priority: 0.5,
      }))
    }
  } catch (error) {
    console.warn('Sitemap generation failed:', error)
    // Não quebra build
  }

  return [...staticPages, ...storyPages]
}