export const ADMIN_WALLET_ADDRESS = "UQAJKfqA1D1MDkhKpiWnQDm6oCfMLhCYNWUkTviOwKa00ZzU"

export function formatTon(amountTon: number, maxFrac = 3) {
  return amountTon.toLocaleString(undefined, {
    minimumFractionDigits: 0,
    maximumFractionDigits: maxFrac,
  })
}

// Builds a ton://transfer/<address>?amount=<TON>&text=<encoded>
export function toTonUri(address: string, amountTon: number, text?: string) {
  const base = `ton://transfer/${encodeURIComponent(address)}`
  const params = new URLSearchParams()
  if (amountTon > 0) params.set("amount", String(amountTon))
  if (text) params.set("text", text)
  const qs = params.toString()
  return qs ? `${base}?${qs}` : base
}

export function toNano(amountTon: number): string {
  return Math.floor(amountTon * 1e9).toString()
}

export function fromNano(amountNano: string | number): number {
  return Number(amountNano) / 1e9
}
