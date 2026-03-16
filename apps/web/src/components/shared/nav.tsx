import Link from 'next/link'
import { Heart } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { PageContainer } from '@/components/shared/page-container'

export function Nav() {
  return (
    <header className="sticky top-0 z-50 border-b border-neutral-100 bg-white/90 backdrop-blur-md">
      <PageContainer>
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-heading font-bold text-neutral-900">
            <Heart className="h-5 w-5 fill-[#FF4D6D] text-[#FF4D6D]" />
            <span>LoveRecap</span>
          </Link>

          <nav className="hidden items-center gap-6 text-sm text-neutral-600 md:flex">
            <Link href="/example" className="hover:text-neutral-900 transition-colors">
              Exemplo
            </Link>
            <Link href="/pricing" className="hover:text-neutral-900 transition-colors">
              Preços
            </Link>
            <Link href="/faq" className="hover:text-neutral-900 transition-colors">
              FAQ
            </Link>
          </nav>

          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="sm" className="hidden sm:inline-flex">
              <Link href="/sign-in">Entrar</Link>
            </Button>
            <Button asChild size="sm">
              <Link href="/create">Criar o meu</Link>
            </Button>
          </div>
        </div>
      </PageContainer>
    </header>
  )
}
