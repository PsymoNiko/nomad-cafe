"use client"

import { useCart } from "./cart-context"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetFooter } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { Minus, Plus, Trash2 } from 'lucide-react'
import { formatTon } from "@/utils/ton"
import { useTranslations } from 'next-intl'

export function CartDrawer({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const { items, updateQty, removeItem, subtotalTon } = useCart()
  const t = useTranslations()

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <span>{t('cart.title')}</span>
            <Badge variant="secondary" className="text-xs">{t('app.title')}</Badge>
          </SheetTitle>
        </SheetHeader>
        <div className="mt-4 flex h-[calc(100dvh-9rem)] flex-col">
          <div className="flex-1 space-y-3 overflow-auto pr-2">
            {items.length === 0 && (
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {t('cart.empty')}
              </p>
            )}
            {items.map((item) => (
              <div key={item.id} className="flex gap-3 rounded-lg border bg-card p-3 shadow-sm">
                <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-muted">
                  <Image
                    src={
                      item.imageUrl ||
                      "/placeholder.svg?height=80&width=80&query=coffee+item"
                     || "/placeholder.svg"}
                    alt={`${item.title} thumbnail`}
                    fill
                    className="object-cover"
                    sizes="80px"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <h4 className="text-balance text-sm font-semibold leading-snug">{item.title}</h4>
                    <button
                      className="rounded p-1.5 text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                      onClick={() => removeItem(item.id)}
                      aria-label={`${t('cart.remove')} ${item.title}`}
                      style={{ minWidth: '32px', minHeight: '32px' }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mb-2 text-xs font-medium text-muted-foreground">
                    {formatTon(item.priceTon)} {t('cart.ton')} {t('cart.each')}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-md border bg-background transition-colors hover:bg-muted"
                      onClick={() => updateQty(item.id, item.qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3.5 w-3.5" />
                    </button>
                    <span className="min-w-[2rem] text-center text-sm font-semibold tabular-nums">{item.qty}</span>
                    <button
                      className="flex h-8 w-8 items-center justify-center rounded-md border bg-background transition-colors hover:bg-muted"
                      onClick={() => updateQty(item.id, item.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-3 space-y-3 border-t pt-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-muted-foreground">{t('payment.subtotal')}</span>
              <span className="text-lg font-bold tabular-nums">{formatTon(subtotalTon)} {t('cart.ton')}</span>
            </div>
            <SheetFooter>
              <Button 
                className="brand-gradient w-full text-white shadow-md" 
                disabled={items.length === 0} 
                onClick={() => onOpenChange(false)}
                style={{ minHeight: '48px' }}
              >
                {t('payment.title')}
              </Button>
            </SheetFooter>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
