import { redirect } from 'next/navigation'
import Link from 'next/link'
import type { Metadata } from 'next'
import { Heart, Plus } from 'lucide-react'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { getProjectsByUser } from '@loverecap/database'
import { ProjectCard } from '@/components/dashboard/project-card'
import { Button } from '@/components/ui/button'
import { Nav } from '@/components/shared/nav'

export const metadata: Metadata = {
  title: 'Meus LoveRecaps',
  robots: { index: false, follow: false },
}

export default async function DashboardPage() {
  const supabase = await createRouteHandlerClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.is_anonymous) {
    redirect('/sign-in')
  }

  const projects = await getProjectsByUser(supabase, user.id)

  return (
    <>
      <Nav />
      <main className="min-h-[calc(100vh-4rem)] bg-neutral-50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          
          <div className="flex items-center justify-between mb-10">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E89AAE] mb-1">
                Suas histórias
              </p>
              <h1 className="font-heading text-2xl font-bold text-neutral-900">
                Meus LoveRecaps
              </h1>
            </div>
            <Button asChild>
              <Link href="/create">
                <Plus className="h-4 w-4" />
                Criar novo
              </Link>
            </Button>
          </div>

          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF0F3]">
                <Heart className="h-8 w-8 fill-[#FF4D6D] text-[#FF4D6D]" />
              </div>
              <h2 className="font-heading text-xl font-bold text-neutral-900 mb-2">
                Nenhum LoveRecap ainda
              </h2>
              <p className="text-sm text-neutral-500 mb-8 max-w-xs leading-relaxed">
                Crie o seu primeiro retrospecto de amor e surpreenda quem você ama.
              </p>
              <Button asChild size="lg">
                <Link href="/create">
                  <Plus className="h-4 w-4" />
                  Criar meu primeiro LoveRecap
                </Link>
              </Button>
            </div>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  )
}
