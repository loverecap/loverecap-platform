import Groq from 'groq-sdk'
import { z } from 'zod'
import { NextRequest, NextResponse } from 'next/server'
import { createRouteHandlerClient } from '@/lib/supabase/server'
import { requireUser } from '@/lib/auth'
import { rateLimit } from '@/lib/rate-limit'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

// Sanitize a free-text string: strip newlines and control characters that could
// be used for prompt injection, then trim to a safe maximum length.
function sanitize(value: string, maxLength: number): string {
  return value.replace(/[\r\n\t\x00-\x1F\x7F]/g, ' ').trim().slice(0, maxLength)
}

const schema = z.object({
  partnerName1: z.string().min(1).max(60),
  partnerName2: z.string().min(1).max(60),
  startDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, 'startDate deve ser YYYY-MM-DD')
    .optional(),
  memoryTitles: z.array(z.string().max(120)).max(20).optional(),
})

export async function POST(req: NextRequest) {
  // ── Auth ────────────────────────────────────────────────────────────────
  const supabase = await createRouteHandlerClient()
  const user = await requireUser(supabase).catch(() => null)
  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // ── Rate limit: 10 generations per user per hour ────────────────────────
  const rl = rateLimit(`ai:${user.id}`, 10, 60 * 60 * 1000)
  if (!rl.success) {
    return NextResponse.json(
      { error: 'Limite de gerações atingido. Tente novamente em breve.' },
      { status: 429 },
    )
  }

  try {
    const body: unknown = await req.json()
    const parsed = schema.safeParse(body)
    if (!parsed.success) {
      return NextResponse.json({ error: 'Dados inválidos', issues: parsed.error.flatten().fieldErrors }, { status: 400 })
    }

    // Sanitize all string inputs before inserting into the prompt
    const partnerName1 = sanitize(parsed.data.partnerName1, 60)
    const partnerName2 = sanitize(parsed.data.partnerName2, 60)
    const startDate = parsed.data.startDate
    const memoryTitles = parsed.data.memoryTitles?.map((t) => sanitize(t, 120))

    const memoriesContext = memoryTitles?.length
      ? `Momentos vividos juntos: ${memoryTitles.join(', ')}.`
      : ''

    const prompt = `Você é um escritor especializado em mensagens românticas e íntimas.
Escreva uma mensagem final tocante, em português brasileiro, para fechar uma página de história de amor.

Contexto:
- Casal: ${partnerName1} e ${partnerName2}
${startDate ? `- Juntos desde: ${startDate}` : ''}
${memoriesContext}

Regras:
- Entre 80 e 150 palavras (máximo 1000 caracteres)
- Tom íntimo, caloroso e direto ao coração — humano, não artificial
- Mencione os nomes ${partnerName1} e ${partnerName2} de forma natural
- Foque exclusivamente nos sentimentos do casal e nas memórias compartilhadas
- NÃO mencione clima, estações do ano, horários, temperatura, lua, sol, estrelas ou elementos da natureza
- Evite metáforas longas ou poéticas demais — seja genuíno e simples
- Evite clichês como "cada dia ao seu lado" ou "você completa minha vida"
- Não use emojis
- Escreva como se fosse a própria pessoa escrevendo para o(a) parceiro(a)
- Não adicione saudação inicial nem assinatura final — apenas a mensagem em si
- Cada geração deve ser DIFERENTE das anteriores em estilo e abordagem`

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      max_tokens: 320,
      temperature: 0.9,
      messages: [{ role: 'user', content: prompt }],
    })

    const raw = completion.choices[0]?.message?.content?.trim() ?? ''
    if (!raw) throw new Error('Resposta vazia')
    const text = raw.slice(0, 1000)

    return NextResponse.json({ message: text })
  } catch (err) {
    const apiErr = err as { error?: { message?: string }; status?: number }
    console.error('[AI generate-message]', apiErr?.error ?? err)
    return NextResponse.json(
      { error: apiErr?.error?.message ?? 'Erro ao gerar mensagem. Tente novamente.' },
      { status: apiErr?.status ?? 500 },
    )
  }
}
