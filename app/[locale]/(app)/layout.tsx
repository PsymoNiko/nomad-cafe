"use client"

import * as React from "react"
import { Suspense } from "react"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ShoppingCart, Search } from "lucide-react"
import { CartDrawer } from "@/components/cart-drawer"
import { CartProvider, useCart } from "@/components/cart-context"
import { cn } from "@/lib/utils"
import { TonConnectUIProvider, TonConnectButton } from "@tonconnect/ui-react"
import { LoadingScreen } from "@/components/loading-screen"
import { useTranslations } from 'next-intl'
import { LanguageSwitcher } from '@/components/language-switcher'

export default function Layout({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = React.useState(false)

  return (
    <TonConnectUIProvider manifestUrl="/tonconnect-manifest.json">
      <SidebarProvider defaultOpen={true}>
        <CartProvider>
          <Suspense fallback={<LoadingScreen />}>
            <div className="flex min-h-svh w-full">
              <AppSidebar />
              <SidebarInset>
                <Header onOpenCart={() => setOpen(true)} />
                <div className="p-4 md:p-6">{children}</div>
              </SidebarInset>
            </div>
            <CartDrawer open={open} onOpenChange={setOpen} />
          </Suspense>
        </CartProvider>
      </SidebarProvider>
    </TonConnectUIProvider>
  )
}

function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const { totalQty } = useCart()
  const t = useTranslations()
  const [showSearch, setShowSearch] = React.useState(false)

  return (
    <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex h-14 items-center gap-2 px-3 md:px-4">
        <SidebarTrigger />
        <div className="flex flex-1 items-center gap-2 overflow-hidden">
          <h1 className="truncate text-sm font-semibold md:text-lg">{t('app.title')}</h1>
          <div className="ml-auto flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9 sm:hidden"
              onClick={() => setShowSearch(!showSearch)}
              aria-label="Toggle search"
            >
              <Search className="h-4 w-4" />
            </Button>
            <div className={cn("transition-all", showSearch ? "flex" : "hidden sm:flex")}>
              <Input placeholder={t('menu.searchPlaceholder')} className="h-9 w-full sm:w-48 md:w-64" aria-label="Search menu" />
            </div>
            <LanguageSwitcher />
            <div className="flex items-center">
              <TonConnectButton />
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={onOpenCart}
              aria-label="Open cart"
              className="h-9 bg-transparent"
            >
              <ShoppingCart className="h-4 w-4 sm:mr-2" />
              <span className="hidden sm:inline">{t('cart.title').replace('Your ', '')}</span>
              <span
                className={cn(
                  "ml-1 sm:ml-2 inline-flex h-5 min-w-5 items-center justify-center rounded bg-primary px-1 text-xs font-medium text-primary-foreground",
                  totalQty === 0 && "hidden",
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
