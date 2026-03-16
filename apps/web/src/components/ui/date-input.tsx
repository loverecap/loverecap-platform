'use client'

import { useRef } from 'react'
import { Calendar } from 'lucide-react'
import { cn } from '@loverecap/utils'

export interface DateInputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const DateInput = ({ className, ...props }: DateInputProps) => {
  const ref = useRef<HTMLInputElement>(null)

  return (
    <div className="relative">
      <input
        ref={ref}
        type="date"
        className={cn(
          'flex h-10 w-full rounded-lg border border-neutral-200 bg-white px-3 py-2 pr-10',
          'text-sm text-neutral-900 ring-offset-white',
          'placeholder:text-neutral-400',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#FF4D6D] focus-visible:ring-offset-2',
          'disabled:cursor-not-allowed disabled:opacity-50',
          // hide browser built-in calendar icon; the native invisible overlay still handles click-to-open
          '[&::-webkit-calendar-picker-indicator]:opacity-0',
          '[&::-webkit-calendar-picker-indicator]:absolute',
          '[&::-webkit-calendar-picker-indicator]:inset-0',
          '[&::-webkit-calendar-picker-indicator]:w-full',
          '[&::-webkit-calendar-picker-indicator]:cursor-pointer',
          className,
        )}
        {...props}
      />
      {/* Visible calendar icon — clicking it opens the native date picker */}
      <button
        type="button"
        tabIndex={-1}
        onClick={() => ref.current?.showPicker?.()}
        className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-[#FF4D6D] transition-colors pointer-events-auto"
        aria-label="Abrir calendário"
      >
        <Calendar className="h-4 w-4" />
      </button>
    </div>
  )
}
DateInput.displayName = 'DateInput'
