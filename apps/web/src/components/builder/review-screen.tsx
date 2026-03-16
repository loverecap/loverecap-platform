'use client'

import { useState } from 'react'
import { Heart, ArrowLeft, Check } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { useBuilder } from '@/contexts/builder-context'
import { formatDate } from '@loverecap/utils'
import { PixPayment } from '@/components/payment/pix-payment'

export function ReviewScreen() {
  const { state, dispatch } = useBuilder()
  const [showPix, setShowPix] = useState(false)
  const router = useRouter()

  if (!state.info) {
    return (
      <div className="text-center py-16">
        <p className="text-neutral-500">Nenhum dado encontrado. Por favor, comece novamente.</p>
        <Button variant="ghost" className="mt-4" onClick={() => router.push('/create/info')}>
          Voltar
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-heading text-2xl font-bold text-neutral-900">Revisão da sua história</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Está tudo certo? Prossiga para o pagamento para publicar sua história.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-neutral-200 bg-white shadow-sm">
        <div className="bg-linear-to-br from-[#FF4D6D] to-[#FF6B8A] p-6 text-center text-white">
          <div className="flex items-center justify-center gap-2 mb-1">
            <Heart className="h-5 w-5 fill-white" />
            <span className="font-heading text-xl font-bold">
              {state.info.partner_name_1} &amp; {state.info.partner_name_2}
            </span>
          </div>
          {state.info.relationship_start_date && (
            <p className="text-sm text-white/80">
              Juntos desde {formatDate(state.info.relationship_start_date)}
            </p>
          )}
        </div>

        <div className="p-5 space-y-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
              Linha do tempo · {state.memories.length}{' '}
              {state.memories.length === 1 ? 'memória' : 'memórias'}
            </p>
            <div className="space-y-2">
              {state.memories.map((memory) => (
                <div key={memory.id} className="flex items-center gap-2 text-sm">
                  {memory.emoji && <span>{memory.emoji}</span>}
                  <span className="text-neutral-700">{memory.title}</span>
                  {memory.occurred_at && (
                    <span className="ml-auto text-xs text-neutral-400">{memory.occurred_at}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {state.finalMessage && (
            <>
              <Separator />
              <div>
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-neutral-400">
                  Mensagem final
                </p>
                <p className="text-sm italic leading-relaxed text-neutral-600 line-clamp-3">
                  &ldquo;{state.finalMessage}&rdquo;
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      <div className="rounded-xl border border-neutral-200 bg-neutral-50 p-5">
        <div className="flex items-baseline justify-between mb-1">
          <span className="text-sm font-semibold text-neutral-900">LoveRecap</span>
          <span className="font-heading text-xl font-bold text-neutral-900">R$9,99</span>
        </div>
        <p className="text-xs text-neutral-500 mb-3">Pagamento único · Sem assinatura</p>
        <ul className="space-y-1.5">
          {[
            'Página de história personalizada',
            'Link exclusivo para compartilhar',
            'Fica online para sempre',
          ].map((feature) => (
            <li key={feature} className="flex items-center gap-2 text-xs text-neutral-600">
              <Check className="h-3.5 w-3.5 text-[#FF4D6D] shrink-0" />
              {feature}
            </li>
          ))}
        </ul>
      </div>

      {showPix && state.projectId ? (
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h2 className="font-heading mb-4 text-center text-lg font-semibold text-neutral-900">
            Pague com PIX
          </h2>
          <PixPayment
            projectId={state.projectId}
            onSuccess={() => dispatch({ type: 'RESET' })}
          />
        </div>
      ) : (
        <div className="flex items-center justify-between">
          <Button type="button" variant="ghost" onClick={() => router.push('/create/message')}>
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>
          <Button size="lg" onClick={() => setShowPix(true)}>
            <Heart className="h-4 w-4 fill-white" />
            Pagar R$9,99 e Publicar
          </Button>
        </div>
      )}
    </div>
  )
}
