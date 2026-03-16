'use client'

import { cn } from '@loverecap/utils'
import { Check } from 'lucide-react'
import { BUILDER_STEPS, STEP_LABELS, type BuilderStep } from '@/contexts/builder-context'

interface BuilderProgressProps {
  currentStep: BuilderStep
  completedSteps: BuilderStep[]
  onStepClick?: (step: BuilderStep) => void
}

export function BuilderProgress({ currentStep, completedSteps, onStepClick }: BuilderProgressProps) {
  return (
    <nav aria-label="Builder progress" className="w-full">
      <ol className="flex items-center justify-between gap-1 sm:gap-2">
        {BUILDER_STEPS.map((step, i) => {
          const isCompleted = completedSteps.includes(step)
          const isCurrent = step === currentStep
          const isClickable = isCompleted && !!onStepClick

          return (
            <li key={step} className="flex flex-1 items-center">
              <button
                onClick={() => isClickable && onStepClick(step)}
                disabled={!isClickable}
                className={cn(
                  'flex flex-col items-center gap-1.5 flex-1 group',
                  isClickable && 'cursor-pointer',
                  !isClickable && 'cursor-default',
                )}
                aria-current={isCurrent ? 'step' : undefined}
              >
                <div
                  className={cn(
                    'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold transition-all',
                    isCompleted && 'bg-[#FF4D6D] text-white',
                    isCurrent && !isCompleted && 'border-2 border-[#FF4D6D] bg-[#FFF0F3] text-[#FF4D6D]',
                    !isCurrent && !isCompleted && 'border-2 border-neutral-200 bg-white text-neutral-400',
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : <span>{i + 1}</span>}
                </div>
                <span
                  className={cn(
                    'hidden text-[10px] font-medium sm:block transition-colors',
                    isCurrent && 'text-[#FF4D6D]',
                    isCompleted && 'text-neutral-700',
                    !isCurrent && !isCompleted && 'text-neutral-400',
                  )}
                >
                  {STEP_LABELS[step]}
                </span>
              </button>

              {i < BUILDER_STEPS.length - 1 && (
                <div
                  className={cn(
                    'h-px flex-1 mx-1 transition-colors',
                    isCompleted ? 'bg-[#FF4D6D]' : 'bg-neutral-200',
                  )}
                />
              )}
            </li>
          )
        })}
      </ol>
    </nav>
  )
}
