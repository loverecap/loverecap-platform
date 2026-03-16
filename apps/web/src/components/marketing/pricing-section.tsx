'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Check, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/shared/page-container'
import { SectionContainer } from '@/components/shared/section-container'

const features = [
  'Página de história personalizada',
  'Até 12 memórias na linha do tempo',
  'Até 20 fotos',
  'Mensagem final',
  'Link exclusivo para compartilhar',
  'Layout otimizado para celular',
  'Fica online para sempre',
]

export function PricingSection() {
  return (
    <SectionContainer id="pricing" className="bg-neutral-50">
      <PageContainer>
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF4D6D] mb-3">
            Preço
          </p>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">
            Preço único e simples
          </h2>
          <p className="mt-3 text-neutral-500 max-w-md mx-auto">
            Sem assinatura. Sem taxas escondidas. Pague uma vez, guarde para sempre.
          </p>
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-sm rounded-2xl border-2 border-[#FF4D6D] bg-white p-8 shadow-xl shadow-[#FF4D6D]/10"
          >
            <div className="mb-6">
              <p className="text-sm font-semibold text-[#FF4D6D] mb-1">LoveRecap</p>
              <div className="flex items-baseline gap-1">
                <span className="font-heading text-5xl font-bold text-neutral-900">R$9,99</span>
                <span className="text-neutral-400 text-sm">pagamento único</span>
              </div>
            </div>

            <ul className="space-y-3 mb-8">
              {features.map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-neutral-700">
                  <Check className="h-4 w-4 shrink-0 text-[#FF4D6D]" />
                  {feature}
                </li>
              ))}
            </ul>

            <Button asChild size="lg" className="w-full">
              <Link href="/create">
                Criar meu LoveRecap
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>

            <p className="mt-4 text-center text-xs text-neutral-400">
              Pagamento seguro · Sem assinatura
            </p>
          </motion.div>
        </div>
      </PageContainer>
    </SectionContainer>
  )
}
