import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Deshabilitar Edge Runtime para este middleware
export const runtime = 'nodejs'

// Rutas públicas (no requieren autenticación)
const PUBLIC_ROUTES = [
  '/',
  '/auth',
  '/pricing',
  '/contact',
  '/privacy',
  '/terms',
  '/api/auth',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip archivos estáticos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Permitir rutas públicas
  const isPublicRoute = PUBLIC_ROUTES.some(route => 
    pathname === route || pathname.startsWith(route)
  )
  
  if (isPublicRoute) {
    return NextResponse.next()
  }

  // Para rutas protegidas, verificar cookie de sesión
  const sessionToken = request.cookies.get('next-auth.session-token') || 
                       request.cookies.get('__Secure-next-auth.session-token')

  if (!sessionToken) {
    const loginUrl = new URL('/auth/login', request.url)
    loginUrl.searchParams.set('callbackUrl', pathname)
    return NextResponse.redirect(loginUrl)
  }

  // Headers de seguridad
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  
  return response
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|api/auth).*)',
  ],
}