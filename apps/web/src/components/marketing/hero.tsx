'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Heart, Star, Clock } from 'lucide-react'

export function Hero() {
  const reduce = useReducedMotion()

  return (
    <section className="relative overflow-hidden bg-[#FFF8F2]">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-40 left-1/2 -translate-x-1/2 h-[600px] w-[700px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(255,176,200,0.55) 0%, transparent 68%)' }}
        />
        <div
          className="absolute bottom-0 right-0 h-[350px] w-[350px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(255,190,208,0.40) 0%, transparent 65%)' }}
        />
      </div>

      <div className="mx-auto max-w-md px-5 pt-14 pb-10 text-center">
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: -10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45 }}
          className="mb-7 flex justify-center"
        >
          <div
            className="inline-flex max-w-75 flex-col rounded-[18px] rounded-bl-sm bg-white px-4 py-3 text-left shadow-lg"
            style={{ border: '1px solid #EDE0E8', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
          >
            <p className="text-[14px] font-medium leading-snug text-neutral-900">
              amor… eu chorei vendo isso 😭❤️
            </p>
            <div className="mt-1.5 flex items-center justify-between">
              <span className="text-[10px] text-neutral-400">Sofia, RJ</span>
              <span className="text-[10px] text-neutral-400">21:34 ✓✓</span>
            </div>
          </div>
        </motion.div>

        <motion.h1
          initial={reduce ? {} : { opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.55, delay: 0.1 }}
          className="font-heading text-[2.5rem] font-bold leading-[1.1] tracking-tight text-neutral-900 sm:text-5xl"
        >
          Eu fiz isso pro meu namorado…
          <br />
          <span style={{ color: '#FF4D6D' }}>e ele chorou 😭</span>
        </motion.h1>

        <motion.p
          initial={reduce ? {} : { opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-5 text-[15px] leading-relaxed text-neutral-500"
        >
          Crie uma página com as memórias, fotos e uma mensagem especial. Mande o link. A reação deles vai ser inesquecível.
        </motion.p>

        <motion.div
          initial={reduce ? {} : { opacity: 0, scale: 0.92 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.25 }}
          className="mt-5 inline-flex items-center gap-2.5 rounded-full border border-[#F7E3EB] bg-white px-4 py-2 shadow-sm"
        >
          <div className="flex -space-x-1.5">
            {['#FF4D6D', '#FF8FA3', '#FFADC0'].map((color, i) => (
              <div key={i} className="h-6 w-6 rounded-full border-2 border-white" style={{ background: color }} />
            ))}
          </div>
          <span className="text-[11px] font-semibold text-neutral-700">847 casais já criaram</span>
          <div className="flex items-center gap-px">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-6 flex flex-col gap-3"
        >
          <Link
            href="/create"
            className="flex w-full items-center justify-center gap-2.5 rounded-full py-3.75 text-[15px] font-semibold text-white transition-transform active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #FF4D6D 0%, #E8003E 100%)',
              boxShadow: '0 8px 28px rgba(255,77,109,0.44), 0 2px 6px rgba(255,77,109,0.2)',
            }}
          >
            <Heart className="h-4 w-4 shrink-0 fill-white text-white" />
            Quero fazer isso também ❤️
          </Link>
          <Link
            href="/example"
            className="flex w-full items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-white py-3.25 text-[13px] font-medium text-neutral-600 transition-colors hover:border-[#FFADC0] hover:text-[#FF4D6D]"
          >
            Ver um exemplo real →
          </Link>
        </motion.div>

        <motion.div
          initial={reduce ? {} : { opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.55 }}
          className="mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-neutral-400"
        >
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Pronto em 10 min
          </span>
          <span>·</span>
          <span>Pagamento único R$9,99</span>
          <span>·</span>
          <span>Online para sempre</span>
        </motion.div>
      </div>

      <div className="relative mx-auto px-6 pb-0" style={{ maxWidth: 340 }}>
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 44 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.42 }}
          className="relative"
        >
          <motion.div
            initial={reduce ? {} : { opacity: 0, x: 28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.9, duration: 0.5 }}
            className="absolute -right-5 top-10 z-20 max-w-38.75 sm:-right-9"
          >
            <div
              className="rounded-2xl rounded-tr-sm bg-white px-3.5 py-2.5 shadow-xl"
              style={{ border: '1px solid #F7E3EB' }}
            >
              <p className="text-[11px] font-semibold leading-snug text-neutral-800">
                "Nunca vi ele chorar assim 😭❤️"
              </p>
              <p className="mt-0.5 text-[9px] text-neutral-400">— Camila, SP</p>
            </div>
          </motion.div>

          <motion.div
            initial={reduce ? {} : { opacity: 0, x: -28 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.1, duration: 0.5 }}
            className="absolute -left-5 bottom-28 z-20 max-w-38 sm:-left-9"
          >
            <div
              className="rounded-2xl rounded-tl-sm bg-white px-3.5 py-2.5 shadow-xl"
              style={{ border: '1px solid #F7E3EB' }}
            >
              <p className="text-[11px] font-semibold leading-snug text-neutral-800">
                "Melhor presente que já dei 💕"
              </p>
              <p className="mt-0.5 text-[9px] text-neutral-400">— Fernanda, RJ</p>
            </div>
          </motion.div>

          <StoryPhoneMockup />
        </motion.div>

        <div
          className="pointer-events-none absolute bottom-0 left-0 right-0 h-32"
          style={{ background: 'linear-gradient(to bottom, transparent, #FFF0F3)' }}
        />
      </div>
    </section>
  )
}

function StoryPhoneMockup() {
  const memories = [
    { emoji: '☕', title: 'Primeiro café juntos', date: 'Jun 2019', bg: '#FFD0DC' },
    { emoji: '✈️', title: 'Viagem a Portugal', date: 'Dez 2020', bg: '#C8D8FF' },
    { emoji: '💍', title: 'Pedido de casamento', date: 'Jun 2024', bg: '#D8F0C8' },
  ]

  return (
    <div
      className="relative mx-auto overflow-hidden"
      style={{
        width: '100%',
        maxWidth: 272,
        borderRadius: '2.5rem',
        border: '6px solid #1C1C1E',
        boxShadow: '0 32px 72px rgba(0,0,0,0.30), 0 8px 20px rgba(0,0,0,0.12), inset 0 0 0 1px rgba(255,255,255,0.08)',
        background: '#1C1C1E',
      }}
    >
      <div className="absolute inset-x-0 top-0 z-20 flex justify-center pt-1.5">
        <div className="h-4 w-24 rounded-b-xl bg-[#1C1C1E]" />
      </div>

      <div className="overflow-hidden" style={{ background: '#FFF8F2' }}>
        <div
          className="relative flex flex-col items-center justify-center pt-10 pb-7 text-center"
          style={{
            background: 'linear-gradient(158deg, #FF4D6D 0%, #E8003E 48%, #C9184A 100%)',
            minHeight: 176,
          }}
        >
          <div
            className="absolute inset-0 opacity-10"
            style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '24px 24px' }}
          />
          <p className="relative text-[9px] font-semibold uppercase tracking-[0.3em] text-white/65 mb-2">nossa história</p>
          <h3 className="relative text-[22px] font-bold text-white" style={{ fontFamily: 'Georgia, "Times New Roman", serif', letterSpacing: '0.02em' }}>
            Ana & Pedro
          </h3>
          <p className="relative mt-1 text-[8.5px] text-white/65 uppercase tracking-widest">juntos desde 12/06/2019</p>
          <div className="relative mt-3.5 rounded-full bg-white/20 px-3.5 py-1 text-[9px] font-semibold text-white backdrop-blur-sm">
            💕 2.088 dias juntos
          </div>
        </div>

        <div className="px-3 pt-2.5 pb-1">
          <p className="text-[7.5px] font-bold uppercase tracking-[0.24em] text-[#E89AAE]">Nossos momentos</p>
        </div>

        <div className="space-y-2 px-3 pb-3">
          {memories.map((m, i) => (
            <div key={i} className="flex items-center gap-2.5 rounded-2xl p-2.5" style={{ background: m.bg + '55' }}>
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl text-sm" style={{ background: m.bg }}>
                {m.emoji}
              </div>
              <div>
                <p className="text-[9px] font-semibold text-neutral-800">{m.title}</p>
                <p className="text-[8px] text-neutral-400">{m.date}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mx-3 mb-3 rounded-2xl border border-[#F7E3EB] bg-white p-2.5">
          <p className="text-[8px] italic leading-relaxed text-neutral-400">
            "Você é minha aventura favorita. Obrigado por cada sorriso, cada viagem..."
          </p>
        </div>
      </div>
    </div>
  )
}
