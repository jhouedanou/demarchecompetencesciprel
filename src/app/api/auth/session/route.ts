import { NextRequest, NextResponse } from 'next/server'
import { getUserById } from '@/lib/auth-helpers'
import { parse } from 'cookie'

export async function GET(request: NextRequest) {
  const startTime = performance.now()
  console.log('🔍 [API /auth/session] Session check request')

  try {
    // Récupérer le cookie de session
    const cookieStart = performance.now()
    const cookies = parse(request.headers.get('cookie') || '')
    const sessionToken = cookies.session
    const cookieTime = performance.now() - cookieStart
    console.log(`⏱️ [API /auth/session] Cookie parsing: ${cookieTime.toFixed(2)}ms`)

    if (!sessionToken) {
      console.log('❌ [API /auth/session] No session token found')
      return NextResponse.json({ user: null }, { status: 200 })
    }

    // Décoder le token
    let sessionData
    try {
      const decodeStart = performance.now()
      sessionData = JSON.parse(Buffer.from(sessionToken, 'base64').toString())
      const decodeTime = performance.now() - decodeStart
      console.log(`⏱️ [API /auth/session] Token decode: ${decodeTime.toFixed(2)}ms`)
    } catch (e) {
      console.error('❌ [API /auth/session] Invalid session token')
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const { userId } = sessionData

    // Récupérer l'utilisateur
    const dbStart = performance.now()
    const user = await getUserById(userId)
    const dbTime = performance.now() - dbStart
    console.log(`⏱️ [API /auth/session] Database query (getUserById): ${dbTime.toFixed(2)}ms`)

    if (!user) {
      console.warn('❌ [API /auth/session] User not found for session')
      return NextResponse.json({ user: null }, { status: 200 })
    }

    const elapsed = performance.now() - startTime
    console.log(`✅ [API /auth/session] User found in ${elapsed.toFixed(0)}ms:`, user.email)

    return NextResponse.json({ user }, { status: 200 })
  } catch (error) {
    const elapsed = performance.now() - startTime
    console.error(`❌ [API /auth/session] Error after ${elapsed.toFixed(0)}ms:`, error)
    return NextResponse.json({ user: null }, { status: 200 })
  }
}
