import Link from 'next/link'
import { Heart } from 'lucide-react'
import { PageContainer } from '@/components/shared/page-container'
import { Separator } from '@/components/ui/separator'

const links = {
  product: [
    { label: 'Exemplo', href: '/example' },
    { label: 'Preços', href: '/pricing' },
    { label: 'FAQ', href: '/faq' },
  ],
  legal: [
    { label: 'Política de Privacidade', href: '/privacy-policy' },
    { label: 'Termos de Uso', href: '/terms' },
  ],
}

export function Footer() {
  return (
    <footer className="bg-neutral-900 text-neutral-400">
      <PageContainer>
        <div className="py-12 grid gap-8 sm:grid-cols-3">
          <div>
            <Link href="/" className="flex items-center gap-2 text-white font-heading font-bold mb-3">
              <Heart className="h-4 w-4 fill-[#FF4D6D] text-[#FF4D6D]" />
              LoveRecap
            </Link>
            <p className="text-sm leading-relaxed">
              Transforme a história do seu relacionamento em uma memória linda para compartilhar.
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">
              Produto
            </p>
            <ul className="space-y-2">
              {links.product.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-neutral-500 mb-4">
              Legal
            </p>
            <ul className="space-y-2">
              {links.legal.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <Separator className="bg-neutral-800" />

        <div className="py-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between text-xs">
          <p suppressHydrationWarning>© {new Date().getFullYear()} LoveRecap. Todos os direitos reservados.</p>
          <p className="flex items-center gap-1">
            Feito com <Heart className="h-3 w-3 fill-[#FF4D6D] text-[#FF4D6D]" /> para casais
          </p>
        </div>
      </PageContainer>
    </footer>
  )
}
