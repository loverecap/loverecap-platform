'use client'

import { useState, useEffect, useRef } from 'react'
import { Music2, ArrowRight, ArrowLeft, Loader2, X } from 'lucide-react'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useBuilder } from '@/contexts/builder-context'
import { MusicSearchInput } from '@/components/music/MusicSearchInput'
import { MusicResultList } from '@/components/music/MusicResultList'
import { MusicPreviewPlayer } from '@/components/music/MusicPreviewPlayer'
import type { TrackResult, SelectedTrack } from '@/components/music/types'

export function MusicForm() {
  const { state } = useBuilder()
  const router = useRouter()

  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TrackResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [selectedTrack, setSelectedTrack] = useState<SelectedTrack | null>(null)
  const [previewingId, setPreviewingId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const selectedVideoId = selectedTrack?.videoId

  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)

    const trimmed = query.trim()
    if (trimmed.length < 2) {
      setResults([])
      return
    }

    debounceRef.current = setTimeout(async () => {
      setIsSearching(true)
      try {
        const res = await fetch(`/api/music/search?q=${encodeURIComponent(trimmed)}`)
        const data = await res.json() as { items?: TrackResult[]; error?: string }
        setResults(data.items ?? [])
      } catch {
        setResults([])
      } finally {
        setIsSearching(false)
      }
    }, 500)

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  }, [query])

  function handleSelect(track: TrackResult) {
    setSelectedTrack({ ...track, provider: 'youtube' })
    setPreviewingId(null)
  }

  function handleTogglePreview(track: TrackResult) {
    setPreviewingId((prev) => (prev === track.videoId ? null : track.videoId))
  }

  function handleClearQuery() {
    setQuery('')
    setResults([])
    setPreviewingId(null)
  }

  async function handleSave() {
    if (!state.projectId || !selectedTrack) return

    setSaving(true)
    try {
      const res = await fetch('/api/projects/music', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          project_id: state.projectId,
          track_title: selectedTrack.title,
          artist_name: selectedTrack.artist,
          provider: 'youtube',
          video_id: selectedTrack.videoId,
          thumbnail_url: selectedTrack.thumbnail,
          duration: selectedTrack.duration,
        }),
      })

      const json = await res.json() as { error?: { message: string } }
      if (!res.ok || json.error) throw new Error(json.error?.message ?? 'Erro ao salvar música')

      toast.success('Música salva!')
      router.push('/create/review')
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Erro ao salvar música')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Música da história</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Escolha a música que vai tocar enquanto sua história é lida. Você pode pular esta etapa.
        </p>
      </div>

      {selectedTrack ? (
        <div className="space-y-4">
          <div className="flex items-center gap-4 rounded-2xl border border-[#FFD0DC] bg-[#FFF0F3]/60 p-4">
            {selectedTrack.thumbnail && (
              <img
                src={selectedTrack.thumbnail}
                alt={selectedTrack.title}
                className="h-14 w-14 rounded-xl object-cover shrink-0 shadow-sm"
              />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-neutral-900 truncate leading-snug">{selectedTrack.title}</p>
              <p className="text-sm text-neutral-500 mt-0.5 truncate">
                {selectedTrack.artist}
                {selectedTrack.duration && (
                  <span className="text-neutral-400"> · {selectedTrack.duration}</span>
                )}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setSelectedTrack(null)}
              className="shrink-0 text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer p-1"
              aria-label="Remover música selecionada"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <p className="text-xs text-neutral-400 text-center">
            Clique no × para escolher outra música
          </p>
        </div>
      ) : (
        
        <div className="space-y-3">
          <MusicSearchInput
            value={query}
            onChange={setQuery}
            loading={isSearching}
          />

          <MusicPreviewPlayer
            videoId={previewingId}
            onClose={() => setPreviewingId(null)}
          />

          {!query && (
            <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-neutral-200 bg-neutral-50 py-10 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#FFF0F3]">
                <Music2 className="h-5 w-5 text-[#FF4D6D]" />
              </div>
              <div>
                <p className="text-sm font-medium text-neutral-700">Pesquise qualquer música</p>
                <p className="mt-0.5 text-xs text-neutral-400">
                  Digite o nome da música ou do artista
                </p>
              </div>
            </div>
          )}

          {query.trim().length >= 2 && !isSearching && results.length === 0 && (
            <div className="text-center py-6">
              <p className="text-sm text-neutral-500">Nenhuma música encontrada.</p>
              <button
                type="button"
                onClick={handleClearQuery}
                className="mt-1 text-xs text-[#FF4D6D] hover:underline cursor-pointer"
              >
                Limpar busca
              </button>
            </div>
          )}

          <MusicResultList
            tracks={results}
            selectedId={selectedVideoId}
            previewingId={previewingId ?? undefined}
            onSelect={handleSelect}
            onTogglePreview={handleTogglePreview}
          />
        </div>
      )}

      <div className="flex items-center justify-between pt-2">
        <Button type="button" variant="ghost" onClick={() => router.push('/create/message')}>
          <ArrowLeft className="h-4 w-4" />
          Voltar
        </Button>

        <div className="flex items-center gap-3">
          <Button
            type="button"
            variant="ghost"
            onClick={() => router.push('/create/review')}
            className="text-neutral-400 hover:text-neutral-600"
          >
            Pular
          </Button>

          <Button
            type="button"
            size="lg"
            onClick={handleSave}
            disabled={!selectedTrack || saving}
          >
            {saving ? (
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
    </div>
  )
}
