import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import Script from 'next/script'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/providers'
import './globals.css'

const GA_ID = 'G-BESE2YRVWJ'

const APP_URL = process.env['NEXT_PUBLIC_APP_URL'] ?? 'https://loverecap.app'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
})

const poppins = Poppins({
  variable: '--font-poppins',
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
})

export const metadata: Metadata = {
  metadataBase: new URL(APP_URL),
  title: {
    default: 'LoveRecap — Transforme sua história de amor em uma memória linda',
    template: '%s | LoveRecap',
  },
  description:
    'Crie um retrospecto visual da sua história de amor. Adicione memórias, fotos e uma mensagem especial. Compartilhe com quem você ama. Pagamento único, fica online para sempre.',
  keywords: [
    'história de amor',
    'retrospecto do casal',
    'linha do tempo do relacionamento',
    'presente romântico namorado',
    'presente romântico namorada',
    'aniversário de casal',
    'memórias do casal',
    'página de amor personalizada',
    'LoveRecap',
  ],
  authors: [{ name: 'LoveRecap', url: APP_URL }],
  creator: 'LoveRecap',
  publisher: 'LoveRecap',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'LoveRecap',
    url: APP_URL,
    title: 'LoveRecap — Transforme sua história de amor em uma memória linda',
    description:
      'Crie um retrospecto visual da sua história de amor. Adicione memórias, fotos e uma mensagem especial. Pagamento único, fica online para sempre.',
  },
  twitter: {
    card: 'summary_large_image',
    site: '@loverecap',
    creator: '@loverecap',
    title: 'LoveRecap — Transforme sua história de amor em uma memória linda',
    description:
      'Crie um retrospecto visual da sua história de amor. Adicione memórias, fotos e uma mensagem especial.',
  },
  alternates: {
    canonical: APP_URL,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>
          {children}
          <Toaster />
        </Providers>
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
          strategy="afterInteractive"
        />
        <Script id="ga-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_ID}');
          `}
        </Script>
      </body>
    </html>
  )
}
