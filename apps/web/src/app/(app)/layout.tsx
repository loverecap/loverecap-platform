import { redirect } from 'next/navigation'
import { createRouteHandlerClient } from '@/lib/supabase/server'

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createRouteHandlerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || user.is_anonymous) {
    redirect('/sign-in')
  }

  return <>{children}</>
}
