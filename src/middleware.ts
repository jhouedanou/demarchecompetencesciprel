import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Routes protégées nécessitant une authentification
const protectedRoutes = ['/competences', '/profile', '/admin', '/sondage']

// Routes admin nécessitant le rôle ADMIN ou MANAGER
const adminRoutes = ['/admin']

// Routes publiques toujours accessibles
const publicRoutes = ['/', '/login', '/register', '/legal']

export async function middleware(req: NextRequest) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // Si les variables d'environnement Supabase ne sont pas configurées,
  // permettre l'accès à toutes les routes publiques
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase environment variables for middleware - allowing public access')
    const pathname = req.nextUrl.pathname
    
    // Permettre l'accès à toutes les routes publiques même sans Supabase
    const publicRoutes = ['/', '/login', '/register', '/legal', '/dialectique', '/synoptique', '/quiz', '/facteurs-cles', '/ressources', '/contact', '/sondage']
    
    if (publicRoutes.some(route => pathname.startsWith(route))) {
      return NextResponse.next()
    }
    
    // Pour les autres routes, rediriger vers la page d'accueil
    const url = req.nextUrl.clone()
    url.pathname = '/'
    return NextResponse.redirect(url)
  }

  const requestHeaders = new Headers(req.headers)
  const supabaseResponse = NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  })

  const supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return req.cookies.getAll().map(cookie => ({
          name: cookie.name,
          value: cookie.value,
        }))
      },
      setAll(cookies) {
        cookies.forEach(({ name, value, options }) => {
          const responseOptions = toResponseCookieOptions(options)
          const shouldDelete = isCookieDeletion(responseOptions)

          if (shouldDelete) {
            req.cookies.delete(name)
            supabaseResponse.cookies.delete({
              name,
              ...omitExpires(responseOptions),
            })
          } else {
            req.cookies.set(name, value)
            supabaseResponse.cookies.set({
              name,
              value,
              ...responseOptions,
            })
          }

          syncRequestCookieHeader(req, requestHeaders)
        })
      },
    },
  })

  // Vérifier la session utilisateur
  const {
    data: { session },
  } = await supabase.auth.getSession()

  const url = req.nextUrl.clone()
  const pathname = url.pathname

  // Permettre les routes publiques
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return supabaseResponse
  }

  // Vérifier l'authentification admin locale pour les routes /admin
  const isAdminRoute = adminRoutes.some(route => pathname.startsWith(route))
  const hasLocalAdminAuth = typeof window !== 'undefined' ? false : true // Note: Pas d'accès window côté serveur

  // Rediriger vers login si pas authentifié sur route protégée (sauf /admin qui a sa propre auth)
  if (protectedRoutes.some(route => pathname.startsWith(route)) && !session) {
    // Pour /admin, on peut accéder sans session Supabase (auth admin locale)
    if (isAdminRoute) {
      return supabaseResponse
    }
    url.pathname = '/login'
    url.searchParams.set('redirect', pathname)
    const redirectResponse = NextResponse.redirect(url)
    mergeSupabaseCookies(supabaseResponse, redirectResponse)
    return redirectResponse
  }

  // Vérifier les permissions admin (seulement si session Supabase existe)
  if (adminRoutes.some(route => pathname.startsWith(route)) && session) {
    // Récupérer le profil utilisateur pour vérifier le rôle
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (!profile || !['ADMIN', 'MANAGER'].includes(profile.role)) {
      // Rediriger vers la porte d'accès admin si pas les bonnes permissions Supabase
      url.pathname = '/ciprel-admin'
      const redirectResponse = NextResponse.redirect(url)
      mergeSupabaseCookies(supabaseResponse, redirectResponse)
      return redirectResponse
    }
  }

  // Si authentifié et tentative d'accès aux pages d'auth, rediriger
  if (session && ['/login', '/register'].includes(pathname)) {
    const profile = await supabase
      .from('profiles')
      .select('role')
      .eq('id', session.user.id)
      .single()

    if (profile.data?.role === 'ADMIN') {
      url.pathname = '/admin'
    } else {
      url.pathname = '/competences'
    }
    const redirectResponse = NextResponse.redirect(url)
    mergeSupabaseCookies(supabaseResponse, redirectResponse)
    return redirectResponse
  }

  return supabaseResponse
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, videos, etc.)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|images|videos|icons).*)',
  ],
}
type ResponseCookieOptions = ReturnType<typeof toResponseCookieOptions>

function toResponseCookieOptions(options: CookieOptions = {}) {
  const {
    domain,
    expires,
    httpOnly,
    maxAge,
    path,
    sameSite,
    secure,
    priority,
    partitioned,
  } = options

  return {
    ...(domain ? { domain } : {}),
    ...(typeof expires !== 'undefined' ? { expires } : {}),
    ...(typeof httpOnly !== 'undefined' ? { httpOnly } : {}),
    ...(typeof maxAge !== 'undefined' ? { maxAge } : {}),
    ...(path ? { path } : {}),
    ...(typeof sameSite !== 'undefined' ? { sameSite } : {}),
    ...(typeof secure !== 'undefined' ? { secure } : {}),
    ...(typeof priority !== 'undefined' ? { priority } : {}),
    ...(typeof partitioned !== 'undefined' ? { partitioned } : {}),
  }
}

function isCookieDeletion(options: ResponseCookieOptions) {
  return typeof options.maxAge !== 'undefined' && options.maxAge <= 0
}

function omitExpires(options: ResponseCookieOptions) {
  const { expires: _expires, ...rest } = options
  return rest
}

function syncRequestCookieHeader(req: NextRequest, headers: Headers) {
  const serialized = req.cookies.toString()
  if (serialized) {
    headers.set('cookie', serialized)
  } else {
    headers.delete('cookie')
  }
}

function mergeSupabaseCookies(source: NextResponse, destination: NextResponse) {
  source.cookies.getAll().forEach(cookie => {
    destination.cookies.set(cookie)
  })
}
