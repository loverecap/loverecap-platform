'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { Star } from 'lucide-react'
import { PageContainer } from '@/components/shared/page-container'
import { SectionContainer } from '@/components/shared/section-container'

const testimonials = [
  {
    name: 'Camila R.',
    location: 'São Paulo · SP',
    initials: 'CR',
    color: '#FF8FA3',
    stars: 5,
    highlight: '"Meu namorado chorou 😭"',
    text: 'Fiz de surpresa no nosso aniversário de 2 anos. Ele ficou tão emocionado que chorou! Nunca vi ele assim. A página ficou linda demais, super fácil de criar.',
    tag: 'Presente de aniversário',
  },
  {
    name: 'Ricardo A.',
    location: 'Belo Horizonte · MG',
    initials: 'RA',
    color: '#A78BCC',
    stars: 5,
    highlight: '"Ela ficou sem palavras 🥹"',
    text: 'Criei no Dia dos Namorados como surpresa. Minha namorada ficou sem palavras quando abriu. Ela salvou o link nos favoritos do celular e mostra pra todo mundo!',
    tag: 'Dia dos Namorados',
  },
  {
    name: 'Mariana S.',
    location: 'Rio de Janeiro · RJ',
    initials: 'MS',
    color: '#FF6B8A',
    stars: 5,
    highlight: '"Melhor R$9,99 que já gastei"',
    text: 'Mandei o link pra família inteira ver. Todo mundo ficou emocionado com a história de vocês. Valeu imensamente mais do que o preço. Farei de novo no próximo aniversário!',
    tag: 'Compartilhado com a família',
  },
]

export function Testimonials() {
  const reduce = useReducedMotion()

  return (
    <SectionContainer className="bg-[#FFF8F2]">
      <PageContainer>
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-10 text-center"
        >
          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-[#FF4D6D]">
            Histórias reais
          </p>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">
            Já fizeram alguém chorar de felicidade
          </h2>
          <p className="mt-3 mx-auto max-w-sm text-sm text-neutral-500">
            Mais de 800 casais já criaram o LoveRecap. Veja o que estão dizendo.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-3">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              initial={reduce ? {} : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="relative flex flex-col rounded-2xl border border-[#F7E3EB] bg-white p-5 shadow-sm"
            >
              <div className="mb-3 flex gap-0.5">
                {[...Array(t.stars)].map((_, j) => (
                  <Star key={j} className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                ))}
              </div>

              <p className="mb-1 font-heading text-base font-bold text-neutral-900">
                {t.highlight}
              </p>
              <p className="flex-1 text-sm leading-relaxed text-neutral-500">{t.text}</p>

              <div className="mt-4 border-t border-neutral-100 pt-4">
                <div className="flex items-center gap-2.5">
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-[11px] font-bold text-white"
                    style={{ background: t.color }}
                  >
                    {t.initials}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-neutral-800">{t.name}</p>
                    <p className="text-[10px] text-neutral-400">{t.location}</p>
                  </div>
                  <span
                    className="ml-auto rounded-full px-2.5 py-0.5 text-[9.5px] font-semibold"
                    style={{ background: '#FFF0F3', color: '#FF4D6D' }}
                  >
                    {t.tag}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-10 flex flex-wrap items-center justify-center gap-x-10 gap-y-5"
        >
          {[
            { value: '847+', label: 'histórias criadas' },
            { value: '4.9', label: 'avaliação média', suffix: '★' },
            { value: '98%', label: 'recomendam' },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="font-heading text-2xl font-bold text-neutral-900">
                {s.value}
                {s.suffix && <span className="ml-0.5 text-amber-400">{s.suffix}</span>}
              </div>
              <div className="mt-0.5 text-xs text-neutral-400">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </PageContainer>
    </SectionContainer>
  )
}
