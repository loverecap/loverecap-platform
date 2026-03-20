import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { createAdminClient, getProjectBySlug } from '@loverecap/database'
import { StoryExperience } from '@/components/public-story/story-experience'
import { StoryShareBar } from '@/components/public-story/story-share-bar'

interface StoryPageProps {
  params: Promise<{ slug: string }>
}

export const revalidate = 3600

export async function generateMetadata({ params }: StoryPageProps): Promise<Metadata> {
  const { slug } = await params
  const admin = createAdminClient()
  const project = await getProjectBySlug(admin, slug).catch(() => null)

  if (!project || project.status !== 'published') return { title: 'História não encontrada' }

  const title = `${project.partner_name_1} & ${project.partner_name_2} — Nossa história`
  const description = `Uma história de amor entre ${project.partner_name_1} e ${project.partner_name_2}, feita com LoveRecap.`
  const appUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? ''
  const url = `${appUrl}/story/${slug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      type: 'website',
      url,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
    },
  }
}

export default async function StoryPage({ params }: StoryPageProps) {
  const { slug } = await params
  const admin = createAdminClient()

  const project = await getProjectBySlug(admin, slug).catch(() => null)

  if (!project || project.status !== 'published') {
    notFound()
  }

  const storyUrl = `${process.env['NEXT_PUBLIC_APP_URL'] ?? ''}/story/${slug}`

  const memories = (project.memories ?? [])
    .sort((a, b) => a.position - b.position)
    .map((m) => ({
      id: m.id,
      title: m.title,
      short_description: (m as { short_description?: string | null }).short_description ?? null,
      description: m.description ?? null,
      occurred_at: m.occurred_at ?? null,
      emoji: m.emoji ?? null,
      position: m.position,
    }))

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="mx-auto max-w-md">
        <StoryExperience
          partnerName1={project.partner_name_1}
          partnerName2={project.partner_name_2}
          startDate={project.relationship_start_date}
          memories={memories}
          finalMessage={project.final_message ?? null}
          authorName={project.partner_name_1}
        />
      </div>

      <StoryShareBar
        url={storyUrl}
        title={`${project.partner_name_1} & ${project.partner_name_2} — Nossa história`}
      />
    </div>
  )
}
