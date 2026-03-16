'use client'

import { useState, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Plus, Trash2, ArrowRight, ArrowLeft, Loader2, GripVertical, ImagePlus, X, CalendarDays, AlignLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateInput } from '@/components/ui/date-input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useBuilder } from '@/contexts/builder-context'
import { cn } from '@loverecap/utils'

const toTitleCase = (str: string) => str.replace(/\b\w/g, (c) => c.toUpperCase())
const toSentenceCase = (str: string) => str ? str.charAt(0).toUpperCase() + str.slice(1) : str

const MAX_PHOTO_SIZE_MB = 10
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

const memorySchema = z.object({
  title: z.string().min(1, 'Obrigatório').max(120),
  short_description: z.string().max(80).optional(),
  description: z.string().max(1000).optional(),
  occurred_at: z.string().optional(),
  emoji: z.string().min(1, 'Escolha um ícone para este momento'),
})

type MemoryFormValues = z.infer<typeof memorySchema>

const EMOJI_SUGGESTIONS = [
  '❤️', '✈️', '🏠', '🎉', '🐶', '💍', '👶', '☕', '🌊', '⛄', '🎓', '🌺',
  '🎂', '🎬', '🏖️', '🌙', '🤝', '🥂', '🎵', '📸',
]

export function TimelineForm() {
  const { state, dispatch } = useBuilder()
  const router = useRouter()
  const [isAdding, setIsAdding] = useState(state.memories.length === 0)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingPhoto, setPendingPhoto] = useState<{ file: File; previewUrl: string } | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const form = useForm<MemoryFormValues>({
    // @ts-expect-error -- @hookform/resolvers expects Zod v4; project uses Zod v3
    resolver: zodResolver(memorySchema),
    defaultValues: { title: '', short_description: '', description: '', occurred_at: '', emoji: '' },
  })

  function handlePhotoFile(file: File) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Apenas imagens JPG, PNG e WebP são permitidas.')
      return
    }
    if (file.size > MAX_PHOTO_SIZE_MB * 1024 * 1024) {
      toast.error(`A imagem deve ter menos de ${MAX_PHOTO_SIZE_MB}MB.`)
      return
    }
    const previewUrl = URL.createObjectURL(file)
    setPendingPhoto({ file, previewUrl })
  }

  function handlePhotoSelect(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    e.target.value = ''
    if (file) handlePhotoFile(file)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handlePhotoFile(file)
  }

  async function onAddMemory(values: MemoryFormValues) {
    if (!state.projectId) {
      toast.error('Projeto não encontrado. Por favor, volte.')
      return
    }

    setIsSaving(true)
    try {
      const res = await fetch('/api/memories/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: state.projectId,
          title: values.title,
          short_description: values.short_description || undefined,
          description: values.description || undefined,
          occurred_at: values.occurred_at || undefined,
          emoji: values.emoji,
        }),
      })

      const json = await res.json() as { data?: { id: string }; error?: { message: string } }

      if (!res.ok || json.error) throw new Error(json.error?.message ?? 'Erro ao salvar memória')
      if (!json.data?.id) throw new Error('ID da memória não retornado')

      const memoryId = json.data.id

      let assetId: string | undefined
      let photoPreviewUrl: string | undefined

      if (pendingPhoto) {
        const signRes = await fetch('/api/uploads/sign-url', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            project_id: state.projectId,
            memory_id: memoryId,
            file_name: pendingPhoto.file.name,
            mime_type: pendingPhoto.file.type,
            size_bytes: pendingPhoto.file.size,
          }),
        })

        const signJson = await signRes.json() as {
          data?: { asset_id: string; signed_url: string }
          error?: { message: string }
        }

        if (!signRes.ok || signJson.error) {
          throw new Error(signJson.error?.message ?? 'Erro ao obter URL de upload')
        }

        const { asset_id, signed_url } = signJson.data!

        const uploadRes = await fetch(signed_url, {
          method: 'PUT',
          headers: { 'Content-Type': pendingPhoto.file.type },
          body: pendingPhoto.file,
        })

        if (!uploadRes.ok) throw new Error('Erro ao enviar foto. Tente novamente.')

        assetId = asset_id
        photoPreviewUrl = pendingPhoto.previewUrl
      }

      dispatch({
        type: 'ADD_MEMORY',
        payload: {
          id: memoryId,
          title: values.title,
          ...(values.short_description ? { short_description: values.short_description } : {}),
          ...(values.description ? { description: values.description } : {}),
          ...(values.occurred_at ? { occurred_at: values.occurred_at } : {}),
          emoji: values.emoji,
          ...(assetId !== undefined ? { assetId } : {}),
          ...(photoPreviewUrl !== undefined ? { photoPreviewUrl } : {}),
        },
      })

      form.reset()
      setPendingPhoto(null)
      setIsAdding(false)
      toast.success('Memória adicionada!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar memória')
    } finally {
      setIsSaving(false)
    }
  }

  const shortDescriptionValue = form.watch('short_description') ?? ''
  const selectedEmoji = form.watch('emoji')

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Sua linha do tempo</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Adicione os momentos importantes da sua história. Pelo menos uma memória é obrigatória.
        </p>
      </div>

      {state.memories.length > 0 && (
        <div className="space-y-3">
          {state.memories.map((memory) => (
            <div
              key={memory.id}
              className="flex items-start gap-3 rounded-xl border border-neutral-200 bg-white p-4"
            >
              <GripVertical className="mt-0.5 h-4 w-4 shrink-0 text-neutral-300" />
              {memory.photoPreviewUrl && (
                <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-lg">
                  <Image src={memory.photoPreviewUrl} alt={memory.title} fill className="object-cover" />
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  {memory.emoji && <span className="text-lg">{memory.emoji}</span>}
                  <p className="text-sm font-semibold text-neutral-900 truncate">{memory.title}</p>
                  {memory.occurred_at && (
                    <span className="ml-auto text-xs text-neutral-400 shrink-0">{memory.occurred_at}</span>
                  )}
                </div>
                {(memory.short_description ?? memory.description) && (
                  <p className="mt-0.5 text-xs text-neutral-500 line-clamp-1">
                    {memory.short_description ?? memory.description}
                  </p>
                )}
              </div>
              <button
                onClick={() => dispatch({ type: 'REMOVE_MEMORY', payload: memory.id })}
                className="shrink-0 text-neutral-300 hover:text-red-400 transition-colors"
                aria-label="Remover memória"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {isAdding ? (
        <div className="rounded-xl border border-[#FF4D6D]/30 bg-[#FFF0F3]/40 p-5">
          <h2 className="font-heading text-base font-semibold text-neutral-900 mb-5">
            Nova memória
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onAddMemory)} className="space-y-5">

              {/* ── Ícone (obrigatório) ────────────────────────────────────── */}
              <FormField
                control={form.control}
                name="emoji"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Ícone do momento <span className="text-[#FF4D6D]">*</span>
                    </FormLabel>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {EMOJI_SUGGESTIONS.map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => field.onChange(e)}
                          className={cn(
                            'flex h-10 w-10 items-center justify-center rounded-xl border text-xl transition-all',
                            field.value === e
                              ? 'border-[#FF4D6D] bg-[#FFF0F3] scale-110 shadow-sm'
                              : fieldState.error
                                ? 'border-red-200 bg-white hover:border-[#FF4D6D] hover:bg-[#FFF0F3]/50'
                                : 'border-neutral-200 bg-white hover:border-neutral-300 hover:bg-neutral-50',
                          )}
                          aria-label={e}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                    <p className="text-[11px] text-neutral-400 mt-1">
                      Aparece no cartão da memória na linha do tempo
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ── Foto do momento ───────────────────────────────────────── */}
              <div>
                <p className="mb-2 text-sm font-medium text-neutral-700">
                  Foto do momento <span className="text-neutral-400 font-normal">(opcional)</span>
                </p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                  onChange={handlePhotoSelect}
                />
                {pendingPhoto ? (
                  <div className="relative aspect-video w-full overflow-hidden rounded-xl">
                    <Image
                      src={pendingPhoto.previewUrl}
                      alt="Preview"
                      fill
                      className="object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => setPendingPhoto(null)}
                      className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
                      aria-label="Remover foto"
                    >
                      <X className="h-4 w-4" />
                    </button>
                    <div className="absolute bottom-2 left-2 rounded-md bg-black/40 px-2 py-0.5 text-[11px] text-white/80">
                      {pendingPhoto.file.name}
                    </div>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDrop}
                    className={cn(
                      'flex w-full flex-col items-center gap-2 rounded-xl border-2 border-dashed bg-white px-4 py-6 text-center transition-all',
                      isDragging
                        ? 'border-[#FF4D6D] bg-[#FFF0F3]/40 scale-[1.01]'
                        : 'border-neutral-200 hover:border-[#FF4D6D] hover:bg-[#FFF0F3]/20',
                    )}
                  >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3]">
                      <ImagePlus className="h-5 w-5 text-[#FF4D6D]" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-neutral-700">
                        {isDragging ? 'Solte a foto aqui' : 'Clique ou arraste uma foto'}
                      </p>
                      <p className="text-xs text-neutral-400 mt-0.5">JPG, PNG, WebP · máx. 10MB</p>
                    </div>
                  </button>
                )}
              </div>

              {/* ── Título + Data ─────────────────────────────────────────── */}
              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Título da memória <span className="text-[#FF4D6D]">*</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Ex: Primeira viagem juntos"
                          autoCapitalize="words"
                          {...field}
                          onChange={(e) => field.onChange(toTitleCase(e.target.value))}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="occurred_at"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center gap-1.5">
                        <CalendarDays className="h-3.5 w-3.5 text-neutral-400" />
                        Quando aconteceu? <span className="text-neutral-400 font-normal">(opcional)</span>
                      </FormLabel>
                      <FormControl>
                        <DateInput {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* ── Prévia ────────────────────────────────────────────────── */}
              <FormField
                control={form.control}
                name="short_description"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex items-center justify-between">
                      <FormLabel className="flex items-center gap-1.5">
                        Frase do cartão <span className="text-neutral-400 font-normal">(opcional)</span>
                      </FormLabel>
                      <span className={cn(
                        'text-xs tabular-nums',
                        shortDescriptionValue.length > 70 ? 'text-amber-500' : 'text-neutral-400',
                        shortDescriptionValue.length >= 80 ? 'text-red-500' : '',
                      )}>
                        {shortDescriptionValue.length}/80
                      </span>
                    </div>
                    <FormControl>
                      <Input
                        placeholder="Ex: Nosso primeiro rolê juntos"
                        maxLength={80}
                        autoCapitalize="sentences"
                        {...field}
                        onChange={(e) => field.onChange(toSentenceCase(e.target.value))}
                      />
                    </FormControl>
                    <p className="text-[11px] text-neutral-400">
                      Frase curta exibida no cartão — seja direto e romântico
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* ── Descrição completa ────────────────────────────────────── */}
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center gap-1.5">
                      <AlignLeft className="h-3.5 w-3.5 text-neutral-400" />
                      Descrição completa <span className="text-neutral-400 font-normal">(opcional)</span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Conta mais sobre esse momento especial..."
                        className="min-h-20 resize-none"
                        autoCapitalize="sentences"
                        {...field}
                        onChange={(e) => field.onChange(toSentenceCase(e.target.value))}
                      />
                    </FormControl>
                    <p className="text-[11px] text-neutral-400">
                      Aparece ao abrir a memória completa
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-2 pt-1">
                <Button type="submit" size="sm" disabled={isSaving}>
                  {isSaving ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {isSaving ? 'Salvando...' : 'Adicionar memória'}
                </Button>
                {state.memories.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => { setIsAdding(false); setPendingPhoto(null); form.reset() }}
                  >
                    Cancelar
                  </Button>
                )}
              </div>

              {/* Preview do ícone selecionado */}
              {selectedEmoji && (
                <p className="text-xs text-neutral-400">
                  Ícone selecionado: <span className="text-base">{selectedEmoji}</span>
                </p>
              )}
            </form>
          </Form>
        </div>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-neutral-300 bg-white py-4 text-sm font-medium text-neutral-500 hover:border-[#FF4D6D] hover:text-[#FF4D6D] transition-colors"
        >
          <Plus className="h-4 w-4" />
          Adicionar outra memória
        </button>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="ghost" onClick={() => router.push('/create/info')}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <Button
          type="button"
          size="lg"
          onClick={() => router.push('/create/message')}
          disabled={state.memories.length === 0}
        >
          Continuar
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
