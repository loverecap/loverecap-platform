import type { Metadata } from 'next'
import Link from 'next/link'
import { ArrowRight, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { PageContainer } from '@/components/shared/page-container'
import { SectionContainer } from '@/components/shared/section-container'

export const metadata: Metadata = {
  title: 'Exemplo de história',
  description: 'Veja como fica uma história no LoveRecap antes de criar a sua.',
}

const exampleMemories = [
  { emoji: '☕', title: 'Primeiro café juntos', date: 'Junho de 2019', description: 'Nos conhecemos naquele café pequeno perto da universidade. Você estava lendo um livro que eu acabara de terminar.' },
  { emoji: '✈️', title: 'Viagem a Lisboa', date: 'Dezembro de 2020', description: 'Nossa primeira viagem juntos. Nos perdemos em Alfama e não ligamos nem um pouco.' },
  { emoji: '🐶', title: 'Adotamos a Luna', date: 'Maio de 2021', description: 'O dia em que viramos uma família de três.' },
  { emoji: '🏠', title: 'Moramos juntos', date: 'Março de 2022', description: 'Nosso primeiro apartamento. Era pequenininho e perfeito.' },
  { emoji: '💍', title: 'O pedido', date: 'Junho de 2024', description: 'No mesmo café do nosso primeiro encontro. Você disse sim antes de eu terminar a pergunta.' },
]

export default function ExamplePage() {
  return (
    <>
      <SectionContainer className="bg-gradient-to-br from-[#FFF0F3] to-white">
        <PageContainer>
          <div className="text-center">
            <Badge className="mb-4">Exemplo</Badge>
            <h1 className="font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">
              É assim que fica o seu LoveRecap
            </h1>
            <p className="mt-3 text-neutral-500 max-w-md mx-auto">
              Um exemplo real mostrando o tipo de página que você pode criar.
            </p>
          </div>
        </PageContainer>
      </SectionContainer>

      <SectionContainer>
        <PageContainer>
          <div className="mx-auto max-w-md">
            <div className="rounded-2xl border border-neutral-200 bg-white shadow-xl overflow-hidden">
              <div className="bg-gradient-to-br from-[#FF4D6D] to-[#FF6B8A] px-6 py-10 text-white text-center">
                <div className="flex items-center justify-center gap-2 mb-2">
                  <Heart className="h-6 w-6 fill-white" />
                  <span className="font-heading text-2xl font-bold">Ana & Pedro</span>
                </div>
                <p className="text-white/80">Juntos desde 12 de junho de 2019</p>
                <p className="mt-1 text-sm text-white/60">5 anos e contando</p>
              </div>

              <div className="p-6 space-y-4">
                <h2 className="font-heading text-sm font-semibold uppercase tracking-widest text-neutral-400">
                  Nossa história
                </h2>
                {exampleMemories.map((memory, i) => (
                  <div key={i} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF0F3] text-lg shrink-0">
                        {memory.emoji}
                      </div>
                      {i < exampleMemories.length - 1 && (
                        <div className="mt-2 flex-1 w-px bg-neutral-200 min-h-[24px]" />
                      )}
                    </div>
                    <div className="pb-4">
                      <div className="flex items-center gap-2 mb-0.5">
                        <p className="text-sm font-semibold text-neutral-900">{memory.title}</p>
                        <span className="text-xs text-neutral-400">{memory.date}</span>
                      </div>
                      <p className="text-sm text-neutral-500 leading-relaxed">{memory.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t border-neutral-100 bg-[#FFF0F3] p-6 text-center">
                <p className="text-sm text-neutral-700 italic leading-relaxed">
                  "Cada dia com você parece o começo de algo lindo. Obrigado por me escolher todos os dias."
                </p>
                <p className="mt-2 text-xs text-neutral-400">— Pedro</p>
              </div>
            </div>

            <div className="mt-8 text-center">
              <p className="text-sm text-neutral-500 mb-4">Pronto para criar o seu?</p>
              <Button asChild size="lg">
                <Link href="/create">
                  Criar meu LoveRecap
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>
        </PageContainer>
      </SectionContainer>
    </>
  )
}
