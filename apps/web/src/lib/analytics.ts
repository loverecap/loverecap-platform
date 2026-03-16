'use client'

/**
 * Client-side analytics helpers.
 *
 * All events are forwarded to POST /api/analytics/event which writes to
 * the event_logs table in Supabase. Failures are silently swallowed —
 * analytics must never affect the user experience.
 *
 * Add new events to the TrackableEvent union and the ALLOWED_EVENTS list
 * in apps/web/src/app/api/analytics/event/route.ts simultaneously.
 */

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

/**
 * Fire-and-forget analytics event from the browser.
 *
 * Usage:
 *   import { track } from '@/lib/analytics'
 *   await track('hero_cta_clicked')
 *   await track('story_shared', { project_id: id })
 */
export async function track(event: TrackableEvent, options: TrackOptions = {}): Promise<void> {
  try {
    await fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, ...options }),
    })
  } catch {
    // Analytics failures must never surface to the user.
  }
}
