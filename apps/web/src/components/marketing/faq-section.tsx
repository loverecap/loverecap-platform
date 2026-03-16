'use client'

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion'
import { PageContainer } from '@/components/shared/page-container'
import { SectionContainer } from '@/components/shared/section-container'

const faqs = [
  {
    question: 'O que é o LoveRecap?',
    answer:
      'O LoveRecap é uma plataforma que permite criar uma página bonita sobre a história do seu relacionamento. Você preenche sua história, envia fotos e recebe um link exclusivo para compartilhar.',
  },
  {
    question: 'Quanto tempo leva para criar?',
    answer:
      'A maioria das pessoas termina em menos de 10 minutos. Você preenche algumas informações, adiciona memórias, envia algumas fotos e escreve uma mensagem final. Só isso.',
  },
  {
    question: 'É uma assinatura?',
    answer:
      'Não. O LoveRecap é um pagamento único de R$9,99. Você paga uma vez e sua página fica online para sempre.',
  },
  {
    question: 'Posso editar minha história depois de publicar?',
    answer:
      'No lançamento, a história fica bloqueada após a publicação. A edição será suportada em uma atualização futura. Recomendamos revisar sua história com cuidado antes de pagar.',
  },
  {
    question: 'Quem pode ver minha história?',
    answer:
      'Qualquer pessoa com o link pode visualizar sua história. A URL é exclusiva e não está listada em lugar algum publicamente, então é efetivamente privada, a menos que você a compartilhe.',
  },
  {
    question: 'Quais formas de pagamento são aceitas?',
    answer: 'Aceitamos todos os principais cartões de crédito/débito e Pix via Mercado Pago.',
  },
]

export function FaqSection() {
  return (
    <SectionContainer id="faq">
      <PageContainer>
        <div className="text-center mb-12">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF4D6D] mb-3">FAQ</p>
          <h2 className="font-heading text-3xl font-bold text-neutral-900 sm:text-4xl">
            Perguntas frequentes
          </h2>
        </div>

        <div className="mx-auto max-w-2xl">
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`item-${i}`}>
                <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                <AccordionContent>{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </PageContainer>
    </SectionContainer>
  )
}
