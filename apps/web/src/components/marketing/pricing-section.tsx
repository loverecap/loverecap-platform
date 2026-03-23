'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Check, Heart, Shield, Zap, Star, Lock } from 'lucide-react'
import { PageContainer } from '@/components/shared/page-container'
import { SectionContainer } from '@/components/shared/section-container'

const features = [
  { text: 'Página de história personalizada', highlight: false },
  { text: 'Até 12 memórias na linha do tempo', highlight: false },
  { text: 'Até 20 fotos na galeria', highlight: false },
  { text: 'Mensagem final do coração', highlight: true },
  { text: 'Link exclusivo para compartilhar', highlight: false },
  { text: 'Lua, signos e estatísticas do casal', highlight: false },
  { text: 'Layout lindo no celular', highlight: false },
  { text: 'Online para sempre', highlight: true },
]

const avatars = ['C', 'M', 'R', 'J']

export function PricingSection() {
  const reduce = useReducedMotion()

  return (
    <SectionContainer id="pricing" className="relative overflow-hidden bg-[#FFF0F3]">
      {/* Soft radial glow toward the card side */}
      <div
        className="absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(ellipse 70% 55% at 65% 50%, #FFE4EC 0%, transparent 70%)',
        }}
      />

      <PageContainer>
        {/* Section headline */}
        <motion.div
          initial={reduce ? {} : { opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <div
            className="mb-4 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-widest"
            style={{
              background: '#FFF0F3',
              border: '1px solid #FFD6E0',
              color: '#FF4D6D',
            }}
          >
            🔥 Oferta de lançamento
          </div>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">
            Uma vez só. Para sempre.
          </h2>
          <p className="mt-3 mx-auto max-w-sm text-sm text-neutral-500">
            Sem assinatura. Sem taxa mensal. Pague uma vez e a história fica online para sempre.
          </p>
        </motion.div>

        {/* Two-column layout */}
        <div className="mx-auto flex max-w-3xl flex-col items-start gap-10 lg:flex-row lg:items-center lg:gap-12">

          {/* LEFT — benefit list */}
          <motion.div
            initial={reduce ? {} : { opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex-1"
          >
            <p
              className="mb-6 text-[13px] font-semibold uppercase tracking-widest"
              style={{ color: '#FF4D6D' }}
            >
              Tudo incluído
            </p>

            <ul className="space-y-3.5">
              {features.map((f, i) => (
                <motion.li
                  key={f.text}
                  initial={reduce ? {} : { opacity: 0, x: -16 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.06 }}
                  className="flex items-center gap-3"
                >
                  <div
                    className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full"
                    style={{ background: '#FFF0F3' }}
                  >
                    <Check className="h-2.5 w-2.5" style={{ color: '#FF4D6D' }} strokeWidth={3} />
                  </div>
                  <span
                    className="text-sm"
                    style={{
                      color: f.highlight ? '#E8003E' : '#525252',
                      fontWeight: f.highlight ? 600 : 400,
                    }}
                  >
                    {f.text}
                  </span>
                </motion.li>
              ))}
            </ul>

            {/* Social proof */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.5 }}
              className="mt-10 flex items-center gap-3"
            >
              <div className="flex -space-x-2">
                {avatars.map((a) => (
                  <div
                    key={a}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-2 text-[11px] font-bold text-white"
                    style={{
                      background: 'linear-gradient(135deg, #FF4D6D, #E8003E)',
                      borderColor: '#FFF8F2',
                    }}
                  >
                    {a}
                  </div>
                ))}
              </div>
              <div>
                <p className="text-[12px] font-semibold text-neutral-800">
                  847+ histórias criadas
                </p>
                <div className="mt-0.5 flex items-center gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className="h-2.5 w-2.5 fill-amber-400 text-amber-400" />
                  ))}
                  <span className="ml-1 text-[11px] text-neutral-400">4.9 / 5</span>
                </div>
              </div>
            </motion.div>
          </motion.div>

          {/* RIGHT — price card */}
          <motion.div
            initial={reduce ? {} : { opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.1 }}
            className="relative w-full lg:max-w-sm"
          >
            {/* Glow halo */}
            <div
              className="absolute -inset-4 rounded-3xl blur-2xl"
              style={{ background: 'rgba(255,77,109,0.18)', zIndex: -1 }}
            />

            <div
              className="relative overflow-hidden rounded-2xl"
              style={{
                background: '#fff',
                boxShadow:
                  '0 0 0 1px rgba(255,77,109,0.12), 0 20px 56px rgba(232,0,62,0.18)',
              }}
            >
              {/* Top accent strip */}
              <div
                className="h-1 w-full"
                style={{
                  background: 'linear-gradient(90deg, #E8003E, #FF4D6D, #FF8FA3)',
                }}
              />

              <div className="p-7">
                {/* Badge */}
                <div
                  className="mb-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide"
                  style={{ background: '#FFF0F3', color: '#FF4D6D' }}
                >
                  <Zap className="h-2.5 w-2.5" />
                  Pagamento único
                </div>

                {/* Price */}
                <div className="mb-1 flex items-end gap-3">
                  <span className="font-heading text-5xl font-bold leading-none text-neutral-900">
                    R$9,99
                  </span>
                  <span className="mb-1 text-lg font-medium text-neutral-400 line-through">
                    R$29,90
                  </span>
                </div>

                <p className="mb-1 text-[13px] font-semibold" style={{ color: '#FF4D6D' }}>
                  67% de desconto — só por tempo limitado
                </p>
                <p className="mb-7 text-[12px] text-neutral-400">
                  Pague uma vez · sem assinatura · sem cobranças futuras
                </p>

                {/* CTA */}
                <Link
                  href="/create"
                  className="group relative flex w-full items-center justify-center gap-2.5 overflow-hidden rounded-full py-4 text-[15px] font-bold text-white transition-all duration-200 active:scale-[0.97]"
                  style={{
                    background: 'linear-gradient(135deg, #FF4D6D 0%, #E8003E 100%)',
                    boxShadow: '0 8px 28px rgba(255,77,109,0.45)',
                  }}
                >
                  <span
                    className="absolute inset-0 -translate-x-full skew-x-12 bg-white/20 transition-transform duration-700 group-hover:translate-x-full"
                    aria-hidden
                  />
                  <Heart className="relative h-4 w-4 shrink-0 fill-white text-white" />
                  <span className="relative">Quero fazer isso agora</span>
                </Link>

                {/* Trust row */}
                <div className="mt-5 flex items-center justify-center gap-1.5">
                  <Lock className="h-3 w-3 text-neutral-400" />
                  <p className="text-[11px] text-neutral-400">
                    Pagamento seguro via PIX · Acesso imediato
                  </p>
                </div>
              </div>

              {/* Bottom guarantee strip */}
              <div
                className="flex items-center justify-center gap-2 px-7 py-3.5 text-[12px] font-medium"
                style={{
                  background: '#FFF0F3',
                  borderTop: '1px solid #FFD6E0',
                  color: '#E8003E',
                }}
              >
                <Shield className="h-3.5 w-3.5 text-[#FF4D6D]" />
                Se não emocionar, devolvemos seu dinheiro
              </div>
            </div>

            {/* Below card stats */}
            <motion.div
              initial={reduce ? {} : { opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: 0.35 }}
              className="mt-5 flex items-center justify-center gap-6"
            >
              {[
                { icon: Zap, text: 'Pronto em 10 min' },
                { icon: Heart, text: 'Feito para emocionar' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-1.5">
                  <Icon className="h-3.5 w-3.5 text-[#FF4D6D]" />
                  <span className="text-[12px] text-neutral-500">{text}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </PageContainer>
    </SectionContainer>
  )
}
