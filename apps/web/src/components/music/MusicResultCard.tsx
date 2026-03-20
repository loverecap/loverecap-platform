'use client'

import { Play, Pause, Check, Music2 } from 'lucide-react'
import type { TrackResult } from './types'

interface Props {
  track: TrackResult
  isSelected: boolean
  isPreviewing: boolean
  onSelect: (track: TrackResult) => void
  onTogglePreview: (track: TrackResult) => void
}

export function MusicResultCard({ track, isSelected, isPreviewing, onSelect, onTogglePreview }: Props) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(track)}
      onKeyDown={(e) => e.key === 'Enter' && onSelect(track)}
      className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all select-none ${
        isSelected
          ? 'border-[#FF4D6D] bg-[#FFF0F3]'
          : 'border-neutral-100 bg-white hover:border-neutral-200 hover:bg-neutral-50'
      }`}
    >
      
      <div className="relative shrink-0 h-12 w-12 rounded-lg overflow-hidden bg-neutral-100">
        {track.thumbnail ? (
          <img
            src={track.thumbnail}
            alt={track.title}
            className="h-full w-full object-cover"
            loading="lazy"
          />
        ) : (
          <div className="h-full w-full bg-[#FFF0F3] flex items-center justify-center">
            <Music2 className="h-5 w-5 text-[#FF4D6D]" />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-neutral-900 truncate leading-snug">{track.title}</p>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className="text-xs text-neutral-500 truncate">{track.artist}</span>
          <span className="text-xs text-neutral-300 shrink-0">·</span>
          <span className="text-xs text-neutral-400 shrink-0 tabular-nums">{track.duration}</span>
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation()
          onTogglePreview(track)
        }}
        className={`shrink-0 flex h-8 w-8 items-center justify-center rounded-full transition-all cursor-pointer ${
          isPreviewing
            ? 'bg-[#FF4D6D] text-white shadow-sm shadow-[#FF4D6D]/30'
            : 'bg-neutral-100 text-neutral-500 hover:bg-[#FFF0F3] hover:text-[#FF4D6D]'
        }`}
        aria-label={isPreviewing ? 'Parar preview' : 'Ouvir preview'}
      >
        {isPreviewing ? (
          <Pause className="h-3.5 w-3.5 fill-white" />
        ) : (
          <Play className="h-3.5 w-3.5 fill-neutral-500 translate-x-px group-hover:fill-[#FF4D6D]" />
        )}
      </button>

      {isSelected && (
        <div className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF4D6D]">
          <Check className="h-3 w-3 text-white" strokeWidth={3} />
        </div>
      )}
    </div>
  )
}
