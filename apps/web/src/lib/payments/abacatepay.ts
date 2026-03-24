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
  const body = {
    amount: params.amount,
    expiresIn: params.expiresIn ?? 3600,
    description: params.description,
    customer: params.customer,
  }

  const res = await fetch(`${BASE_URL}/v1/pixQrCode/create`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify(body),
  })

  const rawText = await res.text()

  if (!res.ok) {
    throw new Error(`AbacatePay error ${res.status}: ${rawText}`)
  }

  const json = JSON.parse(rawText) as { data: PixCharge }
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
    cache: 'no-store',
  })

  if (!res.ok) {
    throw new Error(`AbacatePay check error ${res.status}`)
  }

  const json = await res.json() as { data: { status: PixStatus } }
  return json.data.status
}
