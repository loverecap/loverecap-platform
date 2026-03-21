import type { Metadata } from 'next'
import { Nav } from '@/components/shared/nav'
import { Footer } from '@/components/marketing/footer'
import { Hero } from '@/components/marketing/hero'
import { SocialProofBar } from '@/components/marketing/social-proof-bar'
import { HowItWorks } from '@/components/marketing/how-it-works'
import { Testimonials } from '@/components/marketing/testimonials'
import { PricingSection } from '@/components/marketing/pricing-section'
import { FaqSection } from '@/components/marketing/faq-section'

const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://loverecap.app'

export const metadata: Metadata = {
  title: {
    absolute: 'LoveRecap — Transforme sua história de amor em uma memória linda',
  },
  description:
    'Crie um retrospecto visual da sua história de amor. Adicione memórias, fotos e uma mensagem especial. Compartilhe com quem você ama. Pagamento único, fica online para sempre.',
  alternates: {
    canonical: APP_URL,
  },
  openGraph: {
    title: 'LoveRecap — Transforme sua história de amor em uma memória linda',
    description:
      'Crie um retrospecto visual da sua história de amor. Adicione memórias, fotos e uma mensagem especial. Compartilhe com quem você ama.',
    url: APP_URL,
    type: 'website',
  },
  twitter: {
    title: 'LoveRecap — Transforme sua história de amor em uma memória linda',
    description:
      'Crie um retrospecto visual da sua história de amor. Adicione memórias, fotos e uma mensagem especial.',
  },
}

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'LoveRecap',
  url: APP_URL,
  logo: `${APP_URL}/icon.png`,
  description:
    'Plataforma para criar retróspecos visuais de histórias de amor. Adicione memórias, fotos e mensagens especiais.',
  sameAs: [`${APP_URL}`],
}

export default function HomePage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <Nav />
      <main>
        <Hero />
        <SocialProofBar />
        <HowItWorks />
        <Testimonials />
        <PricingSection />
        <FaqSection />
      </main>
      <Footer />
    </>
  )
}
