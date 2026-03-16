import type { Metadata } from 'next'
import Link from 'next/link'
import { AlertCircle, ArrowLeft, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Pagamento recusado' }

export default function CheckoutErrorPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="mx-auto max-w-sm">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
        </div>

        <h1 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
          Pagamento recusado
        </h1>
        <p className="text-neutral-500 mb-2">
          Algo deu errado com o seu pagamento. Você não foi cobrado.
        </p>
        <p className="text-sm text-neutral-400 mb-8">
          Por favor, tente novamente ou use outro método de pagamento.
        </p>

        <div className="space-y-3">
          <Button asChild size="lg" className="w-full">
            <Link href="/create/review">
              <RefreshCw className="h-4 w-4" />
              Tentar novamente
            </Link>
          </Button>
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/">
              <ArrowLeft className="h-4 w-4" />
              Voltar para o início
            </Link>
          </Button>
        </div>

        <p className="mt-6 text-xs text-neutral-400">
          Precisa de ajuda? Fale conosco em hello@loverecap.app
        </p>
      </div>
    </main>
  )
}
