'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Check, ArrowRight, Zap, Shield, Heart } from 'lucide-react'
import { PageContainer } from '@/components/shared/page-container'
import { SectionContainer } from '@/components/shared/section-container'

const features = [
  'Página de história personalizada',
  'Até 12 memórias na linha do tempo',
  'Até 20 fotos na galeria',
  'Mensagem final do coração',
  'Link exclusivo para compartilhar',
  'Fase de lua, signos e estatísticas',
  'Layout lindo no celular',
  'Online para sempre',
]

const guarantees = [
  { icon: Zap, text: 'Pronto em 10 minutos' },
  { icon: Shield, text: 'Pagamento seguro via PIX' },
  { icon: Heart, text: 'Feito para emocionar' },
]

export function PricingSection() {
  const reduce = useReducedMotion()

  return (
    <SectionContainer id="pricing" className="bg-neutral-50">
      <PageContainer>
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#FF4D6D]">
            Preço
          </p>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">
            Uma vez só. Para sempre.
          </h2>
          <p className="mt-3 mx-auto max-w-sm text-sm text-neutral-500">
            Sem assinatura. Sem taxa mensal. Pague uma vez e a sua história fica online para sempre.
          </p>
        </motion.div>

        <div className="flex justify-center">
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 28 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative w-full max-w-sm"
          >
            <div
              className="absolute -inset-px rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #FF4D6D, #FF8FA3)',
                borderRadius: '1rem',
              }}
            />

            <div className="relative rounded-2xl bg-white p-7 shadow-xl shadow-[#FF4D6D]/12">
              <div
                className="mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-white"
                style={{ background: 'linear-gradient(135deg, #FF4D6D, #E8003E)' }}
              >
                <span>⚡</span> Pagamento único
              </div>

              <div className="mb-1 flex items-baseline gap-1.5">
                <span className="font-heading text-5xl font-bold text-neutral-900">R$9,99</span>
              </div>
              <p className="mb-6 text-sm text-neutral-400">
                Pague uma vez · sem assinatura · sem cobranças futuras
              </p>

              <ul className="mb-7 space-y-2.5">
                {features.map((f) => (
                  <li key={f} className="flex items-center gap-3 text-sm text-neutral-700">
                    <div
                      className="flex h-4.5 w-4.5 shrink-0 items-center justify-center rounded-full"
                      style={{ background: '#FFF0F3' }}
                    >
                      <Check className="h-2.5 w-2.5 text-[#FF4D6D]" strokeWidth={3} />
                    </div>
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                href="/create"
                className="flex w-full items-center justify-center gap-2.5 rounded-full py-4 text-[15px] font-semibold text-white transition-transform active:scale-[0.97]"
                style={{
                  background: 'linear-gradient(135deg, #FF4D6D 0%, #E8003E 100%)',
                  boxShadow: '0 8px 24px rgba(255,77,109,0.38)',
                }}
              >
                <Heart className="h-4 w-4 shrink-0 fill-white text-white" />
                Criar meu LoveRecap
                <ArrowRight className="h-4 w-4 shrink-0" />
              </Link>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3"
        >
          {guarantees.map(({ icon: Icon, text }) => (
            <div key={text} className="flex items-center gap-2 text-sm text-neutral-500">
              <Icon className="h-4 w-4 text-[#FF4D6D]" />
              {text}
            </div>
          ))}
        </motion.div>
      </PageContainer>
    </SectionContainer>
  )
}
