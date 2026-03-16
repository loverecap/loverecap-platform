'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { Copy, Check, Loader2, QrCode, RefreshCw, CheckCircle2, AlertCircle, Zap } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { createSupabaseBrowserClient } from '@/lib/supabase/client'

type Step = 'form' | 'loading' | 'polling' | 'paid' | 'expired' | 'error'

function maskCPF(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (d.length <= 3) return d
  if (d.length <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`
  if (d.length <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`
}

function maskPhone(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 11)
  if (!d.length) return ''
  if (d.length <= 2) return `(${d}`
  if (d.length <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`
  if (d.length <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`
}

function isValidCPF(cpf: string): boolean {
  const d = cpf.replace(/\D/g, '')
  if (d.length !== 11 || /^(\d)\1{10}$/.test(d)) return false
  let sum = 0
  for (let i = 0; i < 9; i++) sum += Number(d[i]) * (10 - i)
  let r = (sum * 10) % 11
  if (r >= 10) r = 0
  if (r !== Number(d[9])) return false
  sum = 0
  for (let i = 0; i < 10; i++) sum += Number(d[i]) * (11 - i)
  r = (sum * 10) % 11
  if (r >= 10) r = 0
  return r === Number(d[10])
}

const IS_DEV = process.env.NODE_ENV === 'development' || process.env['NEXT_PUBLIC_ENABLE_DEV_TOOLS'] === 'true'

interface PixData {
  paymentId: string
  /** provider_payment_id from AbacatePay — needed for dev simulation */
  providerPaymentId: string
  qrCodeImage: string
  brCode: string
  expiresAt: string
}

interface PixPaymentProps {
  projectId: string
  onSuccess?: () => void
}

export function PixPayment({ projectId, onSuccess }: PixPaymentProps) {
  const router = useRouter()

  const [step, setStep] = useState<Step>('form')
  const [email, setEmail] = useState('')
  const [emailReadOnly, setEmailReadOnly] = useState(false)
  const [taxId, setTaxId] = useState('')
  const [cellphone, setCellphone] = useState('')
  const [pixData, setPixData] = useState<PixData | null>(null)
  const [copied, setCopied] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')
  const [timeLeft, setTimeLeft] = useState<number | null>(null)

  const pollingRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  // Auto-fill email for authenticated (non-anonymous) users
  useEffect(() => {
    const supabase = createSupabaseBrowserClient()
    void supabase.auth.getUser().then(({ data }) => {
      const userEmail = data.user?.email
      if (userEmail && !data.user?.is_anonymous) {
        setEmail(userEmail)
        setEmailReadOnly(true)
      }
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const stopIntervals = useCallback(() => {
    if (pollingRef.current) clearInterval(pollingRef.current)
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  useEffect(() => () => stopIntervals(), [stopIntervals])

  async function handleCreatePix() {
    setStep('loading')
    setErrorMsg('')

    try {
      const res = await fetch('/api/payments/pix', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project_id: projectId, email, tax_id: taxId, cellphone }),
      })

      const json = await res.json() as {
        data?: PixData
        error?: { message: string }
      }

      if (!res.ok || !json.data) {
        throw new Error(json.error?.message ?? 'Erro ao criar cobrança PIX')
      }

      setPixData(json.data)
      setStep('polling')
      startPolling(json.data.paymentId)
      startCountdown(json.data.expiresAt)
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : 'Erro inesperado. Tente novamente.')
      setStep('error')
    }
  }

  function startPolling(paymentId: string) {
    pollingRef.current = setInterval(async () => {
      try {
        const res = await fetch(`/api/payments/status?payment_id=${paymentId}`)
        const json = await res.json() as {
          data?: { status: string; slug?: string }
        }
        const status = json.data?.status

        if (status === 'PAID') {
          stopIntervals()
          setStep('paid')
          onSuccess?.()
          setTimeout(() => {
            const slug = json.data?.slug
            router.push(`/checkout/success${slug ? `?slug=${slug}` : ''}`)
          }, 2000)
        } else if (status === 'EXPIRED') {
          stopIntervals()
          setStep('expired')
        }
      } catch {
        // Transient network error — retry on next tick
      }
    }, 5000)
  }

  function startCountdown(expiresAt: string) {
    const expiresMs = new Date(expiresAt).getTime()

    const tick = () => {
      const remaining = Math.max(0, Math.floor((expiresMs - Date.now()) / 1000))
      setTimeLeft(remaining)
      if (remaining === 0) {
        stopIntervals()
        setStep('expired')
      }
    }

    tick()
    timerRef.current = setInterval(tick, 1000)
  }

  async function handleCopy() {
    if (!pixData) return
    await navigator.clipboard.writeText(pixData.brCode)
    setCopied(true)
    setTimeout(() => setCopied(false), 3000)
  }

  async function handleSimulate() {
    if (!pixData) return
    await fetch('/api/payments/dev-simulate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ provider_payment_id: pixData.providerPaymentId }),
    })
    // Polling will pick up the PAID status on the next tick
  }

  function handleRetry() {
    stopIntervals()
    setPixData(null)
    setTimeLeft(null)
    setStep('form')
    setErrorMsg('')
    if (!emailReadOnly) setEmail('')
  }

  function formatTime(seconds: number) {
    const m = Math.floor(seconds / 60)
    const s = seconds % 60
    return `${m}:${String(s).padStart(2, '0')}`
  }

  // ── Form ────────────────────────────────────────────────────────────────
  if (step === 'form' || step === 'error') {
    return (
      <div className="space-y-4">
        <p className="text-sm text-neutral-500">
          Para emitir a cobrança PIX, precisamos de algumas informações.
        </p>

        <div className="space-y-2">
          <Label htmlFor="email">E-mail</Label>
          <Input
            id="email"
            type="email"
            placeholder="seu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={254}
            readOnly={emailReadOnly}
            className={emailReadOnly ? 'bg-neutral-50 text-neutral-500' : ''}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tax_id">CPF</Label>
          <Input
            id="tax_id"
            placeholder="000.000.000-00"
            inputMode="numeric"
            value={taxId}
            onChange={(e) => setTaxId(maskCPF(e.target.value))}
            maxLength={14}
          />
          {taxId.replace(/\D/g, '').length === 11 && !isValidCPF(taxId) && (
            <p className="text-xs text-red-500">CPF inválido. Verifique os números.</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="cellphone">Celular</Label>
          <Input
            id="cellphone"
            placeholder="(11) 99999-9999"
            inputMode="numeric"
            value={cellphone}
            onChange={(e) => setCellphone(maskPhone(e.target.value))}
            maxLength={16}
          />
          {cellphone.replace(/\D/g, '').length > 0 && cellphone.replace(/\D/g, '').length < 10 && (
            <p className="text-xs text-red-500">Celular incompleto. Inclua DDD + número.</p>
          )}
        </div>

        {errorMsg && (
          <div className="flex items-start gap-2 rounded-lg bg-red-50 p-3 text-sm text-red-700">
            <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <Button
          size="lg"
          className="w-full"
          onClick={handleCreatePix}
          disabled={
            !email.includes('@') ||
            !isValidCPF(taxId) ||
            cellphone.replace(/\D/g, '').length < 10
          }
        >
          <QrCode className="h-4 w-4" />
          Gerar QR Code PIX — R$9,99
        </Button>
      </div>
    )
  }

  // ── Loading ─────────────────────────────────────────────────────────────
  if (step === 'loading') {
    return (
      <div className="flex flex-col items-center gap-3 py-10">
        <Loader2 className="h-8 w-8 animate-spin text-[#FF4D6D]" />
        <p className="text-sm text-neutral-500">Gerando QR Code...</p>
      </div>
    )
  }

  // ── QR Code (polling) ───────────────────────────────────────────────────
  if (step === 'polling' && pixData) {
    return (
      <div className="space-y-4">
        <div className="flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={pixData.qrCodeImage}
            alt="QR Code PIX"
            className="h-48 w-48 rounded-xl border border-neutral-200"
          />
        </div>

        {timeLeft !== null && (
          <p className="text-center text-sm text-neutral-500">
            Expira em{' '}
            <span className={`font-mono font-semibold ${timeLeft < 120 ? 'text-red-500' : ''}`}>
              {formatTime(timeLeft)}
            </span>
          </p>
        )}

        <div className="rounded-lg border border-neutral-200 bg-neutral-50 p-3">
          <p className="mb-1.5 text-xs font-medium text-neutral-500">Copia e cola</p>
          <p className="line-clamp-2 break-all font-mono text-xs text-neutral-700">
            {pixData.brCode}
          </p>
        </div>

        <Button variant="outline" className="w-full" onClick={handleCopy}>
          {copied ? (
            <>
              <Check className="h-4 w-4 text-green-500" />
              Copiado!
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              Copiar código PIX
            </>
          )}
        </Button>

        <div className="flex items-center gap-2 rounded-lg bg-blue-50 p-3 text-xs text-blue-700">
          <Loader2 className="h-3.5 w-3.5 animate-spin shrink-0" />
          Aguardando confirmação do pagamento...
        </div>

        {IS_DEV && (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-dashed border-yellow-400 text-yellow-700 hover:bg-yellow-50"
            onClick={handleSimulate}
          >
            <Zap className="h-3.5 w-3.5" />
            [DEV] Simular pagamento
          </Button>
        )}
      </div>
    )
  }

  // ── Paid ────────────────────────────────────────────────────────────────
  if (step === 'paid') {
    return (
      <div className="flex flex-col items-center gap-3 py-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-50">
          <CheckCircle2 className="h-8 w-8 text-green-500" />
        </div>
        <p className="font-semibold text-neutral-900">Pagamento confirmado!</p>
        <p className="text-sm text-neutral-500">Redirecionando para sua história...</p>
        <Loader2 className="h-4 w-4 animate-spin text-neutral-400" />
      </div>
    )
  }

  // ── Expired ─────────────────────────────────────────────────────────────
  if (step === 'expired') {
    return (
      <div className="space-y-4 py-4 text-center">
        <p className="text-sm text-neutral-500">O QR Code expirou. Gere um novo para continuar.</p>
        <Button variant="outline" className="w-full" onClick={handleRetry}>
          <RefreshCw className="h-4 w-4" />
          Gerar novo QR Code
        </Button>
      </div>
    )
  }

  return null
}
