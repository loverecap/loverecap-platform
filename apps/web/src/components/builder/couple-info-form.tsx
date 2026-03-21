'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { ArrowRight, Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateInput } from '@/components/ui/date-input'
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage, FormDescription,
} from '@/components/ui/form'
import { useBuilder } from '@/contexts/builder-context'

const toTitleCase = (str: string) =>
  str.split(' ').map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '')).join(' ')

const schema = z.object({
  partner_name_1: z.string().min(1, 'Obrigatório').max(60),
  partner_name_2: z.string().min(1, 'Obrigatório').max(60),
  relationship_start_date: z.string().min(1, 'Obrigatório'),
})

type FormValues = z.infer<typeof schema>

export function CoupleInfoForm() {
  const { state, dispatch } = useBuilder()
  const router = useRouter()

  const form = useForm<FormValues>({
    // @ts-expect-error -- @hookform/resolvers expects Zod v4; project uses Zod v3
    resolver: zodResolver(schema),
    defaultValues: {
      partner_name_1: state.info?.partner_name_1 ?? '',
      partner_name_2: state.info?.partner_name_2 ?? '',
      relationship_start_date: state.info?.relationship_start_date ?? '',
    },
  })

  const { formState: { isSubmitting }, watch } = form
  const name1 = watch('partner_name_1')
  const name2 = watch('partner_name_2')
  const showEmotional = name1.trim().length > 1 && name2.trim().length > 1

  async function onSubmit(values: FormValues) {
    dispatch({ type: 'SET_ERROR', payload: null })

    try {
      const title = `${values.partner_name_1} & ${values.partner_name_2}`

      if (state.projectId) {
        const res = await fetch('/api/projects/update', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ project_id: state.projectId, title, ...values }),
        })
        const json = await res.json() as { error?: { message: string } }
        if (!res.ok || json.error) throw new Error(json.error?.message ?? 'Erro ao atualizar projeto')
      } else {
        const res = await fetch('/api/projects/create', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title, ...values }),
        })
        const json = await res.json() as { data?: { id: string }; error?: { message: string } }
        if (!res.ok || json.error) throw new Error(json.error?.message ?? 'Erro ao criar projeto')
        if (!json.data?.id) throw new Error('ID do projeto não retornado')
        dispatch({ type: 'SET_PROJECT_ID', payload: json.data.id })
      }

      dispatch({ type: 'SET_INFO', payload: { title, ...values } })
      router.push('/create/timeline')
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Algo deu errado'
      dispatch({ type: 'SET_ERROR', payload: message })
      toast.error(message)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Informações do casal</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Nos conte quem vocês são. Esse será o título da sua página.
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              control={form.control}
              name="partner_name_1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Seu nome</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ana"
                      autoCapitalize="off"
                      {...field}
                      onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                      onBlur={(e) => { field.onChange(toTitleCase(e.target.value.trim())); field.onBlur() }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="partner_name_2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nome do(a) parceiro(a)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Pedro"
                      autoCapitalize="off"
                      {...field}
                      onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                      onBlur={(e) => { field.onChange(toTitleCase(e.target.value.trim())); field.onBlur() }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {showEmotional && (
            <div
              className="rounded-2xl border px-4 py-3 text-center"
              style={{ background: '#FFF0F3', borderColor: '#F7E3EB' }}
            >
              <p className="text-sm font-bold text-neutral-900">
                {name1.trim()} & {name2.trim()} ❤️
              </p>
              <p className="mt-0.5 text-xs text-neutral-500">
                Isso já está ficando especial…
              </p>
            </div>
          )}

          <FormField
            control={form.control}
            name="relationship_start_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quando começou a história de vocês?</FormLabel>
                <FormControl>
                  <DateInput {...field} />
                </FormControl>
                <FormDescription>Aniversário do relacionamento ou data em que começaram a namorar.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="pt-2">
            <Button type="submit" size="lg" className="w-full sm:w-auto" disabled={isSubmitting}>
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
        </form>
      </Form>
    </div>
  )
}
