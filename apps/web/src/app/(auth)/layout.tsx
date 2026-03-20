'use client'

import Link from 'next/link'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'

const testimonials = [
  {
    quote: 'Chorei de emoção quando abri. Ele lembrou de cada detalhe.',
    author: 'Ana & Pedro',
    time: '3 anos juntos',
  },
  {
    quote: 'O presente mais lindo que já recebi. Guardarei para sempre.',
    author: 'Camila & Lucas',
    time: '1 ano juntos',
  },
  {
    quote: 'Revivemos cada memória juntos. Simplesmente perfeito.',
    author: 'Juliana & Rafael',
    time: '5 anos juntos',
  },
]

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex">
      
      <div
        className="hidden lg:flex lg:w-1/2 relative flex-col justify-between p-12 overflow-hidden"
        style={{
          background: 'linear-gradient(155deg, #FFF8F2 0%, #F5E9E2 55%, #F8C8DC 100%)',
        }}
      >
        
        <div className="absolute top-0 right-0 w-96 h-96 rounded-full bg-[#F8C8DC]/40 -translate-y-1/2 translate-x-1/3 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-[#FFE0E8]/35 translate-y-1/2 -translate-x-1/3 blur-3xl pointer-events-none" />

        {[
          { top: '15%', left: '10%', size: 14, delay: 0 },
          { top: '25%', right: '12%', size: 10, delay: 0.4 },
          { top: '55%', left: '5%', size: 12, delay: 0.8 },
          { top: '70%', right: '8%', size: 16, delay: 0.2 },
          { top: '85%', left: '20%', size: 9, delay: 1.2 },
        ].map((h, i) => (
          <motion.div
            key={i}
            className="absolute pointer-events-none"
            style={{ top: h.top, left: (h as { left?: string }).left, right: (h as { right?: string }).right }}
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 3 + i * 0.4, repeat: Infinity, ease: 'easeInOut', delay: h.delay }}
          >
            <Heart
              style={{ width: h.size, height: h.size }}
              className="fill-[#FF4D6D]/30 text-[#FF4D6D]/30"
            />
          </motion.div>
        ))}

        <Link href="/" className="relative z-10 flex items-center gap-2 font-heading font-bold text-neutral-900 w-fit">
          <Heart className="h-5 w-5 fill-[#FF4D6D] text-[#FF4D6D]" />
          <span>LoveRecap</span>
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
          className="relative z-10"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="h-px w-8 bg-[#E89AAE]/50" />
            <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E89AAE]">
              Uma história de amor
            </span>
          </div>

          <h1 className="font-heading text-4xl font-bold text-[#2B2B2B] leading-tight mb-4">
            Sua história de amor<br />
            <span className="text-[#FF4D6D]">merece ser contada.</span>
          </h1>
          <p className="text-[#6B6B6B] text-base leading-relaxed max-w-sm">
            Crie um retrospecto visual incrível da sua história. Memórias, momentos e sentimentos em um só lugar.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.7 }}
          className="relative z-10 space-y-4"
        >
          {testimonials.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 + i * 0.12, duration: 0.5 }}
              className="flex items-start gap-3 bg-white/50 backdrop-blur-sm rounded-xl p-4 border border-white/60"
            >
              <Heart className="h-4 w-4 fill-[#FF4D6D] text-[#FF4D6D] shrink-0 mt-0.5" />
              <div>
                <p className="text-sm text-[#2B2B2B] leading-relaxed">"{t.quote}"</p>
                <p className="text-xs text-[#E89AAE] font-semibold mt-1">
                  {t.author} · {t.time}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <div className="flex-1 flex flex-col min-h-screen bg-white">
        
        <div className="flex lg:hidden items-center justify-center pt-8 pb-2">
          <Link href="/" className="flex items-center gap-2 font-heading font-bold text-neutral-900">
            <Heart className="h-5 w-5 fill-[#FF4D6D] text-[#FF4D6D]" />
            <span>LoveRecap</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          {children}
        </div>

        <p className="text-center text-[10px] text-neutral-300 tracking-widest uppercase pb-6">
          Feito com amor ♥ LoveRecap
        </p>
      </div>
    </div>
  )
}
