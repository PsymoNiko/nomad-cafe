import { NextRequest, NextResponse } from 'next/server'
import { getPageLayout } from '@/lib/data/layout-store'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; slug: string } }
) {
  try {
    const tenantId = parseInt(params.id, 10)
    const slug = params.slug

    if (isNaN(tenantId)) {
      return NextResponse.json(
        { error: 'Invalid tenant ID' },
        { status: 400 }
      )
    }

    const layout = getPageLayout(tenantId, slug)

    if (!layout) {
      return NextResponse.json(
        { error: 'Layout not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(layout)
  } catch (error) {
    console.error('Error fetching layout:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
