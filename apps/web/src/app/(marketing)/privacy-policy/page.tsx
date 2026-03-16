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
        <div className="mx-auto max-w-2xl">
          <h1 className="font-heading text-3xl font-bold text-neutral-900 mb-2">Política de Privacidade</h1>
          <p className="text-sm text-neutral-400 mb-8">Última atualização: março de 2026</p>

          <div className="space-y-6 text-sm text-neutral-600 leading-relaxed">
            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">1. Informações que coletamos</h2>
              <p>Coletamos as informações que você fornece ao usar o LoveRecap:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside text-neutral-500">
                <li>E-mail (para criação ou vinculação de conta)</li>
                <li>Conteúdo da história: nomes do casal, datas, memórias, fotos e mensagem final</li>
                <li>Dados de cobrança PIX: CPF e celular (transmitidos ao processador de pagamento AbacatePay — não armazenamos esses dados em nossos servidores)</li>
              </ul>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">2. Como usamos as informações</h2>
              <p>Suas informações são usadas exclusivamente para operar o LoveRecap: criar e hospedar sua página de história, processar o pagamento e enviar o link da história por e-mail. Não vendemos nem compartilhamos seus dados com terceiros para fins comerciais ou de marketing.</p>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">3. Sessão anônima e criação de conta</h2>
              <p>Você pode iniciar a criação da sua história sem precisar criar uma conta antes. Ao concluir o pagamento e fornecer um e-mail, sua conta é criada automaticamente e você receberá um link para definir uma senha. Isso garante que você sempre possa acessar sua história futuramente.</p>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">4. Armazenamento de dados</h2>
              <p>Seus dados são armazenados na infraestrutura da Supabase (banco de dados PostgreSQL e armazenamento de arquivos). As fotos ficam em buckets privados e são servidas via URLs assinadas com validade limitada. As páginas de história publicadas são acessíveis publicamente apenas pela URL exclusiva do casal.</p>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">5. Serviços de terceiros</h2>
              <p>Utilizamos os seguintes serviços para operar a plataforma:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside text-neutral-500">
                <li><strong>Supabase</strong> — banco de dados, autenticação e armazenamento de arquivos</li>
                <li><strong>AbacatePay</strong> — processamento de pagamentos via PIX</li>
                <li><strong>Vercel</strong> — hospedagem da aplicação</li>
                <li><strong>Resend</strong> — envio de e-mails transacionais</li>
                <li><strong>YouTube Data API</strong> — busca de músicas (opcional)</li>
              </ul>
              <p className="mt-2">Cada serviço opera sob sua própria política de privacidade. Compartilhamos apenas os dados estritamente necessários para cada operação.</p>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">6. Seus direitos</h2>
              <p>Você pode solicitar a exclusão da sua conta e de todos os dados associados a qualquer momento. Para isso, entre em contato pelo e-mail abaixo. Atenderemos sua solicitação em até 15 dias úteis.</p>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">7. Contato</h2>
              <p>Para qualquer dúvida sobre privacidade ou solicitação de exclusão de dados, entre em contato pelo e-mail <a href="mailto:privacy@loverecap.app" className="text-[#FF4D6D] hover:underline">privacy@loverecap.app</a>.</p>
            </div>
          </div>
        </div>
      </PageContainer>
    </SectionContainer>
  )
}
