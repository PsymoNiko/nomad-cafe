"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-context"
import * as React from "react"
import { PaymentSheet } from "@/components/payment-sheet"
import { formatTon } from "@/utils/ton"
import { Plus, Eye } from 'lucide-react'
import { SAMPLE_MENU } from "./menu-data"

export default function Page() {
  const { addItem, subtotalTon } = useCart()
  const [openPay, setOpenPay] = React.useState(false)
  const [category, setCategory] = React.useState<string>("All")
  const categoryBarRef = React.useRef<HTMLDivElement>(null)

  const categories = React.useMemo(() => ["All", ...new Set(SAMPLE_MENU.map((m) => m.category))], [])
  const filtered = SAMPLE_MENU.filter((m) => category === "All" || m.category === category)

  return (
    <main className="pb-24">
      <section className="brand-gradient mb-6 rounded-xl p-6 text-white shadow-lg md:p-8">
        <h1 className="text-balance text-2xl font-bold md:text-3xl">Welcome to Nomad-Cafe</h1>
        <p className="mt-2 text-pretty text-sm leading-relaxed text-white/90 md:text-base">
          {'Experience specialty coffee and artisan treats, powered by TON blockchain payments.'}
        </p>
      </section>

      <div className="sticky top-0 z-10 -mx-4 mb-5 bg-background/95 px-4 py-3 backdrop-blur-sm md:-mx-6 md:px-6">
        <div 
          ref={categoryBarRef}
          className="no-scrollbar flex gap-2 overflow-x-auto"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-5 py-2.5 text-sm font-medium transition-all ${
                category === c
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground'
              }`}
              style={{ scrollSnapAlign: 'start', minHeight: '44px' }}
              aria-pressed={category === c}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((item) => (
          <article
            key={item.id}
            className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative aspect-square w-full overflow-hidden bg-muted">
              <Image
                src={item.imageUrl || "/placeholder.svg?height=240&width=240&query=cafe+item"}
                alt={`${item.title} from Nomad-Cafe`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <Badge className="absolute left-3 top-3 bg-primary/90 text-primary-foreground backdrop-blur-sm">
                Nomad-Cafe
              </Badge>
              {item.discount && (
                <Badge className="absolute right-3 top-3 bg-secondary/90 text-secondary-foreground backdrop-blur-sm">
                  -{item.discount}%
                </Badge>
              )}
            </div>
            <div className="p-4">
              <div className="mb-2 flex items-start justify-between gap-2">
                <h3 className="text-balance text-base font-semibold leading-snug">{item.title}</h3>
                <div className="shrink-0 rounded-md bg-muted px-2 py-1 text-sm font-bold tabular-nums">
                  {formatTon(item.priceTon)}
                </div>
              </div>
              <p className="text-pretty text-sm leading-relaxed text-muted-foreground">
                {item.description}
              </p>
              <div className="mt-4 flex gap-2">
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 gap-2"
                  style={{ minHeight: '44px' }}
                >
                  <Link href={`/item/${item.id}`}>
                    <Eye className="h-4 w-4" />
                    Details
                  </Link>
                </Button>
                <Button
                  onClick={() =>
                    addItem(
                      { id: item.id, title: item.title, priceTon: item.priceTon, imageUrl: item.imageUrl },
                      1
                    )
                  }
                  className="flex-1 gap-2 shadow-sm"
                  style={{ minHeight: '44px' }}
                >
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="fixed bottom-4 left-4 right-4 z-20 md:left-auto md:right-8 md:w-auto">
        <Button
          size="lg"
          className="brand-gradient w-full text-white shadow-2xl md:w-auto md:min-w-[16rem]"
          disabled={subtotalTon === 0}
          onClick={() => setOpenPay(true)}
          style={{ minHeight: '56px' }}
        >
          <span className="text-base font-semibold">
            Pay {formatTon(subtotalTon)} TON
          </span>
        </Button>
      </div>

      <PaymentSheet open={openPay} onOpenChange={setOpenPay} />
      
      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </main>
  )
}
