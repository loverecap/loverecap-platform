import type { Metadata } from 'next'
import { Playfair_Display } from 'next/font/google'
import { StoryExperience } from '@/components/public-story/story-experience'

export const metadata: Metadata = {
  title: 'Exemplo real — LoveRecap',
  description: 'Veja o produto completo: a experiência que seu parceiro vai receber ao abrir o link.',
}

const playfair = Playfair_Display({
  variable: '--font-playfair',
  subsets: ['latin'],
  display: 'swap',
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
})

// Rich demo data — shows off all sections of the real story experience
const DEMO_MEMORIES = [
  {
    id: 'demo-1',
    title: 'Primeiro café juntos',
    short_description: 'Onde tudo começou',
    description: 'Nos conhecemos naquele café pequenininho perto da universidade. Você estava lendo um livro que eu acabara de terminar. Pensei: "não pode ser coincidência."',
    occurred_at: '2019-06-12',
    emoji: '☕',
    position: 0,
  },
  {
    id: 'demo-2',
    title: 'Viagem a Lisboa',
    short_description: 'Perdidos e felizes em Alfama',
    description: 'Nossa primeira viagem juntos. Nos perdemos completamente em Alfama e não ligamos nem um pouco. Cada rua errada virou uma história nova.',
    occurred_at: '2020-12-20',
    emoji: '✈️',
    position: 1,
  },
  {
    id: 'demo-3',
    title: 'Adotamos a Luna',
    short_description: 'O dia que viramos família',
    description: 'Entramos na ONG pra só dar uma olhada. Saímos com a Luna no colo e o coração cheio. Ela nos escolheu antes de a gente escolher ela.',
    occurred_at: '2021-05-08',
    emoji: '🐶',
    position: 2,
  },
  {
    id: 'demo-4',
    title: 'Nosso primeiro apartamento',
    short_description: 'Pequenininho e perfeito',
    description: 'Era o apartamento mais apertado do mundo. A cama tomava metade do quarto. E mesmo assim, era o lugar mais gostoso de estar.',
    occurred_at: '2022-03-15',
    emoji: '🏠',
    position: 3,
  },
  {
    id: 'demo-5',
    title: 'O pedido',
    short_description: 'Você disse sim antes de eu terminar a frase',
    description: 'Voltamos ao mesmo café do nosso primeiro encontro. Você percebeu o que ia acontecer antes de eu abrir a caixa. E disse sim antes de eu terminar a pergunta.',
    occurred_at: '2024-06-12',
    emoji: '💍',
    position: 4,
  },
]

const DEMO_FINAL_MESSAGE = 'Cada dia com você parece o começo de algo lindo. Você transformou lugares comuns em lugares especiais, silêncios em conversas que eu nunca quero terminar. Obrigado por me escolher todos os dias — e por me deixar te escolher também. Essa história ainda tem muitos capítulos pela frente, e eu quero escrever cada um deles ao seu lado.'

export default function ExamplePage() {
  return (
    // Apply the Playfair Display font variable — same as the real /s/ layout
    <div className={playfair.variable}>
      <StoryExperience
        partnerName1="Ana"
        partnerName2="Pedro"
        startDate="2019-06-12"
        memories={DEMO_MEMORIES}
        assetsByMemoryId={{}}
        projectAssets={[]}
        coverUrl={null}
        finalMessage={DEMO_FINAL_MESSAGE}
        authorName="Pedro"
        shareUrl=""
        shareTitle=""
        music={null}
        hiddenSurprises={[]}
        futureMessage={null}
      />
    </div>
  )
}
