import type { Metadata } from 'next'
import { PageContainer } from '@/components/shared/page-container'
import { SectionContainer } from '@/components/shared/section-container'

export const metadata: Metadata = {
  title: 'Política de Privacidade',
}

export default function PrivacyPolicyPage() {
  return (
    <SectionContainer>
      <PageContainer>
        <div className="mx-auto max-w-2xl prose prose-neutral">
          <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-2">Política de Privacidade</h1>
          <p className="text-sm text-neutral-400 mb-8">Última atualização: março de 2026</p>

          <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">1. Informações que coletamos</h2>
              <p>Coletamos as informações que você fornece diretamente: seu endereço de e-mail (para criação de conta), o conteúdo que você adiciona à sua história (nomes, datas, memórias, fotos) e informações de pagamento (processadas com segurança pelo Mercado Pago — não armazenamos dados de cartão).</p>
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">2. Como usamos as informações</h2>
              <p>Usamos suas informações exclusivamente para operar o LoveRecap — criar e hospedar sua página de história, processar seu pagamento e enviar o link da sua história. Não vendemos nem compartilhamos seus dados com terceiros para fins de marketing.</p>
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">3. Armazenamento de dados</h2>
              <p>Seus dados são armazenados com segurança na infraestrutura da Supabase. As fotos são armazenadas em buckets privados e servidas via URLs assinadas. As páginas de história são acessíveis publicamente apenas pela URL exclusiva.</p>
            </div>
            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">4. Contato</h2>
              <p>Para qualquer dúvida sobre privacidade, entre em contato pelo e-mail privacy@loverecap.app.</p>
            </div>
          </div>
        </div>
      </PageContainer>
    </SectionContainer>
  )
}
