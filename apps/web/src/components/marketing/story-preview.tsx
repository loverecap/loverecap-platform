'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Heart } from 'lucide-react'
import { PageContainer } from '@/components/shared/page-container'
import { SectionContainer } from '@/components/shared/section-container'

const sections = [
  {
    label: 'Capa do casal',
    desc: 'Nome, data e dias juntos',
    preview: <HeroPreview />,
  },
  {
    label: 'Linha do tempo',
    desc: 'Cada memória com emoji e data',
    preview: <TimelinePreview />,
  },
  {
    label: 'Mensagem do coração',
    desc: 'Texto especial para emocionar',
    preview: <MessagePreview />,
  },
]

export function StoryPreview() {
  const reduce = useReducedMotion()

  return (
    <SectionContainer className="bg-white">
      <PageContainer>
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#FF4D6D]">
            Resultado final
          </p>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">
            Veja o que você vai criar
          </h2>
          <p className="mt-3 mx-auto max-w-sm text-sm text-neutral-500">
            Uma página linda que conta a história de vocês — pronta em 10 minutos.
          </p>
        </motion.div>

        <div className="flex snap-x snap-mandatory gap-4 overflow-x-auto pb-2 sm:grid sm:grid-cols-3 sm:overflow-visible sm:pb-0 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {sections.map((s, i) => (
            <motion.div
              key={s.label}
              initial={reduce ? {} : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="w-72 shrink-0 snap-center sm:w-auto"
            >
              <div
                className="overflow-hidden rounded-2xl border shadow-md"
                style={{ borderColor: '#F7E3EB', boxShadow: '0 4px 24px rgba(255,77,109,0.08)' }}
              >
                <div className="flex h-8 items-center gap-1.5 border-b bg-neutral-50 px-3" style={{ borderColor: '#F7E3EB' }}>
                  {['#FF5F57', '#FEBC2E', '#28C840'].map((c) => (
                    <div key={c} className="h-2.5 w-2.5 rounded-full" style={{ background: c }} />
                  ))}
                  <div className="mx-auto h-4 w-28 rounded-full bg-neutral-200 text-[9px]" />
                </div>
                <div style={{ background: '#FFF8F2' }}>
                  {s.preview}
                </div>
              </div>
              <div className="mt-3 text-center">
                <p className="text-sm font-semibold text-neutral-800">{s.label}</p>
                <p className="mt-0.5 text-xs text-neutral-400">{s.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.35 }}
          className="mt-10 flex flex-col items-center gap-3"
        >
          <Link
            href="/create"
            className="inline-flex items-center gap-2.5 rounded-full px-8 py-4 text-[15px] font-semibold text-white transition-transform active:scale-[0.97]"
            style={{
              background: 'linear-gradient(135deg, #FF4D6D 0%, #E8003E 100%)',
              boxShadow: '0 8px 28px rgba(255,77,109,0.38)',
            }}
          >
            <Heart className="h-4 w-4 shrink-0 fill-white text-white" />
            Criar a minha agora ❤️
          </Link>
          <p className="text-xs text-neutral-400">Pronto em 10 min · R$9,99 pagamento único</p>
        </motion.div>
      </PageContainer>
    </SectionContainer>
  )
}

function HeroPreview() {
  return (
    <div
      className="relative flex flex-col items-center justify-center px-5 py-8 text-center"
      style={{
        background: 'linear-gradient(158deg, #FF4D6D 0%, #E8003E 48%, #C9184A 100%)',
        minHeight: 180,
      }}
    >
      <div
        className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 1px)', backgroundSize: '20px 20px' }}
      />
      <p className="relative text-[8px] font-semibold uppercase tracking-[0.3em] text-white/65 mb-1.5">nossa história</p>
      <h3 className="relative text-xl font-bold text-white" style={{ fontFamily: 'Georgia, serif' }}>
        Ana & Pedro
      </h3>
      <p className="relative mt-1 text-[7px] text-white/65 uppercase tracking-widest">juntos desde 12/06/2019</p>
      <div className="relative mt-3 rounded-full bg-white/20 px-3 py-1 text-[9px] font-semibold text-white">
        💕 2.088 dias juntos
      </div>
    </div>
  )
}

function TimelinePreview() {
  const items = [
    { emoji: '☕', title: 'Primeiro café juntos', date: 'Jun 2019', bg: '#FFD0DC' },
    { emoji: '✈️', title: 'Viagem a Portugal', date: 'Dez 2020', bg: '#C8D8FF' },
    { emoji: '💍', title: 'Pedido de casamento', date: 'Jun 2024', bg: '#D8F0C8' },
  ]
  return (
    <div className="px-4 py-5" style={{ minHeight: 180 }}>
      <p className="mb-3 text-[7px] font-bold uppercase tracking-[0.24em] text-[#E89AAE]">Nossos momentos</p>
      <div className="space-y-2">
        {items.map((m) => (
          <div key={m.title} className="flex items-center gap-2 rounded-xl p-2" style={{ background: m.bg + '55' }}>
            <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-sm" style={{ background: m.bg }}>
              {m.emoji}
            </div>
            <div>
              <p className="text-[8px] font-semibold text-neutral-800">{m.title}</p>
              <p className="text-[7px] text-neutral-400">{m.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function MessagePreview() {
  return (
    <div className="flex flex-col items-center justify-center px-5 py-8 text-center" style={{ minHeight: 180 }}>
      <div className="mb-3 text-2xl">💌</div>
      <p className="mb-3 text-[7px] font-bold uppercase tracking-[0.24em] text-[#E89AAE]">Mensagem especial</p>
      <div className="rounded-2xl border border-[#F7E3EB] bg-white p-3">
        <p className="text-[8.5px] italic leading-relaxed text-neutral-500">
          "Você é minha aventura favorita. Obrigado por cada sorriso, cada viagem, cada momento ao seu lado..."
        </p>
      </div>
    </div>
  )
}
