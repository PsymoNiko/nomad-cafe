/**
 * Mock data store for dynamic layout system
 * 
 * In production, this would be replaced with a database (Prisma, etc.)
 * For now, it provides sample tenant configurations and layouts.
 */

import { Tenant, Page, ComponentInstance, Category, PageLayout } from '@/lib/types/layout'
import { SAMPLE_MENU } from '@/app/[locale]/(app)/menu-data'

// Sample tenants
export const TENANTS: Tenant[] = [
  {
    id: 1,
    name: 'Nomad-Cafe',
    domain: 'nomad.example',
    address: 'Berlin',
    isActive: true,
  },
  {
    id: 2,
    name: 'Tokyo Coffee',
    domain: 'tokyo.example',
    address: 'Tokyo',
    isActive: true,
  },
]

// Sample pages
export const PAGES: Page[] = [
  {
    tenantId: 1,
    slug: 'home',
    title: 'Welcome to Nomad-Cafe',
    isPublished: true,
    createdAt: new Date().toISOString(),
  },
]

// Sample categories
export const CATEGORIES: Category[] = [
  {
    id: 1,
    tenantId: 1,
    title: 'Coffee',
    slug: 'coffee',
    isActive: true,
  },
  {
    id: 2,
    tenantId: 1,
    title: 'Tea',
    slug: 'tea',
    isActive: true,
  },
  {
    id: 3,
    tenantId: 1,
    title: 'Bakery',
    slug: 'bakery',
    isActive: true,
  },
]

// Sample component instances for the home page
export const COMPONENT_INSTANCES: ComponentInstance[] = [
  {
    id: 1,
    order: 0,
    type: 'Topbar',
    active: true,
    props: {
      logoUrl: '/placeholder.svg?height=32&width=32',
      menu: [
        { label: 'All', target: '/?category=all' },
        { label: 'Coffee', target: '/?category=coffee' },
        { label: 'Tea', target: '/?category=tea' },
        { label: 'Bakery', target: '/?category=bakery' },
      ],
      walletButton: true,
    },
  },
  {
    id: 2,
    order: 1,
    type: 'Hero',
    active: true,
    props: {
      title: 'Welcome to Nomad-Cafe',
      subtitle: 'Experience specialty coffee and pastries delivered to your location via TON blockchain',
      ctaText: 'Browse Menu',
      imageUrl: '/caffe-latte.jpg',
    },
  },
  {
    id: 3,
    order: 2,
    type: 'CategoryTabs',
    active: true,
    props: {
      categoriesSource: 'db',
      maxVisible: 6,
    },
  },
  {
    id: 4,
    order: 3,
    type: 'ProductList',
    active: true,
    props: {
      source: 'all',
      layout: 'card',
      showPrice: true,
    },
  },
  {
    id: 99,
    order: 99,
    type: 'Footer',
    active: true,
    props: {
      links: [
        { label: 'About', url: '/about' },
        { label: 'Contact', url: '/contact' },
        { label: 'Terms', url: '/terms' },
      ],
      copyright: '© 2025 Nomad-Cafe',
    },
  },
]

/**
 * Get tenant by ID or domain
 */
export function getTenant(idOrDomain: number | string): Tenant | null {
  if (typeof idOrDomain === 'number') {
    return TENANTS.find(t => t.id === idOrDomain) || null
  }
  return TENANTS.find(t => t.domain === idOrDomain) || null
}

/**
 * Get page by tenant and slug
 */
export function getPage(tenantId: number, slug: string): Page | null {
  return PAGES.find(p => p.tenantId === tenantId && p.slug === slug) || null
}

/**
 * Get categories for a tenant
 */
export function getCategories(tenantId: number): Category[] {
  return CATEGORIES.filter(c => c.tenantId === tenantId && c.isActive)
}

/**
 * Get layout for a specific page
 * This resolves database references (like categories) and returns a complete layout
 */
export function getPageLayout(tenantId: number, slug: string): PageLayout | null {
  const tenant = getTenant(tenantId)
  if (!tenant || !tenant.isActive) return null

  const page = getPage(tenantId, slug)
  if (!page || !page.isPublished) return null

  // Get components and resolve any database references
  const components = COMPONENT_INSTANCES
    .filter(c => c.active)
    .sort((a, b) => a.order - b.order)
    .map(component => {
      const resolvedProps = { ...component.props }

      // Resolve categories if needed
      if (component.type === 'CategoryTabs' && resolvedProps.categoriesSource === 'db') {
        const categories = getCategories(tenantId)
        resolvedProps.categories = categories.map(c => ({
          slug: c.slug,
          title: c.title,
        }))
      }

      // Resolve products if needed
      if (component.type === 'ProductList') {
        if (resolvedProps.source === 'all') {
          resolvedProps.products = SAMPLE_MENU
        } else if (resolvedProps.source === 'category' && resolvedProps.categorySlug) {
          resolvedProps.products = SAMPLE_MENU.filter(
            item => item.category === resolvedProps.categorySlug
          )
        }
      }

      return {
        ...component,
        props: resolvedProps,
      }
    })

  return {
    tenant: {
      id: tenant.id,
      name: tenant.name,
      domain: tenant.domain,
    },
    page: {
      slug: page.slug,
      title: page.title,
    },
    components,
  }
}
