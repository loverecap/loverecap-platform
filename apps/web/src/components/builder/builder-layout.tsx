'use client'

import { Heart } from 'lucide-react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { BuilderProgress } from '@/components/builder/progress'
import { BUILDER_STEPS, STEP_URLS, type BuilderStep } from '@/contexts/builder-context'

interface BuilderLayoutProps {
  children: React.ReactNode
}

export function BuilderLayout({ children }: BuilderLayoutProps) {
  const pathname = usePathname()
  const router = useRouter()

  // Derive current step from URL — single source of truth
  const currentStep: BuilderStep =
    (BUILDER_STEPS.find((s) => pathname === STEP_URLS[s]) as BuilderStep | undefined) ?? 'info'

  const currentIndex = BUILDER_STEPS.indexOf(currentStep)
  const completedSteps = BUILDER_STEPS.slice(0, currentIndex) as BuilderStep[]

  function handleStepClick(step: BuilderStep) {
    router.push(STEP_URLS[step])
  }

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="sticky top-0 z-40 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex h-14 max-w-2xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2 font-heading text-sm font-bold text-neutral-900">
            <Heart className="h-4 w-4 fill-[#FF4D6D] text-[#FF4D6D]" />
            LoveRecap
          </Link>
          <span className="text-xs text-neutral-400">Criar sua história</span>
        </div>
        <div className="mx-auto max-w-2xl px-4 pb-3">
          <BuilderProgress
            currentStep={currentStep}
            completedSteps={completedSteps}
            onStepClick={handleStepClick}
          />
        </div>
      </header>

      <main className="mx-auto max-w-2xl px-4 py-8">
        {children}
      </main>
    </div>
  )
}
