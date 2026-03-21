'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { PageContainer } from '@/components/shared/page-container'
import { SectionContainer } from '@/components/shared/section-container'

const chats = [
  {
    name: 'Camila & Carlos',
    time: 'Hoje',
    messages: [
      { sent: true, text: 'amor… fiz uma coisa pra você 🥹', time: '20:12', ticks: '✓✓' },
      { sent: true, text: '👉 [link do loverecap]', time: '20:12', ticks: '✓✓', link: true },
      { sent: false, text: 'amor…', time: '20:14' },
      { sent: false, text: 'eu tô chorando aqui 😭❤️', time: '20:14' },
      { sent: false, text: 'nunca recebi nada tão lindo na vida', time: '20:15' },
    ],
  },
  {
    name: 'Marina & João',
    time: 'Ontem',
    messages: [
      { sent: false, text: 'vc fez isso por mim?? 🥹', time: '22:01' },
      { sent: true, text: 'fiz sim amor, tô te amando demais', time: '22:02', ticks: '✓✓' },
      { sent: false, text: 'nossa história toda ali… eu tô sem palavra', time: '22:03' },
      { sent: false, text: 'mandei pra minha mãe ver 😭', time: '22:04' },
      { sent: true, text: '❤️❤️❤️', time: '22:04', ticks: '✓✓' },
    ],
  },
  {
    name: 'Fernanda & Rafa',
    time: 'Sáb.',
    messages: [
      { sent: true, text: 'feliz aniversário de 3 anos meu amor 🌹', time: '00:00', ticks: '✓✓' },
      { sent: true, text: 'olha o que eu fiz pra você ❤️', time: '00:00', ticks: '✓✓', link: true },
      { sent: false, text: 'RAFA', time: '00:03' },
      { sent: false, text: 'eu tô tremendo aqui 😭😭', time: '00:03' },
      { sent: false, text: 'melhor presente que já ganhei na vida inteira', time: '00:04' },
    ],
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
            Reações reais
          </p>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">
            Veja as mensagens que chegaram
          </h2>
          <p className="mt-3 mx-auto max-w-sm text-sm text-neutral-500">
            Isso é o que acontece quando alguém recebe o link do LoveRecap.
          </p>
        </motion.div>

        <div className="grid gap-5 sm:grid-cols-3">
          {chats.map((chat, i) => (
            <motion.div
              key={chat.name}
              initial={reduce ? {} : { opacity: 0, y: 28 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.1 }}
            >
              <div
                className="overflow-hidden rounded-2xl shadow-lg"
                style={{ background: '#0B141A' }}
              >
                {/* WhatsApp header */}
                <div
                  className="flex items-center gap-2.5 px-4 py-3"
                  style={{ background: '#1F2C34' }}
                >
                  <div
                    className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                    style={{ background: '#FF4D6D' }}
                  >
                    {chat.name.split(' & ')[0]?.[0]}
                  </div>
                  <div>
                    <p className="text-[12px] font-semibold text-white">{chat.name}</p>
                    <p className="text-[10px]" style={{ color: '#8696A0' }}>{chat.time}</p>
                  </div>
                  <div className="ml-auto flex gap-4">
                    <div className="h-4 w-4 rounded-full" style={{ background: '#1F2C34' }} />
                    <div className="h-4 w-4 rounded-full" style={{ background: '#1F2C34' }} />
                  </div>
                </div>

                {/* Messages */}
                <div className="space-y-1.5 px-3 py-4">
                  {chat.messages.map((msg, j) => (
                    <div
                      key={j}
                      className={`flex ${msg.sent ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className="max-w-[80%] rounded-xl px-3 py-1.5"
                        style={{
                          background: msg.sent ? '#005C4B' : '#202C33',
                          borderRadius: msg.sent
                            ? '12px 12px 2px 12px'
                            : '12px 12px 12px 2px',
                        }}
                      >
                        <p
                          className="text-[11px] leading-snug"
                          style={{
                            color: msg.link ? '#53BDEB' : '#E9EDEF',
                            textDecoration: msg.link ? 'underline' : 'none',
                          }}
                        >
                          {msg.text}
                        </p>
                        <p className="mt-0.5 text-right text-[9px]" style={{ color: '#8696A0' }}>
                          {msg.time}
                          {msg.ticks && (
                            <span className="ml-0.5" style={{ color: '#53BDEB' }}>{msg.ticks}</span>
                          )}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <p className="mt-2 text-center text-xs text-neutral-400">{chat.name.split(' & ')[0]} fez para o(a) parceiro(a)</p>
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
