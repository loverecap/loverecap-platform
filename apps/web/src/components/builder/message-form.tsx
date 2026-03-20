'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, ArrowLeft, Loader2, Sparkles, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { useBuilder } from '@/contexts/builder-context'

const schema = z.object({
  message: z.string().min(10, 'Escreva pelo menos 10 caracteres').max(1000),
})

type FormValues = z.infer<typeof schema>

const toSentenceCase = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : str

const AI_CACHE_KEY = 'loverecap:ai-messages'
const AI_MAX = 3

export function MessageForm() {
  const { state, dispatch } = useBuilder()
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(false)
  const [aiMessages, setAiMessages] = useState<string[]>([])
  const [aiIndex, setAiIndex] = useState(0)

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(AI_CACHE_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as string[]
        if (Array.isArray(parsed) && parsed.length > 0) {
          setAiMessages(parsed)
          setAiIndex(parsed.length - 1)
        }
      }
    } catch {
    }
  }, [])

  const form = useForm<FormValues>({
    // @ts-expect-error -- @hookform/resolvers expects Zod v4; project uses Zod v3
    resolver: zodResolver(schema),
    defaultValues: { message: state.finalMessage },
  })

  const { formState: { isSubmitting }, watch } = form
  const charCount = watch('message')?.length ?? 0

  async function onSubmit(values: FormValues) {
    if (!state.projectId) {
      toast.error('Projeto não encontrado. Por favor, volte.')
      return
    }
    try {
      const res = await fetch('/api/projects/update', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: state.projectId, final_message: values.message }),
      })
      const json = await res.json() as { error?: { message: string } }
      if (!res.ok || json.error) throw new Error(json.error?.message ?? 'Erro ao salvar mensagem')
      dispatch({ type: 'SET_FINAL_MESSAGE', payload: values.message })
      router.push('/create/music')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar mensagem')
    }
  }

  async function handleAIClick() {
    if (aiMessages.length < AI_MAX) {
      setIsGenerating(true)
      try {
        const res = await fetch('/api/ai/generate-message', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            partnerName1: state.info?.partner_name_1,
            partnerName2: state.info?.partner_name_2,
            startDate: state.info?.relationship_start_date,
            memoryTitles: state.memories.map((m) => m.title),
          }),
        })
        const json = await res.json() as { message?: string; error?: string }
        if (!res.ok || json.error) throw new Error(json.error ?? 'Erro ao gerar mensagem')
        if (!json.message) throw new Error('Resposta vazia')

        const updated = [...aiMessages, json.message]
        const newIndex = updated.length - 1
        setAiMessages(updated)
        setAiIndex(newIndex)
        form.setValue('message', json.message, { shouldValidate: true })
        sessionStorage.setItem(AI_CACHE_KEY, JSON.stringify(updated))
      } catch (err) {
        toast.error(err instanceof Error ? err.message : 'Erro ao gerar mensagem. Tente novamente.')
      } finally {
        setIsGenerating(false)
      }
      return
    }

    const next = (aiIndex + 1) % aiMessages.length
    setAiIndex(next)
    form.setValue('message', aiMessages[next]!, { shouldValidate: true })
  }

  const isCycling = aiMessages.length >= AI_MAX
  const remaining = AI_MAX - aiMessages.length

  function handleSkip() {
    router.push('/create/music')
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Mensagem final</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Escreva uma mensagem do coração para encerrar sua história. Ela aparece no final da sua página.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="message"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between mb-1.5">
                  <FormLabel className="mb-0">Sua mensagem</FormLabel>

                  <button
                    type="button"
                    onClick={handleAIClick}
                    disabled={isGenerating}
                    className="flex items-center gap-1.5 text-xs font-medium text-[#FF4D6D] hover:opacity-80 disabled:opacity-50 transition-opacity cursor-pointer"
                  >
                    {isGenerating ? (
                      <Loader2 className="h-3 w-3 animate-spin" />
                    ) : isCycling ? (
                      <RefreshCw className="h-3 w-3" />
                    ) : (
                      <Sparkles className="h-3 w-3" />
                    )}

                    {isGenerating && 'Gerando...'}
                    {!isGenerating && !isCycling && (
                      remaining < AI_MAX
                        ? `Gerar com IA (${remaining} restante${remaining === 1 ? '' : 's'})`
                        : 'Gerar com IA'
                    )}
                    {!isGenerating && isCycling && (
                      <span>
                        Outra versão{' '}
                        <span className="tabular-nums text-[#FF4D6D]/60">
                          {aiIndex + 1}/{aiMessages.length}
                        </span>
                      </span>
                    )}
                  </button>
                </div>

                <FormControl>
                  <Textarea
                    placeholder="Cada dia com você parece o começo de algo lindo..."
                    className="min-h-50 text-base leading-relaxed"
                    autoCapitalize="sentences"
                    {...field}
                    onChange={(e) => field.onChange(toSentenceCase(e.target.value))}
                  />
                </FormControl>
                <div className="flex items-center justify-between">
                  <FormDescription>Seja honesto, seja você. Não precisa ser perfeito.</FormDescription>
                  <span className={`text-xs ${charCount > 900 ? 'text-orange-500 font-medium' : 'text-neutral-400'}`}>
                    {charCount}/1000
                  </span>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <Button type="button" variant="ghost" onClick={() => router.push('/create/photos')}>
              <ArrowLeft className="h-4 w-4" />
              Voltar
            </Button>
            <div className="flex items-center gap-3">
              <Button
                type="button"
                variant="ghost"
                onClick={handleSkip}
                disabled={isSubmitting}
                className="text-neutral-400 hover:text-neutral-600"
              >
                Pular
              </Button>
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    Continuar
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}
