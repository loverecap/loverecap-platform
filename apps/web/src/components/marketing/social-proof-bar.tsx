'use client'

const quotes = [
  { text: '"Meu namorado chorou de felicidade 😭"', name: 'Camila, SP' },
  { text: '"O melhor presente que já dei na vida 💕"', name: 'Fernanda, RJ' },
  { text: '"Ela ficou sem palavras quando abriu 🥹"', name: 'Ricardo, MG' },
  { text: '"Fiz de surpresa no aniversário de namoro ❤️"', name: 'Juliana, RS' },
  { text: '"Valeu muito mais do que R$9,99"', name: 'Mariana, BA' },
  { text: '"Enviamos o link para toda a família ver 🥰"', name: 'Amanda, PE' },
  { text: '"Minha namorada salvou nos favoritos 😍"', name: 'Bruno, PR' },
]

export function SocialProofBar() {
  return (
    <div className="overflow-hidden border-y border-[#F7E3EB] bg-[#FFF0F3] py-3.5">
      <style>{`
        @keyframes lr-marquee {
          0%   { transform: translateX(0) }
          100% { transform: translateX(-50%) }
        }
        .lr-marquee {
          animation: lr-marquee 30s linear infinite;
          display: inline-flex;
          white-space: nowrap;
        }
        @media (prefers-reduced-motion: reduce) {
          .lr-marquee { animation-play-state: paused; }
        }
      `}</style>

      <div className="lr-marquee">
        {[...quotes, ...quotes].map((q, i) => (
          <span key={i} className="inline-flex shrink-0 items-center gap-3 px-6">
            <span className="text-[13px] text-neutral-600">{q.text}</span>
            <span className="text-[11px] text-neutral-400">— {q.name}</span>
            <span className="text-[#FFB0C8]" aria-hidden="true">♥</span>
          </span>
        ))}
      </div>
    </div>
  )
}
