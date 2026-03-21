'use client'

import { useBuilder } from '@/contexts/builder-context'
import { daysBetween } from '@loverecap/utils'

export function BuilderLivePreview() {
  const { state } = useBuilder()

  const name1 = state.info?.partner_name_1
  const name2 = state.info?.partner_name_2
  const hasNames = !!name1 && !!name2
  const hasDate = !!state.info?.relationship_start_date
  const days = hasDate ? daysBetween(state.info!.relationship_start_date) : null
  const hasMemories = state.memories.length > 0
  const hasMessage = !!state.finalMessage

  return (
    <div className="sticky top-24 flex flex-col items-center">
      <p className="mb-4 text-[11px] font-semibold uppercase tracking-widest text-[#FF4D6D]">
        Preview em tempo real
      </p>

      {/* Phone frame */}
      <div
        className="relative overflow-hidden"
        style={{
          width: 220,
          borderRadius: '2rem',
          border: '5px solid #1C1C1E',
          boxShadow: '0 24px 64px rgba(0,0,0,0.28), 0 6px 16px rgba(0,0,0,0.10)',
          background: '#1C1C1E',
        }}
      >
        {/* Notch */}
        <div className="absolute inset-x-0 top-0 z-20 flex justify-center pt-1">
          <div className="h-3 w-16 rounded-b-lg bg-[#1C1C1E]" />
        </div>

        <div className="overflow-hidden" style={{ background: '#FFF8F2', maxHeight: 480 }}>
          {/* Hero section */}
          {hasNames ? (
            <div
              className="relative flex flex-col items-center justify-center px-4 pt-8 pb-5 text-center"
              style={{
                background: 'linear-gradient(158deg, #FF4D6D 0%, #E8003E 48%, #C9184A 100%)',
                minHeight: 130,
              }}
            >
              <div
                className="absolute inset-0 opacity-10"
                style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '18px 18px' }}
              />
              <p className="relative text-[6px] font-semibold uppercase tracking-[0.3em] text-white/65 mb-1">nossa história</p>
              <h3
                className="relative text-[16px] font-bold text-white"
                style={{ fontFamily: 'Georgia, serif', letterSpacing: '0.02em' }}
              >
                {name1} & {name2}
              </h3>
              {hasDate && days !== null && (
                <>
                  <p className="relative mt-0.5 text-[6px] text-white/65 uppercase tracking-widest">
                    juntos desde {state.info!.relationship_start_date.split('-').reverse().join('/')}
                  </p>
                  <div className="relative mt-2 rounded-full bg-white/20 px-2.5 py-0.5 text-[7px] font-semibold text-white">
                    💕 {days.toLocaleString('pt-BR')} dias juntos
                  </div>
                </>
              )}
            </div>
          ) : (
            <div
              className="flex flex-col items-center justify-center px-4 pt-8 pb-5"
              style={{
                background: 'linear-gradient(158deg, #FFB3C1 0%, #FF8FA3 100%)',
                minHeight: 130,
              }}
            >
              <div className="h-3 w-24 animate-pulse rounded-full bg-white/40 mb-2" />
              <div className="h-4 w-32 animate-pulse rounded-full bg-white/40 mb-1.5" />
              <div className="h-2.5 w-20 animate-pulse rounded-full bg-white/30" />
            </div>
          )}

          {/* Timeline section */}
          <div className="px-2.5 pt-2 pb-1">
            <p className="text-[6px] font-bold uppercase tracking-[0.24em] text-[#E89AAE]">Nossos momentos</p>
          </div>

          {hasMemories ? (
            <div className="space-y-1.5 px-2.5 pb-2">
              {state.memories.slice(0, 4).map((m) => (
                <div
                  key={m.id}
                  className="flex items-center gap-2 rounded-xl p-1.5"
                  style={{ background: 'rgba(255,77,109,0.08)' }}
                >
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg text-[11px]"
                    style={{ background: 'rgba(255,77,109,0.14)' }}
                  >
                    {m.emoji ?? '✨'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[7.5px] font-semibold text-neutral-800">{m.title}</p>
                    {m.occurred_at && <p className="text-[6.5px] text-neutral-400">{m.occurred_at}</p>}
                  </div>
                </div>
              ))}
              {state.memories.length > 4 && (
                <p className="text-center text-[6.5px] text-neutral-400">
                  +{state.memories.length - 4} momento{state.memories.length - 4 !== 1 ? 's' : ''}…
                </p>
              )}
            </div>
          ) : (
            <div className="space-y-1.5 px-2.5 pb-2">
              {[72, 56, 64].map((w, i) => (
                <div key={i} className="flex items-center gap-2 rounded-xl p-1.5" style={{ background: 'rgba(0,0,0,0.04)' }}>
                  <div className="h-6 w-6 shrink-0 animate-pulse rounded-lg bg-neutral-200" />
                  <div className="flex-1">
                    <div className="h-2 animate-pulse rounded-full bg-neutral-200" style={{ width: `${w}%` }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Message section */}
          {hasMessage ? (
            <div className="mx-2.5 mb-3 rounded-xl border border-[#F7E3EB] bg-white p-2">
              <p className="text-[7px] italic leading-relaxed text-neutral-400 line-clamp-3">
                &ldquo;{state.finalMessage}&rdquo;
              </p>
            </div>
          ) : (
            <div className="mx-2.5 mb-3 rounded-xl border border-neutral-100 bg-white p-2">
              <div className="space-y-1">
                <div className="h-1.5 w-4/5 animate-pulse rounded-full bg-neutral-100" />
                <div className="h-1.5 w-3/5 animate-pulse rounded-full bg-neutral-100" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Emotional caption */}
      <p className="mt-4 text-center text-[11px] leading-relaxed text-neutral-400">
        {hasNames ? (
          <><span className="font-semibold text-neutral-700">{name1} & {name2}</span><br />isso vai ficar incrível 🥹</>
        ) : (
          <>preencha os campos<br />e veja a magia acontecer ✨</>
        )}
      </p>
    </div>
  )
}
