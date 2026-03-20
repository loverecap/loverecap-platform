'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

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
