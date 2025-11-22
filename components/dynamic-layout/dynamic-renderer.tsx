"use client"

import React from 'react'
import { PageLayout } from '@/lib/types/layout'
import { Topbar } from './topbar'
import { Hero } from './hero'
import { CategoryTabs } from './category-tabs'
import { ProductList } from './product-list'
import { Footer } from './footer'

/**
 * Component map - maps component types to React components
 */
const componentMap: Record<string, React.FC<any>> = {
  Topbar,
  Hero,
  CategoryTabs,
  ProductList,
  Footer,
}

interface DynamicRendererProps {
  layout: PageLayout
}

/**
 * DynamicRenderer - renders a page layout dynamically based on component configuration
 * 
 * This component takes a layout definition and renders the appropriate components
 * in the specified order with the provided props.
 */
export const DynamicRenderer: React.FC<DynamicRendererProps> = ({ layout }) => {
  const components = layout.components
    .filter((c) => c.active !== false)
    .sort((a, b) => a.order - b.order)

  return (
    <div className="space-y-4">
      {components.map((c) => {
        const Component = componentMap[c.type]
        
        if (!Component) {
          // Unknown component type: render fallback
          console.warn(`Unknown component type: ${c.type}`)
          return (
            <div
              key={c.id}
              className="rounded-lg bg-red-50 p-4 text-red-700"
            >
              Unknown component: {c.type}
            </div>
          )
        }

        return <Component key={c.id} {...c.props} />
      })}
    </div>
  )
}
