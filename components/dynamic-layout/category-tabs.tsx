"use client"

import React from 'react'
import { useTranslations } from 'next-intl'
import { CategoryTabsProps } from '@/lib/types/layout'

export const CategoryTabs: React.FC<CategoryTabsProps> = ({ categories = [] }) => {
  const t = useTranslations()
  const [activeCategory, setActiveCategory] = React.useState<string>('')

  React.useEffect(() => {
    if (!activeCategory && categories.length > 0) {
      setActiveCategory(categories[0].slug)
    }
  }, [activeCategory, categories])

  return (
    <div className="flex gap-3 overflow-x-auto p-4">
      {categories.map((c) => {
        const translatedTitle = t(`categories.${c.title}`)
        return (
          <button
            key={c.slug}
            onClick={() => setActiveCategory(c.slug)}
            className={`shrink-0 rounded-full px-4 py-2 shadow-sm transition-colors ${
              activeCategory === c.slug
                ? 'bg-primary text-primary-foreground'
                : 'bg-white hover:bg-accent'
            }`}
          >
            {translatedTitle}
          </button>
        )
      })}
    </div>
  )
}
