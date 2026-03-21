'use client'

import { useState, useRef, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Plus,
  Trash2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  GripVertical,
  ImagePlus,
  X,
  CalendarDays,
  AlignLeft,
  Pencil,
} from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { DateInput } from '@/components/ui/date-input'
import { Textarea } from '@/components/ui/textarea'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { useBuilder } from '@/contexts/builder-context'
import type { BuilderMemory } from '@/contexts/builder-context'
import { cn } from '@loverecap/utils'

const toTitleCase = (str: string) =>
  str.split(' ').map((w) => (w ? w.charAt(0).toUpperCase() + w.slice(1).toLowerCase() : '')).join(' ')
const toSentenceCase = (str: string) => (str ? str.charAt(0).toUpperCase() + str.slice(1) : str)

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
  const [editingId, setEditingId] = useState<string | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [pendingPhoto, setPendingPhoto] = useState<{ file: File; previewUrl: string } | null>(null)
  const [isFileDragging, setIsFileDragging] = useState(false)
  const [dragIndex, setDragIndex] = useState<number | null>(null)
  const [dropTargetIndex, setDropTargetIndex] = useState<number | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleFocus = () => {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const form = useForm<MemoryFormValues>({
    // @ts-expect-error -- @hookform/resolvers expects Zod v4; project uses Zod v3
    resolver: zodResolver(memorySchema),
    defaultValues: { title: '', short_description: '', description: '', occurred_at: '', emoji: '' },
  })

  function openAdd() {
    setEditingId(null)
    setPendingPhoto(null)
    form.reset({ title: '', short_description: '', description: '', occurred_at: '', emoji: '' })
    setIsAdding(true)
  }

  function startEditing(memory: BuilderMemory) {
    setEditingId(memory.id)
    form.reset({
      title: memory.title ?? '',
      short_description: memory.short_description ?? '',
      description: memory.description ?? '',
      occurred_at: memory.occurred_at ?? '',
      emoji: memory.emoji ?? '',
    })
    setPendingPhoto(null)
    setIsAdding(true)
  }

  function cancelForm() {
    setIsAdding(false)
    setEditingId(null)
    setPendingPhoto(null)
    form.reset()
  }

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

  function handleFileDrop(e: React.DragEvent) {
    e.preventDefault()
    setIsFileDragging(false)
    const file = e.dataTransfer.files[0]
    if (file) handlePhotoFile(file)
  }

  function handleDragStart(e: React.DragEvent, index: number) {
    e.dataTransfer.effectAllowed = 'move'
    setDragIndex(index)
  }

  function handleDragOver(e: React.DragEvent, index: number) {
    e.preventDefault()
    e.dataTransfer.dropEffect = 'move'
    if (dropTargetIndex !== index) setDropTargetIndex(index)
  }

  function handleDragLeave(e: React.DragEvent) {
    if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) {
      setDropTargetIndex(null)
    }
  }

  function handleDragEnd() {
    setDragIndex(null)
    setDropTargetIndex(null)
  }

  async function handleMemoryDrop(e: React.DragEvent, dropIdx: number) {
    e.preventDefault()
    setDropTargetIndex(null)
    if (dragIndex === null || dragIndex === dropIdx) {
      setDragIndex(null)
      return
    }
    const newMemories = [...state.memories]
    const [dragged] = newMemories.splice(dragIndex, 1)
    newMemories.splice(dropIdx, 0, dragged!)
    dispatch({ type: 'SET_MEMORIES', payload: newMemories })
    setDragIndex(null)

    if (!state.projectId) return
    try {
      await fetch('/api/memories/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: state.projectId,
          order: newMemories.map((m, i) => ({ id: m.id, position: i })),
        }),
      })
    } catch {
      toast.error('Erro ao salvar ordem. Tente novamente.')
    }
  }

  async function onSubmit(values: MemoryFormValues) {
    if (editingId) {
      await onUpdateMemory(values)
    } else {
      await onAddMemory(values)
    }
  }

  async function onUpdateMemory(values: MemoryFormValues) {
    if (!editingId) return
    setIsSaving(true)
    try {
      const res = await fetch('/api/memories/update', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          memory_id: editingId,
          title: values.title,
          short_description: values.short_description || null,
          description: values.description || null,
          occurred_at: values.occurred_at || undefined,
          emoji: values.emoji,
        }),
      })
      const json = await res.json() as { error?: { message: string } }
      if (!res.ok || json.error) throw new Error(json.error?.message ?? 'Erro ao atualizar memória')

      dispatch({
        type: 'SET_MEMORIES',
        payload: state.memories.map((m) =>
          m.id === editingId
            ? {
                ...m,
                title: values.title,
                ...(values.short_description ? { short_description: values.short_description } : {}),
                ...(values.description ? { description: values.description } : {}),
                ...(values.occurred_at ? { occurred_at: values.occurred_at } : {}),
                emoji: values.emoji,
              }
            : m,
        ),
      })
      cancelForm()
      toast.success('Memória atualizada!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao atualizar')
    } finally {
      setIsSaving(false)
    }
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

        const fileBuffer = await pendingPhoto.file.arrayBuffer()
        const uploadRes = await fetch(signed_url, {
          method: 'PUT',
          headers: { 'Content-Type': pendingPhoto.file.type },
          body: fileBuffer,
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

      cancelForm()
      toast.success('Memória adicionada!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar memória')
    } finally {
      setIsSaving(false)
    }
  }

  const shortDescriptionValue = form.watch('short_description') ?? ''
  const titleValue = form.watch('title') ?? ''

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Sua linha do tempo</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Adicione os momentos importantes da sua história. Pelo menos uma memória é obrigatória.
        </p>
      </div>

      {state.memories.length > 0 && (
        <div className="space-y-2">
          {state.memories.map((memory, i) => (
            <div
              key={memory.id}
              onDragOver={(e) => handleDragOver(e, i)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleMemoryDrop(e, i)}
              className={cn(
                'flex items-start gap-3 rounded-xl border bg-white p-4 transition-colors',
                dragIndex === i && 'opacity-40',
                dropTargetIndex === i && dragIndex !== i
                  ? 'border-[#FF4D6D] bg-[#FFF0F3]/40'
                  : 'border-neutral-200',
              )}
            >
              
              <div
                draggable
                onDragStart={(e) => handleDragStart(e, i)}
                onDragEnd={handleDragEnd}
                className="mt-0.5 cursor-grab active:cursor-grabbing shrink-0 touch-none"
                aria-label="Arrastar para reordenar"
              >
                <GripVertical className="h-4 w-4 text-neutral-300" />
              </div>

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
                onClick={() => startEditing(memory)}
                className="shrink-0 text-neutral-300 hover:text-[#FF4D6D] transition-colors"
                aria-label="Editar memória"
              >
                <Pencil className="h-4 w-4" />
              </button>

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
            {editingId ? 'Editar memória' : 'Nova memória'}
          </h2>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">

              <FormField
                control={form.control}
                name="emoji"
                render={({ field, fieldState }) => (
                  <FormItem>
                    <FormLabel>
                      Ícone do momento <span className="text-[#FF4D6D]">*</span>
                    </FormLabel>
                    <div
                      className={cn(
                        'flex flex-wrap gap-2 mt-1 rounded-xl p-3 border transition-colors',
                        fieldState.error
                          ? 'border-red-300 bg-red-50/50'
                          : 'border-transparent bg-neutral-50',
                      )}
                    >
                      {EMOJI_SUGGESTIONS.map((e) => (
                        <button
                          key={e}
                          type="button"
                          onClick={() => field.onChange(e)}
                          className={cn(
                            'flex h-11 w-11 items-center justify-center rounded-xl border text-xl transition-all',
                            field.value === e
                              ? 'border-[#FF4D6D] bg-[#FFF0F3] scale-110 shadow-md ring-2 ring-[#FF4D6D]/20'
                              : fieldState.error
                                ? 'border-red-200 bg-white hover:border-[#FF4D6D] hover:bg-[#FFF0F3]/60 hover:scale-105'
                                : 'border-neutral-200 bg-white hover:border-[#FF4D6D]/50 hover:bg-[#FFF0F3]/40 hover:scale-105',
                          )}
                          aria-label={e}
                          title={e}
                        >
                          {e}
                        </button>
                      ))}
                    </div>
                    {fieldState.error ? (
                      <FormMessage />
                    ) : (
                      <p className="text-[11px] text-neutral-400 mt-1">
                        Escolha um emoji que representa este momento
                      </p>
                    )}
                  </FormItem>
                )}
              />

              {!editingId && (
                <div>
                  <p className="mb-2 text-sm font-medium text-neutral-700">
                    Foto do momento <span className="text-neutral-400 font-normal">(opcional)</span>
                  </p>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple={false}
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
                      <div className="absolute bottom-2 left-2 flex items-center gap-1.5 rounded-md bg-black/50 px-2 py-1">
                        <ImagePlus className="h-3 w-3 text-white/70" />
                        <span className="text-[11px] text-white/80 max-w-40 truncate">{pendingPhoto.file.name}</span>
                      </div>
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={(e) => { e.preventDefault(); setIsFileDragging(true) }}
                      onDragLeave={() => setIsFileDragging(false)}
                      onDrop={handleFileDrop}
                      className={cn(
                        'flex w-full flex-col items-center gap-3 rounded-xl border-2 border-dashed bg-white px-4 py-7 text-center transition-all cursor-pointer',
                        isFileDragging
                          ? 'border-[#FF4D6D] bg-[#FFF0F3]/40 scale-[1.01]'
                          : 'border-neutral-200 hover:border-[#FF4D6D] hover:bg-[#FFF0F3]/20',
                      )}
                    >
                      <div className={cn(
                        'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
                        isFileDragging ? 'bg-[#FF4D6D]/15' : 'bg-[#FFF0F3]',
                      )}>
                        <ImagePlus className="h-6 w-6 text-[#FF4D6D]" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-neutral-700">
                          {isFileDragging ? 'Solte a foto aqui ✨' : 'Adicionar uma foto'}
                        </p>
                        <p className="text-xs text-neutral-400 mt-1">
                          Toque para selecionar · JPG, PNG, WebP · máx. 10MB
                        </p>
                      </div>
                    </button>
                  )}
                </div>
              )}

              <div className="grid gap-4 sm:grid-cols-2">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <div className="flex items-center justify-between">
                        <FormLabel>
                          Título da memória <span className="text-[#FF4D6D]">*</span>
                        </FormLabel>
                        <span className={cn(
                          'text-xs tabular-nums',
                          titleValue.length > 100 ? 'text-amber-500' : 'text-neutral-400',
                          titleValue.length >= 120 ? 'text-red-500' : '',
                        )}>
                          {titleValue.length}/120
                        </span>
                      </div>
                      <FormControl>
                        <Input
                          placeholder="Ex: Primeira viagem juntos"
                          autoCapitalize="off"
                          maxLength={120}
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
                        onBlur={(e) => { field.onChange(toSentenceCase(e.target.value.trim())); field.onBlur() }}
                      />
                    </FormControl>
                    <p className="text-[11px] text-neutral-400">
                      Frase curta exibida no cartão — seja direto e romântico
                    </p>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                  ) : editingId ? (
                    <Pencil className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                  {isSaving
                    ? (editingId ? 'Salvando...' : 'Adicionando...')
                    : (editingId ? 'Salvar alterações' : 'Adicionar memória')}
                </Button>
                {(state.memories.length > 0 || editingId) && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={cancelForm}
                  >
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Form>
        </div>
      ) : (
        <button
          onClick={openAdd}
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
          onClick={() => router.push('/create/photos')}
          disabled={state.memories.length === 0}
        >
          Continuar
          <ArrowRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}
