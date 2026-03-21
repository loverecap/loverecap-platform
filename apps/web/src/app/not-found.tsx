'use client'

import { motion, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { Heart, Clock, ArrowLeft } from 'lucide-react'

export default function NotFound() {
  const reduce = useReducedMotion()

  return (
    <div className="relative flex min-h-dvh flex-col items-center justify-center overflow-hidden bg-[#FFF8F2] px-5 py-16 text-center">
      {/* Background blobs */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute -top-32 left-1/2 -translate-x-1/2 h-[480px] w-[580px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(255,176,200,0.45) 0%, transparent 68%)' }}
        />
        <div
          className="absolute bottom-0 right-0 h-[300px] w-[300px] rounded-full"
          style={{ background: 'radial-gradient(ellipse, rgba(255,190,208,0.35) 0%, transparent 65%)' }}
        />
      </div>

      {/* Logo */}
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="absolute top-5 left-5"
      >
        <Link href="/" className="flex items-center gap-2 font-heading text-sm font-bold text-neutral-900">
          <Heart className="h-4 w-4 fill-[#FF4D6D] text-[#FF4D6D]" />
          LoveRecap
        </Link>
      </motion.div>

      {/* WhatsApp social proof bubble */}
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: -10, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.45, delay: 0.05 }}
        className="mb-8"
      >
        <div
          className="inline-flex max-w-72 flex-col rounded-[18px] rounded-bl-sm bg-white px-4 py-3 text-left shadow-lg"
          style={{ border: '1px solid #EDE0E8', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}
        >
          <p className="text-[14px] font-medium leading-snug text-neutral-900">
            amor… eu chorei vendo isso 😭❤️
          </p>
          <div className="mt-1.5 flex items-center justify-between gap-4">
            <span className="text-[10px] text-neutral-400">Sofia, RJ</span>
            <span className="text-[10px] text-neutral-400">21:34 ✓✓</span>
          </div>
        </div>
      </motion.div>

      {/* 404 number */}
      <motion.p
        initial={reduce ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="font-heading text-[72px] font-bold leading-none tracking-tight"
        style={{ color: '#FF4D6D', opacity: 0.18 }}
        aria-hidden="true"
      >
        404
      </motion.p>

      {/* Headline */}
      <motion.h1
        initial={reduce ? {} : { opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.15 }}
        className="mt-1 font-heading text-[2rem] font-bold leading-[1.15] tracking-tight text-neutral-900 sm:text-4xl"
      >
        Essa página não existe…
        <br />
        <span style={{ color: '#FF4D6D' }}>mas a história de vocês sim ❤️</span>
      </motion.h1>

      {/* Sub-copy */}
      <motion.p
        initial={reduce ? {} : { opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.22 }}
        className="mt-4 max-w-xs text-[15px] leading-relaxed text-neutral-500"
      >
        O link que você acessou não existe. Mas em menos de 10 minutos você pode criar sua própria história — e causar a mesma reação.
      </motion.p>

      {/* CTAs */}
      <motion.div
        initial={reduce ? {} : { opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="mt-8 flex w-full max-w-xs flex-col gap-3"
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
          Criar minha história agora
        </Link>

        <Link
          href="/"
          className="flex w-full items-center justify-center gap-1.5 rounded-full border border-neutral-200 bg-white py-3.25 text-[13px] font-medium text-neutral-600 transition-colors hover:border-[#FFADC0] hover:text-[#FF4D6D]"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Voltar para o início
        </Link>
      </motion.div>

      {/* Trust row */}
      <motion.div
        initial={reduce ? {} : { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.45 }}
        className="mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1.5 text-[11px] text-neutral-400"
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
  )
}
