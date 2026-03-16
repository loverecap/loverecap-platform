'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowRight, Heart, Play } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/shared/page-container'

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-20 sm:pt-20 sm:pb-28">
      <div className="absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 h-[600px] w-[600px] rounded-full bg-[#FFF0F3] opacity-60 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-[400px] w-[400px] rounded-full bg-[#FFE0E8] opacity-40 blur-3xl" />
      </div>

      <PageContainer>
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-6 gap-1.5">
              <Heart className="h-3 w-3 fill-current" />
              Para casais que querem guardar cada momento
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="font-heading text-4xl font-bold leading-tight tracking-tight text-neutral-900 sm:text-5xl lg:text-6xl max-w-3xl"
          >
            Transforme sua história de amor em uma{' '}
            <span className="text-[#FF4D6D]">memória linda</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-6 max-w-xl text-lg text-neutral-500 leading-relaxed"
          >
            Crie um retrospecto visual incrível da sua relação — com datas, memórias, fotos e uma mensagem do coração. Compartilhe com quem você ama.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-8 flex flex-col gap-3 sm:flex-row"
          >
            <Button asChild size="xl">
              <Link href="/create">
                Criar meu LoveRecap
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="xl">
              <Link href="/example">
                <Play className="h-4 w-4" />
                Ver exemplo
              </Link>
            </Button>
          </motion.div>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="mt-4 text-xs text-neutral-400"
          >
            Pagamento único · Sem assinatura · Seu para sempre
          </motion.p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-16 flex justify-center"
        >
          <div className="relative w-full max-w-sm rounded-2xl border border-neutral-200 bg-white shadow-2xl shadow-[#FF4D6D]/10 overflow-hidden">
            <div className="bg-gradient-to-br from-[#FF4D6D] to-[#FF6B8A] p-6 text-white text-center">
              <div className="flex items-center justify-center gap-2 mb-1">
                <Heart className="h-5 w-5 fill-white" />
                <span className="font-heading text-lg font-bold">Ana & Pedro</span>
              </div>
              <p className="text-sm text-white/80">Juntos desde 12 de junho de 2019</p>
            </div>
            <div className="p-5 space-y-3">
              {[
                { emoji: '☕', text: 'Primeiro café juntos', date: 'Jun 2019' },
                { emoji: '✈️', text: 'Viagem a Portugal', date: 'Dez 2020' },
                { emoji: '🏠', text: 'Moramos juntos', date: 'Mar 2022' },
                { emoji: '💍', text: 'Noivado', date: 'Jun 2024' },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3 text-sm">
                  <span className="text-lg">{item.emoji}</span>
                  <span className="flex-1 text-neutral-700">{item.text}</span>
                  <span className="text-xs text-neutral-400">{item.date}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-neutral-100 p-4 text-center">
              <p className="text-xs text-neutral-500 italic">"Você é minha aventura favorita."</p>
            </div>
          </div>
        </motion.div>
      </PageContainer>
    </section>
  )
}
