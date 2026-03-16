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
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">1. Aceitação dos termos</h2>
              <p>Ao acessar ou utilizar o LoveRecap, você concorda com estes Termos de Uso. Se não concordar com algum ponto, não utilize o serviço.</p>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">2. O serviço</h2>
              <p>O LoveRecap é uma plataforma que permite criar páginas visuais personalizadas para contar a história de um relacionamento. O serviço inclui: construtor de história em etapas, armazenamento de memórias e fotos, personalização com música e mensagem final, e publicação em uma URL exclusiva e permanente.</p>
              <p className="mt-2">Reservamo-nos o direito de modificar, suspender ou encerrar o serviço mediante aviso prévio razoável.</p>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">3. Conta e acesso</h2>
              <p>Você pode iniciar a criação da sua história sem conta prévia. Ao concluir o pagamento, uma conta é criada automaticamente com o e-mail informado no checkout. Você é responsável pela segurança da sua conta e por manter suas credenciais em sigilo.</p>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">4. Conteúdo enviado</h2>
              <p>Você é o único responsável pelo conteúdo que enviar — textos, fotos, memórias e mensagens. É expressamente proibido enviar conteúdo que:</p>
              <ul className="mt-2 space-y-1 list-disc list-inside text-neutral-500">
                <li>Seja ilegal, ofensivo, discriminatório ou prejudicial</li>
                <li>Infrinja direitos autorais, de imagem ou privacidade de terceiros</li>
                <li>Contenha dados de menores de 18 anos sem consentimento do responsável</li>
              </ul>
              <p className="mt-2">Reservamo-nos o direito de remover conteúdo que viole estes termos sem aviso prévio.</p>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">5. Pagamento</h2>
              <p>O LoveRecap é um serviço de pagamento único no valor de R$9,99, sem assinaturas ou cobranças recorrentes. O pagamento é processado via PIX através da plataforma AbacatePay.</p>
              <p className="mt-2">Após a confirmação do pagamento e publicação da história, o valor não é reembolsável, salvo em casos de falha técnica comprovada que impeça a entrega do serviço. Para solicitar reembolso nessas situações, entre em contato pelo e-mail abaixo em até 7 dias.</p>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">6. Disponibilidade da página</h2>
              <p>As páginas de história publicadas ficam disponíveis enquanto o serviço LoveRecap estiver ativo. Empenhamo-nos em manter as páginas online de forma permanente, mas não garantimos disponibilidade ininterrupta. Em caso de encerramento do serviço, avisaremos com antecedência mínima de 30 dias.</p>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">7. Limitação de responsabilidade</h2>
              <p>O LoveRecap é fornecido "no estado em que se encontra". Não nos responsabilizamos por perdas de dados decorrentes de falhas técnicas, uso indevido da plataforma ou eventos fora do nosso controle.</p>
            </div>

            <div>
              <h2 className="font-heading text-lg font-semibold text-neutral-900 mb-2">8. Contato</h2>
              <p>Dúvidas ou solicitações? Entre em contato pelo e-mail <a href="mailto:hello@loverecap.app" className="text-[#FF4D6D] hover:underline">hello@loverecap.app</a>.</p>
            </div>
          </div>
        </div>
      </PageContainer>
    </SectionContainer>
  )
}
