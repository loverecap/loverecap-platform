'use client'

import { motion } from 'framer-motion'
import { Sparkles, Globe, Lock, Heart, Clock, Smartphone } from 'lucide-react'
import { PageContainer } from '@/components/shared/page-container'
import { SectionContainer } from '@/components/shared/section-container'

const benefits = [
  {
    icon: Sparkles,
    title: 'Bonito por padrão',
    description: 'Uma página elegante e sofisticada — sem precisar de um designer.',
  },
  {
    icon: Globe,
    title: 'Link para compartilhar',
    description: 'Receba um link exclusivo para enviar ao seu parceiro ou compartilhar nas redes sociais.',
  },
  {
    icon: Lock,
    title: 'Seu para sempre',
    description: 'Pagamento único. Sem assinatura. Sua história fica online.',
  },
  {
    icon: Heart,
    title: 'Feito com amor',
    description: 'Criado especialmente para casais que querem celebrar sua história.',
  },
  {
    icon: Clock,
    title: 'Pronto em minutos',
    description: 'Preencha o formulário, envie as fotos, pague e sua página está no ar.',
  },
  {
    icon: Smartphone,
    title: 'Otimizado para celular',
    description: 'Fica incrível em qualquer dispositivo — especialmente no celular.',
  },
]

export function Benefits() {
  return (
    <SectionContainer>
      <PageContainer>
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF4D6D] mb-3">
            Por que LoveRecap
          </p>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">
            Tudo que você precisa para contar sua história
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, i) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.07 }}
              className="rounded-xl p-6 border border-neutral-200 bg-white hover:border-[#FF6B8A] hover:shadow-sm transition-all"
            >
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-xl bg-[#FFF0F3]">
                <benefit.icon className="h-5 w-5 text-[#FF4D6D]" />
              </div>
              <h3 className="font-heading text-base font-semibold text-neutral-900 mb-1">
                {benefit.title}
              </h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>
      </PageContainer>
    </SectionContainer>
  )
}
