'use client'

import type { TrackResult } from './types'
import { MusicResultCard } from './MusicResultCard'

interface Props {
  tracks: TrackResult[]
  selectedId: string | undefined
  previewingId: string | undefined
  onSelect: (track: TrackResult) => void
  onTogglePreview: (track: TrackResult) => void
}

export function MusicResultList({ tracks, selectedId, previewingId, onSelect, onTogglePreview }: Props) {
  if (tracks.length === 0) return null

  return (
    <div className="space-y-2 max-h-95 overflow-y-auto overscroll-contain pr-0.5">
      {tracks.map((track) => (
        <MusicResultCard
          key={track.videoId}
          track={track}
          isSelected={selectedId === track.videoId}
          isPreviewing={previewingId === track.videoId}
          onSelect={onSelect}
          onTogglePreview={onTogglePreview}
        />
      ))}
    </div>
  )
}
