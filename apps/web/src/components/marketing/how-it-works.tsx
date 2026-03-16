'use client'

import { motion } from 'framer-motion'
import { ClipboardList, ImagePlus, Share2 } from 'lucide-react'
import { PageContainer } from '@/components/shared/page-container'
import { SectionContainer } from '@/components/shared/section-container'

const steps = [
  {
    icon: ClipboardList,
    step: '01',
    title: 'Preencha sua história',
    description:
      'Adicione os nomes, a data de início, as memórias importantes e uma mensagem final. Leva menos de 10 minutos.',
  },
  {
    icon: ImagePlus,
    step: '02',
    title: 'Envie suas fotos',
    description:
      'Adicione fotos que capturam os melhores momentos juntos. Vamos organizá-las lindamente na sua linha do tempo.',
  },
  {
    icon: Share2,
    step: '03',
    title: 'Compartilhe o momento',
    description:
      'Receba um link exclusivo para sua página. Envie como presente, compartilhe nas redes ou guarde como memória privada.',
  },
]

export function HowItWorks() {
  return (
    <SectionContainer id="how-it-works" className="bg-neutral-50">
      <PageContainer>
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF4D6D] mb-3">
            Como funciona
          </p>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">
            Pronto em minutos
          </h2>
          <p className="mt-3 text-neutral-500 max-w-md mx-auto">
            Sem precisar de habilidades em design. Só a sua história.
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {steps.map((step, i) => (
            <motion.div
              key={step.step}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative mb-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFF0F3]">
                  <step.icon className="h-6 w-6 text-[#FF4D6D]" />
                </div>
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-[#FF4D6D] text-[10px] font-bold text-white">
                  {i + 1}
                </span>
              </div>
              <h3 className="font-heading text-lg font-semibold text-neutral-900 mb-2">
                {step.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </SectionContainer>
  )
}
