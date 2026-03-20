import { Resend } from 'resend'
import { env } from './env'

const FROM = 'LoveRecap <no-reply@loverecap.app>'

function getClient(): Resend | null {
  const key = env.resendApiKey()
  if (!key) return null
  return new Resend(key)
}

function warnMissing(fn: string) {
  console.warn(`[email] RESEND_API_KEY not configured — skipping ${fn}`)
}

export async function sendStoryReadyEmail({
  to,
  partnerName1,
  partnerName2,
  slug,
}: {
  to: string
  partnerName1: string
  partnerName2: string
  slug: string
}) {
  const client = getClient()
  if (!client) { warnMissing('sendStoryReadyEmail'); return }

  const storyUrl = `${env.appUrl()}/s/${slug}`

  await client.emails.send({
    from: FROM,
    to,
    subject: `${partnerName1} & ${partnerName2} — Sua história está no ar! 💌`,
    html: storyReadyHtml({ partnerName1, partnerName2, storyUrl }),
  })
}

export async function sendAccountSetupEmail({
  to,
  partnerName1,
  partnerName2,
  slug,
  setPasswordUrl,
}: {
  to: string
  partnerName1: string
  partnerName2: string
  slug: string
  setPasswordUrl: string
}) {
  const client = getClient()
  if (!client) { warnMissing('sendAccountSetupEmail'); return }

  const storyUrl = `${env.appUrl()}/s/${slug}`

  await client.emails.send({
    from: FROM,
    to,
    subject: `${partnerName1} & ${partnerName2} — Sua história está no ar! 💌`,
    html: `
      <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a1a1a;">
        <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">
          Sua história está no ar! 🎉
        </h1>
        <p style="color: #555; margin-bottom: 24px;">
          A história de <strong>${partnerName1} &amp; ${partnerName2}</strong> foi publicada com sucesso.
          Compartilhe o link abaixo com quem você ama.
        </p>
        <a
          href="${storyUrl}"
          style="display:inline-block;background:#e11d48;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;"
        >
          Ver minha história
        </a>
        <p style="margin-top: 12px; font-size: 13px; color: #999;">
          Ou copie o link: ${storyUrl}
        </p>

        <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />

        <h2 style="font-size: 17px; font-weight: 600; margin-bottom: 8px;">
          Acesse sua conta
        </h2>
        <p style="color: #555; margin-bottom: 20px; font-size: 14px;">
          Crie uma senha para acessar sua conta futuramente e sempre encontrar sua história.
        </p>
        <a
          href="${setPasswordUrl}"
          style="display:inline-block;background:#1a1a1a;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px;"
        >
          Criar minha senha
        </a>
        <p style="margin-top: 12px; font-size: 12px; color: #bbb;">
          Este link expira em 24 horas.
        </p>

        <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
        <p style="font-size: 12px; color: #bbb;">
          LoveRecap — Transformando histórias de amor em memórias eternas.
        </p>
      </div>
    `,
  })
}

function storyReadyHtml({
  partnerName1,
  partnerName2,
  storyUrl,
}: {
  partnerName1: string
  partnerName2: string
  storyUrl: string
}) {
  return `
    <div style="font-family: sans-serif; max-width: 520px; margin: 0 auto; color: #1a1a1a;">
      <h1 style="font-size: 22px; font-weight: 700; margin-bottom: 8px;">
        Sua história está no ar! 🎉
      </h1>
      <p style="color: #555; margin-bottom: 24px;">
        A história de <strong>${partnerName1} &amp; ${partnerName2}</strong> foi publicada com sucesso.
        Compartilhe o link abaixo com quem você ama.
      </p>
      <a
        href="${storyUrl}"
        style="display:inline-block;background:#e11d48;color:#fff;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;"
      >
        Ver minha história
      </a>
      <p style="margin-top: 24px; font-size: 13px; color: #999;">
        Ou copie o link: ${storyUrl}
      </p>
      <hr style="border:none;border-top:1px solid #eee;margin:32px 0;" />
      <p style="font-size: 12px; color: #bbb;">
        LoveRecap — Transformando histórias de amor em memórias eternas.
      </p>
    </div>
  `
}
