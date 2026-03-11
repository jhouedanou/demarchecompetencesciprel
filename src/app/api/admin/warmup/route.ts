import { NextResponse } from 'next/server'

// Warm-up endpoint for Vercel Cron Jobs.
// Keeps the serverless functions warm by being called every 5 minutes.
//
// Configure in vercel.json with crons schedule: "0/5 * * * *"
//
// This prevents cold starts on the admin dashboard by keeping
// the serverless function container alive.

export async function GET() {
  const startTime = Date.now()

  try {
    // Simple health check - just verify Supabase connectivity
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    
    if (!supabaseUrl) {
      return NextResponse.json({ 
        status: 'warning', 
        message: 'Missing Supabase URL' 
      }, { status: 200 })
    }

    // Lightweight ping to keep the connection pool warm
    const { createClient } = await import('@supabase/supabase-js')
    const supabase = createClient(
      supabaseUrl,
      process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { auth: { autoRefreshToken: false, persistSession: false } }
    )

    // Minimal query - just check connectivity
    const { count, error } = await supabase
      .from('profiles')
      .select('id', { count: 'exact', head: true })

    const elapsed = Date.now() - startTime

    if (error) {
      console.warn('[Warmup] DB check failed:', error.message)
      return NextResponse.json({
        status: 'degraded',
        elapsed: `${elapsed}ms`,
        error: error.message,
      })
    }

    return NextResponse.json({
      status: 'ok',
      elapsed: `${elapsed}ms`,
      profiles: count,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    const elapsed = Date.now() - startTime
    console.error('[Warmup] Error:', error)
    return NextResponse.json({
      status: 'error',
      elapsed: `${elapsed}ms`,
    }, { status: 200 }) // Return 200 to avoid cron retry
  }
}
