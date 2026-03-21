'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BuilderProgress } from '@/components/builder/progress'
import { BuilderLivePreview } from '@/components/builder/builder-live-preview'
import { BUILDER_STEPS, STEP_URLS, type BuilderStep } from '@/contexts/builder-context'

interface BuilderLayoutProps {
  children: React.ReactNode
}

export function BuilderLayout({ children }: BuilderLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  const currentStep: BuilderStep =
    (BUILDER_STEPS.find((s) => pathname === STEP_URLS[s]) as BuilderStep | undefined) ?? 'info'

  const currentIndex = BUILDER_STEPS.indexOf(currentStep)
  const completedSteps = BUILDER_STEPS.slice(0, currentIndex) as BuilderStep[]
  const showPreview = currentStep !== 'review'

  function handleStepClick(step: BuilderStep) {
    router.push(STEP_URLS[step])
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-heading text-sm font-bold text-neutral-900">
            <Heart className="h-4 w-4 fill-[#FF4D6D] text-[#FF4D6D]" />
            LoveRecap
          </Link>
          <span className="text-xs text-neutral-400">Criar sua história</span>
        </div>
        <div className="mx-auto max-w-5xl px-4 pb-3">
          <BuilderProgress
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8">
        <div className={showPreview ? 'flex gap-10 items-start' : ''}>
          <main className="min-w-0 flex-1">
            {children}
          </main>

          {showPreview && (
            <aside className="hidden lg:block w-64 shrink-0">
              <BuilderLivePreview />
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
