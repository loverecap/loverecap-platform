'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Loader2, Eye, EyeOff, Mail, CheckCircle2 } from 'lucide-react'
import { toast } from 'sonner'
import { motion, AnimatePresence } from 'framer-motion'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

const magicLinkSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
})

const passwordSchema = z.object({
  email: z.string().email('Digite um e-mail válido'),
  password: z.string().min(6, 'A senha deve ter pelo menos 6 caracteres'),
})

type MagicLinkValues = z.infer<typeof magicLinkSchema>
type PasswordValues = z.infer<typeof passwordSchema>
type Tab = 'magic' | 'password'
type PasswordMode = 'signin' | 'signup'

function MagicLinkTab({ redirectTo }: { redirectTo?: string | undefined }) {
  const [sent, setSent] = useState(false)
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  // @ts-expect-error -- @hookform/resolvers expects Zod v4; project uses Zod v3
  } = useForm<MagicLinkValues>({ resolver: zodResolver(magicLinkSchema) })

  const supabase = createSupabaseBrowserClient()
  const appUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? ''

  async function onSubmit(values: MagicLinkValues) {
    const callbackUrl = redirectTo
      ? `${appUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`
      : `${appUrl}/auth/callback`

    const { error } = await supabase.auth.signInWithOtp({
      email: values.email,
      options: { emailRedirectTo: callbackUrl },
    })

    if (error) {
      toast.error('Erro ao enviar o link. Tente novamente.')
      return
    }

    setSent(true)
  }

  if (sent) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-4"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#FFF0F3]">
          <CheckCircle2 className="h-7 w-7 text-[#FF4D6D]" />
        </div>
        <h3 className="font-heading font-semibold text-neutral-900 mb-2">
          Verifique seu e-mail
        </h3>
        <p className="text-sm text-neutral-500 leading-relaxed">
          Enviamos um link de acesso para{' '}
          <span className="font-medium text-neutral-700">{getValues('email')}</span>.
          <br />
          Clique no link para entrar.
        </p>
        <button
          onClick={() => setSent(false)}
          className="mt-5 text-xs text-[#E89AAE] hover:text-[#FF4D6D] transition-colors"
        >
          Usar outro e-mail
        </button>
      </motion.div>
    )
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="magic-email">E-mail</Label>
        <Input
          id="magic-email"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <>
            <Mail className="h-4 w-4" />
            Enviar link de acesso
          </>
        )}
      </Button>

      <p className="text-center text-xs text-neutral-400 leading-relaxed">
        Sem senha necessária. Enviaremos um link mágico para o seu e-mail.
      </p>
    </form>
  )
}

function PasswordTab({ redirectTo }: { redirectTo?: string | undefined }) {
  const [mode, setMode] = useState<PasswordMode>('signin')
  const [showPassword, setShowPassword] = useState(false)
  const router = useRouter()
  const supabase = createSupabaseBrowserClient()
  const appUrl = process.env['NEXT_PUBLIC_APP_URL'] ?? ''

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  // @ts-expect-error -- @hookform/resolvers expects Zod v4; project uses Zod v3
  } = useForm<PasswordValues>({ resolver: zodResolver(passwordSchema) })

  async function onSubmit(values: PasswordValues) {
    if (mode === 'signin') {
      const { error } = await supabase.auth.signInWithPassword({
        email: values.email,
        password: values.password,
      })
      if (error) {
        toast.error('E-mail ou senha incorretos.')
        return
      }
    } else {
      const callbackUrl = redirectTo
        ? `${appUrl}/auth/callback?next=${encodeURIComponent(redirectTo)}`
        : `${appUrl}/auth/callback`

      const { error } = await supabase.auth.signUp({
        email: values.email,
        password: values.password,
        options: { emailRedirectTo: callbackUrl },
      })
      if (error) {
        toast.error(error.message ?? 'Erro ao criar conta.')
        return
      }
      toast.success('Conta criada! Verifique seu e-mail para confirmar.')
      return
    }

    router.push('/auth/callback?source=password')
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="pw-email">E-mail</Label>
        <Input
          id="pw-email"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          {...register('email')}
        />
        {errors.email && (
          <p className="text-xs text-red-500">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="pw-password">Senha</Label>
        <div className="relative">
          <Input
            id="pw-password"
            type={showPassword ? 'text' : 'password'}
            placeholder={mode === 'signup' ? 'Mínimo 6 caracteres' : '••••••••'}
            autoComplete={mode === 'signup' ? 'new-password' : 'current-password'}
            className="pr-10"
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 transition-colors"
            tabIndex={-1}
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-500">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : mode === 'signin' ? (
          'Entrar'
        ) : (
          'Criar conta'
        )}
      </Button>

      <p className="text-center text-xs text-neutral-500">
        {mode === 'signin' ? (
          <>
            Não tem conta?{' '}
            <button
              type="button"
              onClick={() => setMode('signup')}
              className="text-[#FF4D6D] font-medium hover:underline"
            >
              Criar gratuitamente
            </button>
          </>
        ) : (
          <>
            Já tem conta?{' '}
            <button
              type="button"
              onClick={() => setMode('signin')}
              className="text-[#FF4D6D] font-medium hover:underline"
            >
              Entrar
            </button>
          </>
        )}
      </p>
    </form>
  )
}

export function SignInForm({ redirectTo }: { redirectTo?: string | undefined }) {
  const [tab, setTab] = useState<Tab>('magic')

  return (
    <div className="w-full max-w-sm">
      
      <div className="mb-8 text-center">
        <h2 className="font-heading text-2xl font-bold text-neutral-900 mb-1">
          Bem-vindo de volta
        </h2>
        <p className="text-sm text-neutral-500">
          Acesse sua conta para ver suas histórias
        </p>
      </div>

      <div className="flex border-b border-neutral-200 mb-6">
        {([
          { id: 'magic', label: 'Link mágico' },
          { id: 'password', label: 'E-mail e senha' },
        ] as { id: Tab; label: string }[]).map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTab(t.id)}
            className={`flex-1 pb-3 text-sm font-medium transition-colors relative ${
              tab === t.id ? 'text-[#FF4D6D]' : 'text-neutral-500 hover:text-neutral-700'
            }`}
          >
            {t.label}
            {tab === t.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF4D6D] rounded-full"
              />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {tab === 'magic' ? (
            <MagicLinkTab redirectTo={redirectTo} />
          ) : (
            <PasswordTab redirectTo={redirectTo} />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
