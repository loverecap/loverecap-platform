import type { Metadata } from 'next'
import Link from 'next/link'
import { Clock, Mail } from 'lucide-react'
import { Button } from '@/components/ui/button'

export const metadata: Metadata = { title: 'Pagamento pendente' }

export default function CheckoutPendingPage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-white px-4 text-center">
      <div className="mx-auto max-w-sm">
        <div className="mb-6 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-amber-50">
            <Clock className="h-10 w-10 text-amber-500" />
          </div>
        </div>

        <h1 className="font-heading text-2xl font-bold text-neutral-900 mb-2">
          Pagamento pendente
        </h1>
        <p className="text-neutral-500 mb-3">
          Seu pagamento está sendo processado. Isso geralmente leva alguns minutos.
        </p>
        <p className="text-sm text-neutral-400 mb-8">
          Após a confirmação, sua história será publicada automaticamente e você receberá um e-mail de confirmação.
        </p>

        <div className="space-y-3">
          <div className="flex items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
            <Mail className="h-4 w-4 shrink-0" />
            <span>Te avisaremos por e-mail quando sua história estiver pronta.</span>
          </div>
          <Button asChild variant="ghost" size="sm" className="w-full">
            <Link href="/">Voltar para o início</Link>
          </Button>
        </div>
      </div>
    </main>
  )
}
