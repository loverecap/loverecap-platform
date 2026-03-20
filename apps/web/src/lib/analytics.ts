'use client'

export type TrackableEvent =
  | 'hero_cta_clicked'
  | 'example_cta_clicked'
  | 'builder_started'
  | 'story_shared'
  | 'story_copy_link'

interface TrackOptions {
  project_id?: string
  payload?: Record<string, unknown>
}

export async function track(event: TrackableEvent, options: TrackOptions = {}): Promise<void> {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, ...options }),
    })
  } catch {
  }
}
