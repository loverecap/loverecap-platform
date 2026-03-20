import { redirect } from 'next/navigation'
import type { Metadata } from 'next'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { SignInForm } from '@/components/auth/sign-in-form'

export const metadata: Metadata = {
  title: 'Entrar',
  description: 'Acesse sua conta e veja suas histórias de amor.',
  robots: { index: false, follow: false },
}

export default async function SignInPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string }>
}) {
  const supabase = await createRouteHandlerClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (user && !user.is_anonymous) {
    redirect('/dashboard')
  }

  const { next } = await searchParams

  return <SignInForm redirectTo={next} />
}
