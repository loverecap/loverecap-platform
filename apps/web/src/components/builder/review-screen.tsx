'use client'

import { useState } from 'react'
import { Heart, ArrowLeft, Check, Lock, Sparkles, CheckCircle2, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { useBuilder } from '@/contexts/builder-context'
import { formatDate } from '@loverecap/utils'
import { PixPayment } from '@/components/payment/pix-payment'

export function ReviewScreen() {
  const { state, dispatch } = useBuilder()
  const [showPix, setShowPix] = useState(false)
  const [paymentDone, setPaymentDone] = useState(false)
  const router = useRouter()

  if (!state.info && !paymentDone) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-500">Nenhum dado encontrado. Por favor, comece novamente.</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push('/create/info')}>
          Voltar
        </Button>
      </div>
    )
  }

  // Bug 5: skeleton loading screen while redirect happens after payment
  if (paymentDone) {
    return (
      <div className="flex flex-col items-center gap-8 py-10 text-center">
        <div className="flex flex-col items-center gap-3">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-8 w-8 text-green-500" />
          </div>
          <p className="font-heading text-xl font-bold text-neutral-900">Pagamento confirmado!</p>
          <p className="text-sm text-neutral-500">Sua história está sendo publicada...</p>
          <Loader2 className="h-5 w-5 animate-spin text-neutral-400" />
        </div>

        {/* Skeleton placeholders */}
        <div className="w-full space-y-3">
          <div className="h-44 w-full animate-pulse rounded-2xl bg-neutral-100" />
          <div className="h-5 w-3/4 animate-pulse rounded-lg bg-neutral-100 mx-auto" />
          <div className="h-5 w-1/2 animate-pulse rounded-lg bg-neutral-100 mx-auto" />
          <div className="h-12 w-full animate-pulse rounded-xl bg-neutral-100" />
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Sua história está pronta</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Publique agora para guardar esse momento para sempre.
        </p>
      </div>

      {/* Bug 6: Blurred story preview — creates emotional urgency */}
      {state.info && (
        <div className="relative overflow-hidden rounded-2xl shadow-lg border border-[#FF4D6D]/20">
          {/* Blurred content */}
          <div
            className="select-none pointer-events-none"
            style={{ filter: 'blur(3.5px)', transform: 'scale(1.02)', transformOrigin: 'center' }}
          >
            <div className="bg-linear-to-br from-[#FF4D6D] to-[#FF8FA3] px-6 pt-10 pb-8 text-center text-white">
              <div className="text-4xl mb-3">{state.memories[0]?.emoji ?? '❤️'}</div>
              <h2 className="font-heading text-xl font-bold mb-1">
                {state.info.partner_name_1} &amp; {state.info.partner_name_2}
              </h2>
              {state.info.relationship_start_date && (
                <p className="text-white/75 text-sm">
                  Juntos desde {formatDate(state.info.relationship_start_date)}
                </p>
              )}
            </div>
            <div className="bg-white px-5 py-4 space-y-3">
              {state.memories.slice(0, 3).map((m) => (
                <div key={m.id} className="flex items-center gap-3 py-1.5 border-b border-neutral-100 last:border-0">
                  <span className="text-xl shrink-0">{m.emoji}</span>
                  <div>
                    <p className="text-sm font-medium text-neutral-900">{m.title}</p>
                    {m.occurred_at && <p className="text-xs text-neutral-400">{m.occurred_at}</p>}
                  </div>
                </div>
              ))}
              {state.memories.length > 3 && (
                <p className="text-center text-xs text-neutral-400 pt-1">
                  +{state.memories.length - 3} memória{state.memories.length - 3 !== 1 ? 's' : ''} a mais...
                </p>
              )}
              {state.finalMessage && (
                <p className="text-xs italic text-neutral-400 pt-2 line-clamp-2 border-t border-neutral-100">
                  &ldquo;{state.finalMessage}&rdquo;
                </p>
              )}
            </div>
          </div>

          {/* Lock overlay */}
          <div className="absolute inset-0 flex items-center justify-center bg-white/25 backdrop-blur-[1.5px]">
            <div className="mx-6 w-full max-w-xs rounded-2xl bg-white/95 px-6 py-5 text-center shadow-2xl border border-neutral-100">
              <div className="mb-3 flex justify-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#FFF0F3]">
                  <Lock className="h-5 w-5 text-[#FF4D6D]" />
                </div>
              </div>
              <p className="font-heading text-base font-bold text-neutral-900">
                Sua história está aqui!
              </p>
              <p className="mt-1 text-xs text-neutral-500">
                Publique agora e nunca perca esses momentos
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Pricing card */}
      {state.info && (
        <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
          <div className="flex items-baseline justify-between mb-1">
            <span className="text-sm font-semibold text-neutral-900">LoveRecap</span>
            <div className="text-right">
              <span className="font-heading text-2xl font-bold text-neutral-900">R$9,99</span>
              <p className="text-[11px] text-neutral-400">pagamento único · sem mensalidade</p>
            </div>
          </div>
          <ul className="space-y-1.5 mt-3">
            {[
              'Sua história online para sempre — nunca some',
              'Link único para compartilhar com quem você ama',
              'Linha do tempo com todos os momentos guardados',
            ].map((feature) => (
              <li key={feature} className="flex items-start gap-2 text-xs text-neutral-600">
                <Check className="h-3.5 w-3.5 text-[#FF4D6D] shrink-0 mt-0.5" />
                {feature}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-[11px] text-neutral-400 text-center border-t border-neutral-200 pt-3">
            Se você não publicar agora, sua história fica apenas como rascunho.
          </p>
        </div>
      )}

      {/* PIX payment or CTA */}
      {showPix && state.projectId ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading mb-4 text-center text-lg font-semibold text-neutral-900">
            Pague com PIX
          </h2>
          <PixPayment
            projectId={state.projectId}
            onSuccess={() => {
              setPaymentDone(true)
              dispatch({ type: 'RESET' })
            }}
          />
        </div>
      ) : (
        /* Bug 4: mobile-friendly full-width layout */
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            className="w-full h-14 text-base"
            onClick={() => setShowPix(true)}
          >
            <Sparkles className="h-4 w-4 shrink-0" />
            Guardar esta história — R$9,99
          </Button>
          <p className="text-center text-[11px] text-neutral-400">
            Sem mensalidade · fica online para sempre
          </p>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full"
            onClick={() => router.push('/create/music')}
          >
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
        </div>
      )}
    </div>
  )
}
