"use client"

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useCart } from '@/components/cart-context'
import { formatTon } from '@/utils/ton'
import { Plus, Eye } from 'lucide-react'
import { ProductListProps } from '@/lib/types/layout'

export const ProductList: React.FC<ProductListProps> = ({ products = [], showPrice = true }) => {
  const { addItem } = useCart()
  const t = useTranslations()

  return (
    <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-2">
      {products.map((p) => {
        const itemTitle = t(`items.${p.id}.title`)
        const itemDescription = t(`items.${p.id}.description`)

        return (
          <div key={p.id} className="overflow-hidden rounded-lg bg-white p-4 shadow">
            <div className="relative mb-2 h-40 w-full overflow-hidden rounded">
              <Image
                src={p.imageUrl || '/placeholder.svg?height=160&width=320'}
                alt={itemTitle}
                fill
                className="object-cover"
              />
              {p.discount && (
                <Badge className="absolute right-2 top-2 bg-secondary/90">
                  -{p.discount}%
                </Badge>
              )}
            </div>
            <h3 className="mt-2 font-semibold">{itemTitle}</h3>
            <p className="text-sm text-gray-500">{itemDescription}</p>
            <div className="mt-2 flex items-center justify-between">
              {showPrice && (
                <span className="font-bold tabular-nums">{formatTon(p.priceTon)}</span>
              )}
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/item/${p.id}`}>
                    <Eye className="mr-1 h-4 w-4" />
                    {t('menu.details')}
                  </Link>
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    addItem(
                      {
                        id: p.id,
                        title: itemTitle,
                        priceTon: p.priceTon,
                        imageUrl: p.imageUrl,
                      },
                      1
                    )
                  }
                >
                  <Plus className="mr-1 h-4 w-4" />
                  {t('menu.add')}
                </Button>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
