'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { FileHeart, ImagePlus, Share2 } from 'lucide-react'
import { PageContainer } from '@/components/shared/page-container'
import { SectionContainer } from '@/components/shared/section-container'

const steps = [
  {
    icon: FileHeart,
    step: '01',
    title: 'Conte a história de vocês',
    description:
      'Adicione os nomes, a data em que se conheceram, as memórias mais marcantes e uma mensagem final. Leva menos de 10 minutos.',
    time: '~5 min',
  },
  {
    icon: ImagePlus,
    step: '02',
    title: 'Envie as fotos favoritas',
    description:
      'Suba as fotos que capturam os melhores momentos juntos. Organizamos tudo de um jeito bonito e emocionante.',
    time: '~3 min',
  },
  {
    icon: Share2,
    step: '03',
    title: 'Compartilhe e emocione',
    description:
      'Você recebe um link exclusivo. Envie pelo WhatsApp, Instagram ou guarde como memória privada. Seu para sempre.',
    time: '~2 min',
  },
]

export function HowItWorks() {
  const reduce = useReducedMotion()

  return (
    <SectionContainer id="how-it-works" className="bg-[#FFF0F3]">
      <PageContainer>
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#FF4D6D]">
            Como funciona
          </p>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">
            Pronto em 10 minutos
          </h2>
          <p className="mt-3 mx-auto max-w-sm text-sm text-neutral-500">
            Sem precisar de habilidades em design. Só a sua história.
          </p>
        </motion.div>

        <div className="relative grid gap-8 sm:grid-cols-3">
          <div
            className="pointer-events-none absolute left-0 right-0 top-7 hidden h-px sm:block"
            style={{
              background:
                'linear-gradient(to right, transparent 8%, #FFADC0 20%, #FFADC0 80%, transparent 92%)',
            }}
          />

          {steps.map((step, i) => {
            const Icon = step.icon
            return (
              <motion.div
                key={step.step}
                initial={reduce ? {} : { opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                className="relative flex flex-col items-center text-center"
              >
                <div className="relative mb-5 z-10">
                  <div
                    className="flex h-14 w-14 items-center justify-center rounded-2xl shadow-sm"
                    style={{
                      background: 'linear-gradient(135deg, #FFF0F3 0%, #FFE0E8 100%)',
                      border: '2px solid #F7E3EB',
                    }}
                  >
                    <Icon className="h-6 w-6 text-[#FF4D6D]" />
                  </div>
                  <div
                    className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold text-white shadow"
                    style={{ background: 'linear-gradient(135deg, #FF4D6D, #E8003E)' }}
                  >
                    {i + 1}
                  </div>
                </div>

                <div
                  className="mb-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-semibold"
                  style={{ background: '#FFF0F3', color: '#FF4D6D' }}
                >
                  {step.time}
                </div>

                <h3 className="font-heading text-base font-semibold text-neutral-900 mb-2">
                  {step.title}
                </h3>
                <p className="text-sm text-neutral-500 leading-relaxed max-w-55 mx-auto">
                  {step.description}
                </p>
              </motion.div>
            )
          })}
        </div>
      </PageContainer>
    </SectionContainer>
  )
}
