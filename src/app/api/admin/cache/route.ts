import { NextRequest, NextResponse } from 'next/server'
import { cache } from '@/lib/cache'

export const dynamic = 'force-dynamic'

// GET: Get cache statistics
export async function GET(request: NextRequest) {
  // Simple admin check via query param (you can enhance this with proper auth)
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  
  // Basic protection (in production, use proper authentication)
  if (secret !== process.env.CACHE_ADMIN_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  const stats = cache.getStats()
  
  return NextResponse.json({
    success: true,
    stats: {
      ...stats,
      description: 'In-memory cache statistics'
    }
  })
}

// DELETE: Clear cache (optionally by pattern)
export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const secret = searchParams.get('secret')
  const pattern = searchParams.get('pattern')
  
  // Basic protection
  if (secret !== process.env.CACHE_ADMIN_SECRET && process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  if (pattern) {
    const count = cache.invalidatePattern(pattern)
    return NextResponse.json({
      success: true,
      message: `Cleared ${count} cache entries matching pattern: ${pattern}`
    })
  }
  
  cache.clear()
  
  return NextResponse.json({
    success: true,
    message: 'All cache entries cleared'
  })
}
