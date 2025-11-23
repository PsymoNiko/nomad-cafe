"use client"

import * as React from "react"
import { useCart } from "./cart-context"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter, SheetDescription } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import QRCode from "react-qr-code"
import { formatTon } from "@/utils/ton"
import { useTonConnectUI, useTonWallet, useTonAddress } from "@tonconnect/ui-react"
import type { SendTransactionRequest } from "@tonconnect/ui-react"

type CreateOrderResponse = {
  order: { id: string; total_amount_ton: number }
  payment: { recipient: string; amount_ton: number; text: string; ton_uri: string }
}

export function PaymentSheet({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { items, subtotalTon, clear } = useCart()
  const { toast } = useToast()
  const [loading, setLoading] = React.useState(false)
  const [result, setResult] = React.useState<CreateOrderResponse | null>(null)

  const [tonConnectUI] = useTonConnectUI()
  const wallet = useTonWallet()
  const userAddress = useTonAddress()

  async function createAndShowPayment() {
    try {
      setLoading(true)
      setResult(null)
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          cafe_id: 1,
          items: items.map((i) => ({ menu_item_id: i.id, qty: i.qty, price_ton: i.priceTon })),
          currency: "TON",
          note: "Web checkout",
        }),
      })
      if (!res.ok) throw new Error("Failed to create order")
      const data: CreateOrderResponse = await res.json()
      setResult(data)
      toast({ title: "Order created", description: `Order #${data.order.id}` })
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      toast({ title: "Error", description: errorMessage, variant: "destructive" })
    } finally {
      setLoading(false)
    }
  }

  async function sendPayment() {
    if (!result || !wallet) {
      toast({ title: "Error", description: "Connect wallet first", variant: "destructive" })
      return
    }

    try {
      setLoading(true)

      const amountNano = Math.floor(result.payment.amount_ton * 1e9).toString()

      const transaction: SendTransactionRequest = {
        validUntil: Math.floor(Date.now() / 1000) + 300,
        messages: [
          {
            address: result.payment.recipient,
            amount: amountNano,
            payload: result.payment.text,
          },
        ],
      }

      const txResult = await tonConnectUI.sendTransaction(transaction)

      await fetch("/api/payments/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          order_id: result.order.id,
          tx_boc: txResult.boc,
          from: userAddress,
        }),
      })

      toast({
        title: "Payment sent",
        description: "Transaction submitted. We'll verify on-chain shortly.",
      })

      setTimeout(() => {
        clear()
        onOpenChange(false)
      }, 2000)
    } catch (err: unknown) {
      console.error("[v0] Payment error:", err)
      const errorMessage = err instanceof Error ? err.message : "Transaction was rejected or failed"
      toast({
        title: "Payment failed",
        description: errorMessage,
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  function onComplete() {
    clear()
    onOpenChange(false)
  }

  const tonUri = result?.payment.ton_uri
  const isWalletConnected = !!wallet

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full overflow-y-auto pb-safe-bottom sm:max-w-md">
        <SheetHeader className="sticky top-0 z-10 bg-background pb-4">
          <SheetTitle>Pay with TON</SheetTitle>
          <SheetDescription>
            Total: {formatTon(subtotalTon)} TON. Connect your wallet to complete payment.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-4 space-y-4 pb-8">
          {!isWalletConnected && (
            <div className="rounded border border-yellow-500/50 bg-yellow-500/10 p-3 text-sm">
              Please connect your TON wallet using the button in the header to continue.
            </div>
          )}

          {isWalletConnected && userAddress && (
            <div className="rounded border bg-muted p-3 text-sm">
              <div className="font-medium">Connected wallet</div>
              <div className="mt-1 truncate text-xs text-muted-foreground">{userAddress}</div>
            </div>
          )}

          <ol className="list-decimal pl-5 text-sm leading-relaxed text-muted-foreground">
            <li className="mb-2">Connect your TON wallet (Tonkeeper, Tonhub, etc.)</li>
            <li className="mb-2">Click &quot;Create payment&quot; to generate an order.</li>
            <li className="mb-2">Click &quot;Send payment&quot; to sign and send the transaction.</li>
            <li>We verify on-chain and update your order status.</li>
          </ol>

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button
              onClick={createAndShowPayment}
              disabled={loading || items.length === 0 || !isWalletConnected}
              className="w-full sm:flex-1"
              size="lg"
            >
              {loading ? "Creating..." : "Create payment"}
            </Button>

            {result && (
              <Button
                onClick={sendPayment}
                disabled={loading || !isWalletConnected}
                variant="default"
                className="w-full sm:flex-1"
                size="lg"
              >
                {loading ? "Sending..." : "Send payment"}
              </Button>
            )}
          </div>

          {tonUri && (
            <div className="space-y-3">
              <div className="text-sm font-medium">Alternative: Scan QR or use deep link</div>
              <div className="rounded border p-3">
                <div className="mx-auto w-full max-w-[220px] bg-white p-3">
                  <QRCode value={tonUri} size={200} />
                </div>
                <div className="mt-3 break-all text-xs">{tonUri}</div>
              </div>
              <div className="text-xs text-muted-foreground">
                Tip: Open on mobile to launch your wallet app with this transfer pre-filled.
              </div>
            </div>
          )}

          <Button variant="outline" onClick={onComplete} className="w-full bg-transparent" size="lg">
            Close
          </Button>
        </div>

        <SheetFooter className="mt-4" />
      </SheetContent>
    </Sheet>
  )
}
