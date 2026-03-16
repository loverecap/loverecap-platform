import type { Metadata } from 'next'
import { Inter, Poppins } from 'next/font/google'
import { Toaster } from '@/components/ui/sonner'
import { Providers } from '@/components/providers'
import './globals.css'

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
    'Crie um retrospecto visual incrível da sua história de amor. Compartilhe seus momentos, memórias e sentimentos com quem você ama.',
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    siteName: 'LoveRecap',
    url: APP_URL,
  },
  twitter: {
    card: 'summary_large_image',
    site: '@loverecap',
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
      </body>
    </html>
  )
}
