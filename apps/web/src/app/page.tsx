import type { Metadata } from 'next'
import { Nav } from '@/components/shared/nav'
import { Footer } from '@/components/marketing/footer'
import { Hero } from '@/components/marketing/hero'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { Benefits } from '@/components/marketing/benefits'
import { PricingSection } from '@/components/marketing/pricing-section'
import { FaqSection } from '@/components/marketing/faq-section'

export const metadata: Metadata = {
  title: 'LoveRecap — Transforme sua história de amor em uma memória linda',
  description:
    'Crie um retrospecto visual incrível da sua história de amor. Preencha sua história, envie fotos e compartilhe com quem você ama. Pagamento único. Seu para sempre.',
  openGraph: {
    title: 'LoveRecap — Transforme sua história de amor em uma memória linda',
    description:
      'Crie um retrospecto visual da sua história de amor. Preencha sua história, envie fotos e compartilhe.',
    type: 'website',
  },
}

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <HowItWorks />
        <Benefits />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  )
}
