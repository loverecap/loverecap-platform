'use client'

import { Search, X, Loader2 } from 'lucide-react'

interface Props {
  value: string
  onChange: (value: string) => void
  loading?: boolean
}

export function MusicSearchInput({ value, onChange, loading }: Props) {
  return (
    <div className="relative">
      <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Buscar música ou artista..."
        autoComplete="off"
        className="w-full h-11 pl-10 pr-10 text-sm rounded-xl border border-neutral-200 bg-white focus:outline-none focus:ring-2 focus:ring-[#FF4D6D]/25 focus:border-[#FF4D6D] transition-all placeholder:text-neutral-400"
      />

      <div className="absolute right-3.5 top-1/2 -translate-y-1/2">
        {loading ? (
          <Loader2 className="h-4 w-4 text-[#FF4D6D] animate-spin" />
        ) : value ? (
          <button
            onClick={() => onChange('')}
            className="text-neutral-400 hover:text-neutral-700 transition-colors cursor-pointer"
            aria-label="Limpar busca"
            type="button"
          >
            <X className="h-4 w-4" />
          </button>
        ) : null}
      </div>
    </div>
  )
}
