import type { Metadata } from 'next'
import Link from 'next/link'
import { CheckCircle2, Share2, Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Pagamento confirmado' }

interface CheckoutSuccessPageProps {
  searchParams: Promise<{ slug?: string }>
}

export default async function CheckoutSuccessPage({ searchParams }: CheckoutSuccessPageProps) {
  const { slug } = await searchParams
  const storyHref = slug ? `/story/${slug}` : '/'

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="mx-auto max-w-sm">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-green-50">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>
        </div>

        <h1 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
          Sua história está no ar!
        </h1>
        <p className="text-neutral-500 mb-8">
          Sua página LoveRecap foi publicada. Compartilhe o link com quem você ama.
        </p>

        <div className="space-y-3">
          <Button asChild size="lg" className="w-full">
            <Link href={storyHref}>
              <Share2 className="h-4 w-4" />
              Ver minha história
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/">
              <Heart className="h-4 w-4" />
              Voltar para o início
            </Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-neutral-400">
          Você receberá um e-mail de confirmação com o link da sua história.
        </p>
      </div>
    </main>
  )
}
