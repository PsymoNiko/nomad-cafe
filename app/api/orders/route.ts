import { NextRequest, NextResponse } from "next/server"
import { toTonUri } from "@/utils/ton"

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const items = Array.isArray(body?.items) ? body.items : []
    // items: [{menu_item_id, qty, price_ton}]
    const total = items.reduce((acc: number, it: { price_ton?: number; qty?: number }) => acc + (Number(it?.price_ton) || 0) * (Number(it?.qty) || 0), 0)

    // Placeholder merchant address (replace in prod)
    const recipient = "EQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA"

    const orderId = crypto.randomUUID()
    const text = `Order#${orderId}`
    const ton_uri = toTonUri(recipient, total, text)

    return NextResponse.json({
      order: { id: orderId, total_amount_ton: total },
      payment: { recipient, amount_ton: total, text, ton_uri },
    })
  } catch (e: unknown) {
    const errorMessage = e instanceof Error ? e.message : "An error occurred"
    return NextResponse.json({ error: errorMessage }, { status: 400 })
  }
}
