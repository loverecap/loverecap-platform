/**
 * AbacatePay PIX integration — server-side only.
 * Never import this module from client components.
 *
 * Docs: https://abacatepay.com/docs
 */

const BASE_URL = 'https://api.abacatepay.com'

export type PixStatus = 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED'

export interface CreatePixParams {
  /** Amount in cents (e.g. 999 = R$ 9,99) */
  amount: number
  /** Seconds until expiry — default 3600 (1 hour) */
  expiresIn?: number
  description: string
  customer: {
    name: string
    email: string
    cellphone: string
    /** CPF: 123.456.789-01 */
    taxId: string
  }
  metadata?: Record<string, string>
}

export interface PixCharge {
  id: string
  /** Raw PIX copia-e-cola string */
  brCode: string
  /** Base64-encoded QR code image */
  brCodeBase64: string
  expiresAt: string
  status: PixStatus
}

export async function createPixCharge(
  apiKey: string,
  params: CreatePixParams,
): Promise<PixCharge> {
  const res = await fetch(`${BASE_URL}/v1/pixQrCode/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      amount: params.amount,
      expiresIn: params.expiresIn ?? 3600,
      description: params.description,
      customer: params.customer,
      metadata: params.metadata ?? {},
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`AbacatePay error ${res.status}: ${text}`)
  }

  const json = await res.json() as { data: PixCharge }
  return json.data
}

export async function checkPixStatus(
  apiKey: string,
  pixId: string,
): Promise<PixStatus> {
  const url = new URL(`${BASE_URL}/v1/pixQrCode/check`)
  url.searchParams.set('id', pixId)

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${apiKey}` },
    // Never cache status checks
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`AbacatePay check error ${res.status}`)
  }

  const json = await res.json() as { data: { status: PixStatus } }
  return json.data.status
}
