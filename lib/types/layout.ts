/**
 * Dynamic Layout System Types
 * 
 * This file defines the core types for the headless CMS-style layout system
 * that allows per-tenant UI configuration.
 */

export interface Tenant {
  id: number
  name: string
  domain?: string
  address?: string
  isActive: boolean
}

export interface Page {
  tenantId: number
  slug: string
  title: string
  isPublished: boolean
  createdAt: string
}

export interface ComponentInstance {
  id: number
  pageId?: number
  order: number
  type: string
  props: Record<string, any>
  active: boolean
}

export interface Category {
  id: number
  tenantId: number
  title: string
  slug: string
  parentId?: number
  isActive: boolean
}

export interface PageLayout {
  tenant: {
    id: number
    name: string
    domain?: string
  }
  page: {
    slug: string
    title: string
  }
  components: ComponentInstance[]
}

/**
 * Component-specific prop types for better type safety
 */
export interface TopbarProps {
  logoUrl?: string
  menu?: Array<{ label: string; target: string }>
  walletButton?: boolean
}

export interface HeroProps {
  title?: string
  subtitle?: string
  ctaText?: string
  imageUrl?: string
}

export interface CategoryTabsProps {
  categoriesSource?: 'db' | 'inline'
  categories?: Array<{ slug: string; title: string }>
  maxVisible?: number
}

export interface ProductListProps {
  source?: 'category' | 'featured' | 'all'
  categorySlug?: string
  layout?: 'card' | 'list'
  showPrice?: boolean
  products?: any[]
}

export interface FooterProps {
  links?: Array<{ label: string; url: string }>
  copyright?: string
}
