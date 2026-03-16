import type { Metadata } from 'next'
import { FaqSection } from '@/components/marketing/faq-section'

export const metadata: Metadata = {
  title: 'FAQ',
  description:
    'Perguntas frequentes sobre o LoveRecap — como funciona, o que você recebe e como compartilhar sua história.',
  openGraph: {
    title: 'FAQ — LoveRecap',
    description: 'Perguntas frequentes sobre o LoveRecap.',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: 'FAQ — LoveRecap',
    description: 'Perguntas frequentes sobre o LoveRecap.',
  },
}

export default function FaqPage() {
  return <FaqSection />
}
