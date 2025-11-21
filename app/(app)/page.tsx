"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useCart } from "@/components/cart-context"
import * as React from "react"
import { PaymentSheet } from "@/components/payment-sheet"
import { formatTon } from "@/utils/ton"
import { Plus, Eye } from "lucide-react"
import { SAMPLE_MENU } from "./menu-data"

export default function Page() {
  const { addItem, subtotalTon } = useCart()
  const [openPay, setOpenPay] = React.useState(false)
  const [category, setCategory] = React.useState<string>("All")
  const categoryBarRef = React.useRef<HTMLDivElement>(null)

  const categories = React.useMemo(() => ["All", ...new Set(SAMPLE_MENU.map((m) => m.category))], [])
  const filtered = SAMPLE_MENU.filter((m) => category === "All" || m.category === category)

  return (
    <main className="pb-20 sm:pb-24 md:pb-8">
      <section className="brand-gradient mb-4 rounded-xl p-3 text-white shadow-lg sm:p-6 md:mb-6 md:p-8">
        <h1 className="text-balance text-base font-bold sm:text-xl md:text-3xl">Welcome to Nomad-Cafe</h1>
        <p className="mt-1 text-pretty text-[11px] leading-relaxed text-white/90 sm:mt-1.5 sm:text-sm md:mt-2 md:text-base">
          {
            "Experience specialty coffee and artisan treats, powered by TON blockchain payments. All our beverages are non-alcoholic and suitable for all ages."
          }
        </p>
      </section>

      <div className="sticky top-14 z-10 -mx-4 mb-3 bg-background/95 px-2 py-2 backdrop-blur-sm sm:-mx-6 sm:mb-4 sm:px-4 sm:py-3 md:px-6">
        <div
          ref={categoryBarRef}
          className="no-scrollbar flex gap-2 overflow-x-auto"
          style={{ scrollSnapType: "x mandatory" }}
        >
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setCategory(c)}
              className={`shrink-0 rounded-full px-3 py-1.5 text-xs font-medium transition-all sm:px-5 sm:py-2.5 sm:text-sm ${
                category === c
                  ? "bg-primary text-primary-foreground shadow-md"
                  : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
              }`}
              style={{ scrollSnapAlign: "start", minHeight: "32px" }}
              aria-pressed={category === c}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3 xs:grid-cols-2 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filtered.map((item, index) => (
          <article
            key={item.id}
            className="group overflow-hidden rounded-xl border bg-card shadow-sm transition-all hover:shadow-md"
          >
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-muted">
              <Image
                src={
                  item.imageUrl ||
                  `/placeholder.svg?height=300&width=400&query=${encodeURIComponent(item.title + " coffee drink") || "/placeholder.svg"}`
                }
                alt={`${item.title} from Nomad-Cafe`}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                sizes="(max-width: 480px) 100vw, (max-width: 640px) 50vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw"
                priority={index < 4}
              />
              <Badge className="absolute left-2 top-2 bg-primary/90 text-[10px] text-primary-foreground backdrop-blur-sm sm:left-2.5 sm:top-2.5 sm:text-xs">
                Nomad-Cafe
              </Badge>
              {item.isNonAlcoholic && (
                <Badge className="absolute left-2 top-9 bg-green-500/90 text-[10px] text-white backdrop-blur-sm sm:left-2.5 sm:top-10 sm:text-xs">
                  All Ages
                </Badge>
              )}
              {item.discount && (
                <Badge className="absolute right-2 top-2 bg-secondary/90 text-[10px] text-secondary-foreground backdrop-blur-sm sm:right-2.5 sm:top-2.5 sm:text-xs">
                  -{item.discount}%
                </Badge>
              )}
            </div>
            <div className="p-2.5 sm:p-3 md:p-4">
              <div className="mb-1.5 flex items-start justify-between gap-1.5 sm:mb-2 sm:gap-2">
                <h3 className="line-clamp-2 text-balance text-xs font-semibold leading-tight sm:text-sm md:text-base">
                  {item.title}
                </h3>
                <div className="shrink-0 rounded-md bg-muted px-1.5 py-0.5 text-[10px] font-bold tabular-nums sm:text-xs md:px-2 md:py-1 md:text-sm">
                  {formatTon(item.priceTon)}
                </div>
              </div>
              <p className="line-clamp-2 text-pretty text-[11px] leading-relaxed text-muted-foreground sm:text-xs md:text-sm">
                {item.description}
              </p>
              <div className="mt-2.5 flex gap-1.5 sm:mt-3 sm:gap-2 md:mt-4">
                <Button
                  asChild
                  variant="outline"
                  size="sm"
                  className="flex-1 gap-1 bg-transparent px-2 text-[11px] sm:gap-1.5 sm:px-3 sm:text-xs md:text-sm"
                  style={{ minHeight: "36px" }}
                >
                  <Link href={`/item/${item.id}`}>
                    <Eye className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                    <span className="hidden xs:inline">Details</span>
                    <span className="xs:hidden">View</span>
                  </Link>
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    addItem({ id: item.id, title: item.title, priceTon: item.priceTon, imageUrl: item.imageUrl }, 1)
                  }
                  className="flex-1 gap-1 px-2 text-[11px] shadow-sm sm:gap-1.5 sm:px-3 sm:text-xs md:text-sm"
                  style={{ minHeight: "36px" }}
                >
                  <Plus className="h-3 w-3 sm:h-3.5 sm:w-3.5 md:h-4 md:w-4" />
                  Add
                </Button>
              </div>
            </div>
          </article>
        ))}
      </div>

      <div className="fixed bottom-2 left-2 right-2 z-20 sm:bottom-4 sm:left-4 sm:right-4 md:left-auto md:right-8 md:w-auto">
        <Button
          size="lg"
          className="brand-gradient w-full text-white shadow-2xl md:w-auto md:min-w-[16rem]"
          disabled={subtotalTon === 0}
          onClick={() => setOpenPay(true)}
          style={{ minHeight: "44px" }}
        >
          <span className="text-xs font-semibold sm:text-sm md:text-base">Pay {formatTon(subtotalTon)} TON</span>
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
