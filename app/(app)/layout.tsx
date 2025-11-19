"use client"

import * as React from "react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingCart } from 'lucide-react'
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider, useCart } from "@/components/cart-context"
import { cn } from "@/lib/utils"
import { TonConnectUIProvider, TonConnectButton } from "@tonconnect/ui-react"
import { LoadingScreen } from "@/components/loading-screen"

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      <SidebarProvider defaultOpen={true}>
        <CartProvider>
          <LoadingScreen />
          <div className="flex min-h-svh w-full">
            <AppSidebar />
            <SidebarInset>
              <Header onOpenCart={() => setOpen(true)} />
              <div className="p-4 md:p-6">{children}</div>
            </SidebarInset>
          </div>
          <CartDrawer open={open} onOpenChange={setOpen} />
        </CartProvider>
      </SidebarProvider>
    </TonConnectUIProvider>
  )
}

function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const { totalQty } = useCart()
  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-3 px-3 md:px-4">
        <SidebarTrigger />
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          <h1 className="truncate text-base font-semibold md:text-lg">Nomad-Cafe</h1>
          <div className="ml-auto flex items-center gap-2">
            <div className="hidden sm:block">
              <Input
                placeholder="Search menu..."
                className="h-8 w-48 md:w-64"
                aria-label="Search menu"
              />
            </div>
            <div className="hidden md:block">
              <TonConnectButton />
            </div>
            <Button variant="outline" size="sm" onClick={onOpenCart} aria-label="Open cart">
              <ShoppingCart className="mr-2 h-4 w-4" />
              Cart
              <span
                className={cn(
                  "ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded bg-primary px-1 text-xs font-medium text-primary-foreground",
                  totalQty === 0 && "hidden"
                )}
                aria-label={`Items in cart: ${totalQty}`}
              >
                {totalQty}
              </span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
