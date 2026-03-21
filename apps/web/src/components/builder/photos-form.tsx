'use client'

import { useRef, useEffect, useState } from 'react'
import { ImagePlus, X, Loader2, ArrowRight, ArrowLeft, Image as ImageIcon } from 'lucide-react'
import { toast } from 'sonner'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useBuilder } from '@/contexts/builder-context'

const MAX_SIZE_MB = 10
const MAX_PHOTOS = 6
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']

export function PhotosForm() {
  const { state, dispatch } = useBuilder()
  const router = useRouter()
  const [uploading, setUploading] = useState<string[]>([])
  const [deleting, setDeleting] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const handleFocus = () => {
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const photos = state.uploadedPhotos
  const atLimit = photos.length >= MAX_PHOTOS
  const remaining = MAX_PHOTOS - photos.length

  async function uploadFile(file: File) {
    if (!state.projectId) {
      toast.error('Projeto não encontrado. Por favor, volte.')
      return
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      toast.error('Apenas imagens JPG, PNG e WebP são permitidas.')
      return
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      toast.error(`A imagem deve ter menos de ${MAX_SIZE_MB}MB.`)
      return
    }

    setUploading((prev) => [...prev, file.name])

    try {
      const signRes = await fetch('/api/uploads/sign-url', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: state.projectId,
          file_name: file.name,
          mime_type: file.type,
          size_bytes: file.size,
        }),
      })

      const signJson = await signRes.json() as {
        data?: { asset_id: string; signed_url: string; storage_path: string }
        error?: { message: string }
      }

      if (!signRes.ok || signJson.error) {
        throw new Error(signJson.error?.message ?? 'Erro ao obter URL de upload')
      }

      const { asset_id, signed_url, storage_path } = signJson.data!

      const uploadRes = await fetch(signed_url, {
        method: 'PUT',
        headers: { 'Content-Type': file.type },
        body: file,
      })

      if (!uploadRes.ok) throw new Error('Erro ao enviar. Tente novamente.')

      const previewUrl = URL.createObjectURL(file)
      // Use ADD_UPLOADED_PHOTO to atomically append — avoids stale closure when
      // multiple files are uploaded concurrently via forEach
      dispatch({
        type: 'ADD_UPLOADED_PHOTO',
        payload: { assetId: asset_id, storagePath: storage_path, previewUrl, name: file.name },
      })
      toast.success('Foto enviada!')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao enviar foto')
    } finally {
      setUploading((prev) => prev.filter((n) => n !== file.name))
    }
  }

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const files = Array.from(e.target.files ?? []).slice(0, remaining)
    files.forEach((file) => void uploadFile(file))
    e.target.value = ''
  }

  async function removePhoto(assetId: string) {
    setDeleting((prev) => [...prev, assetId])
    try {
      const res = await fetch('/api/uploads/delete', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ asset_id: assetId }),
      })
      const json = await res.json() as { error?: { message: string } }
      if (!res.ok || json.error) throw new Error(json.error?.message ?? 'Erro ao remover')

      dispatch({
        type: 'SET_UPLOADED_PHOTOS',
        payload: state.uploadedPhotos.filter((p) => p.assetId !== assetId),
      })
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao remover foto')
    } finally {
      setDeleting((prev) => prev.filter((id) => id !== assetId))
    }
  }

  const isBusy = uploading.length > 0

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Adicionar fotos</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Envie até {MAX_PHOTOS} fotos que capturam seus melhores momentos. Você pode pular esta etapa se preferir.
        </p>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        className="hidden"
        onChange={handleFileChange}
      />

      {!atLimit && (
        <button
          onClick={() => fileInputRef.current?.click()}
          className="flex w-full flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-300 bg-white py-10 text-center hover:border-[#FF4D6D] hover:bg-[#FFF0F3]/20 transition-all"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0F3]">
            <ImagePlus className="h-5 w-5 text-[#FF4D6D]" />
          </div>
          <div>
            <p className="text-sm font-semibold text-neutral-900">Clique para enviar fotos</p>
            <p className="mt-0.5 text-xs text-neutral-400">
              JPG, PNG, WebP · Máx. 10MB cada · {remaining} de {MAX_PHOTOS} restantes
            </p>
          </div>
        </button>
      )}

      {atLimit && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-5 py-4 text-center">
          <p className="text-sm font-medium text-neutral-700">Limite de {MAX_PHOTOS} fotos atingido</p>
          <p className="text-xs text-neutral-400 mt-0.5">Remova uma foto para adicionar outra</p>
        </div>
      )}

      {(photos.length > 0 || uploading.length > 0) && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
          {photos.map((photo) => {
            const isDeleting = deleting.includes(photo.assetId)
            return (
              <div
                key={photo.assetId}
                className="group relative aspect-square overflow-hidden rounded-xl border border-neutral-200"
              >
                {photo.previewUrl ? (
                  <Image src={photo.previewUrl} alt={photo.name} fill className="object-cover" unoptimized />
                ) : (
                  <div className="flex h-full flex-col items-center justify-center gap-1 bg-neutral-100">
                    <ImageIcon className="h-6 w-6 text-neutral-400" />
                    <p className="px-2 text-center text-xs text-neutral-400 line-clamp-2">{photo.name}</p>
                  </div>
                )}
                {isDeleting && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                    <Loader2 className="h-5 w-5 animate-spin text-white" />
                  </div>
                )}
                <button
                  onClick={() => void removePhoto(photo.assetId)}
                  disabled={isDeleting}
                  className="absolute right-1.5 top-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/50 text-white opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity disabled:opacity-50"
                  aria-label="Remover foto"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            )
          })}
          {uploading.map((name) => (
            <div
              key={name}
              className="flex aspect-square items-center justify-center rounded-xl border border-neutral-200 bg-neutral-50"
            >
              <Loader2 className="h-5 w-5 animate-spin text-neutral-300" />
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="ghost" onClick={() => router.push('/create/timeline')}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>
        <Button type="button" size="lg" onClick={() => router.push('/create/message')} disabled={isBusy}>
          {isBusy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando...
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
  )
}
