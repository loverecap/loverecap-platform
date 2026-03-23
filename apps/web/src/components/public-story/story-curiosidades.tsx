'use client'

import { useMemo } from 'react'
import { motion } from 'framer-motion'

interface StoryCuriosidadesProps {
  startDate: string
  name1: string
  name2: string
}

function formatLarge(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1).replace('.', ',')} mi`
  if (n >= 1_000) return n.toLocaleString('pt-BR')
  return String(n)
}

export function StoryCuriosidades({ startDate, name1, name2 }: StoryCuriosidadesProps) {
  const facts = useMemo(() => {
    const diffMs = Math.max(0, Date.now() - new Date(startDate).getTime())
    const days = Math.floor(diffMs / 86_400_000)
    const weeks = Math.floor(days / 7)

    return [
      {
        icon: '☀️',
        value: formatLarge(days),
        label: 'manhãs acordaram juntos',
        sublabel: 'pelo menos é o que a gente imagina',
      },
      {
        icon: '🍽️',
        value: formatLarge(Math.floor(days * 2.1)),
        label: 'refeições compartilhadas',
        sublabel: 'cada uma com uma história própria',
      },
      {
        icon: '💬',
        value: formatLarge(weeks * 7 * 24),
        label: '"eu te amo" ditos',
        sublabel: `considerando que ${name1.split(' ')[0]} é bem carinhoso(a)`,
      },
      {
        icon: '🌙',
        value: formatLarge(Math.floor(days * 0.92)),
        label: 'noites ao lado um do outro',
        sublabel: 'excluindo viagens e chateações passageiras',
      },
    ]
  }, [startDate, name1])

  return (
    <section
      className="px-5 py-16"
      style={{ background: 'linear-gradient(180deg, #FFF8F2 0%, #F9EEF4 50%, #FFF8F2 100%)' }}
    >
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-center mb-10"
      >
        <p className="text-[10px] font-semibold uppercase tracking-[0.22em] text-[#E89AAE] mb-2">
          Vocês em números
        </p>
        <h2 className="font-story text-2xl font-bold text-[#2B2B2B] leading-snug">
          {name1.split(' ')[0]} & {name2.split(' ')[0]}, por dentro
        </h2>
      </motion.div>

      <div className="grid grid-cols-2 gap-3 max-w-sm mx-auto">
        {facts.map((fact, i) => (
          <motion.div
            key={fact.label}
            initial={{ opacity: 0, y: 20, scale: 0.94 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45, delay: i * 0.08, ease: 'easeOut' }}
            className="rounded-2xl p-4 flex flex-col gap-1"
            style={{
              background: 'rgba(255,255,255,0.88)',
              boxShadow: '0 2px 16px rgba(255,77,109,0.08), 0 1px 4px rgba(0,0,0,0.05)',
              backdropFilter: 'blur(8px)',
            }}
          >
            <span className="text-xl mb-0.5">{fact.icon}</span>
            <span
              className="font-story text-xl font-bold leading-none"
              style={{ color: '#FF4D6D' }}
            >
              {fact.value}
            </span>
            <span className="text-[11px] font-semibold text-[#2B2B2B] leading-snug">
              {fact.label}
            </span>
            <span className="text-[10px] text-[#B8909E] leading-snug mt-0.5">
              {fact.sublabel}
            </span>
          </motion.div>
        ))}
      </div>

      <motion.p
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="text-center text-[10px] text-[#C4A0B0] mt-6"
      >
        Estimativas carinhosas — os números reais estão no coração de vocês 🩷
      </motion.p>
    </section>
  )
}
