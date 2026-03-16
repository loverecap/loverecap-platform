import type { Metadata } from 'next'
import { PricingSection } from '@/components/marketing/pricing-section'
import { FaqSection } from '@/components/marketing/faq-section'

export const metadata: Metadata = {
  title: 'Preços',
  description:
    'Preço único e simples para o LoveRecap. Sem assinatura. Pague uma vez e guarde sua história para sempre.',
  openGraph: {
    title: 'Preços — LoveRecap',
    description:
      'Preço único e simples para o LoveRecap. Sem assinatura. Pague uma vez e guarde sua história para sempre.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Preços — LoveRecap',
    description: 'Preço único e simples. Sem assinatura.',
  },
}

export default function PricingPage() {
  return (
    <>
      <PricingSection />
      <FaqSection />
    </>
  )
}
