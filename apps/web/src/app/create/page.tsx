'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

// Entry point for the builder flow.
// Signs in anonymously (if not already authenticated) so that the API routes
// have a valid user_id for RLS, then redirects to the first step.
export default function CreatePage() {
  const router = useRouter()

  useEffect(() => {
    async function init() {
      const supabase = createSupabaseBrowserClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        await supabase.auth.signInAnonymously()
      }

      router.replace('/create/info')
    }

    void init()
  }, [router])

  return null
}
