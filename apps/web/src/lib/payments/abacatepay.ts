const BASE_URL = 'https://api.abacatepay.com'

export type PixStatus = 'PENDING' | 'PAID' | 'EXPIRED' | 'CANCELLED' | 'UNDER_DISPUTE' | 'REFUNDED' | 'REDEEMED' | 'APPROVED' | 'FAILED'

export interface CreatePixParams {
  amount: number
  expiresIn?: number
  description: string
  customer: {
    name: string
    email: string
    cellphone: string
    taxId: string
  }
  metadata?: Record<string, string>
}

export interface PixCharge {
  id: string
  brCode: string
  brCodeBase64: string
  expiresAt: string
  status: PixStatus
}

export async function createPixCharge(
  apiKey: string,
  params: CreatePixParams,
): Promise<PixCharge> {
  const res = await fetch(`${BASE_URL}/transparents/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      method: 'PIX',
      data: {
        amount: params.amount,
        expiresIn: params.expiresIn ?? 3600,
        description: params.description,
        customer: params.customer,
        ...(params.metadata ? { metadata: params.metadata } : {}),
      },
    }),
  })

  if (!res.ok) {
    const text = await res.text().catch(() => '')
    throw new Error(`AbacatePay error ${res.status}: ${text}`)
  }

  const json = await res.json() as PixCharge
  return json
}

export async function checkPixStatus(
  apiKey: string,
  pixId: string,
): Promise<PixStatus> {
  const url = new URL(`${BASE_URL}/transparents/check`)
  url.searchParams.set('id', pixId)

  const res = await fetch(url.toString(), {
    headers: { Authorization: `Bearer ${apiKey}` },
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`AbacatePay check error ${res.status}`)
  }

  const json = await res.json() as { data: { status: PixStatus } }
  return json.data.status
}
