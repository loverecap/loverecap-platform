import type { Metadata } from 'next'
import { PageContainer } from '@/components/shared/page-container'
import { SectionContainer } from '@/components/shared/section-container'

export const metadata: Metadata = {
  title: 'Termos de Uso',
}

export default function TermsPage() {
  return (
    <SectionContainer>
      <PageContainer>
        <div className="mx-auto max-w-2xl">
          <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-2">Termos de Uso</h1>
          <p className="text-sm text-neutral-400 mb-8">Última atualização: março de 2026</p>

          <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">1. Aceitação</h2>
              <p>Ao usar o LoveRecap, você concorda com estes termos. Se não concordar, não utilize o serviço.</p>
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">2. Serviço</h2>
              <p>O LoveRecap oferece uma plataforma para criar páginas de história de relacionamento personalizadas. O serviço é fornecido no estado em que se encontra. Reservamo-nos o direito de modificar ou descontinuar o serviço com aviso prévio razoável.</p>
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">3. Conteúdo</h2>
              <p>Você é responsável por todo o conteúdo que enviar. É proibido enviar conteúdo ilegal, prejudicial ou que infrinja direitos de terceiros. Reservamo-nos o direito de remover conteúdo que viole estes termos.</p>
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">4. Pagamento</h2>
              <p>O LoveRecap é um pagamento único. Após a publicação da sua história, o pagamento não é reembolsável. Os pagamentos são processados com segurança via Mercado Pago.</p>
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">5. Contato</h2>
              <p>Dúvidas? Entre em contato pelo e-mail hello@loverecap.app.</p>
            </div>
          </div>
        </div>
      </PageContainer>
    </SectionContainer>
  )
}
