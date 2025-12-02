import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Rutas que requieren autenticación
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/simulators',
  '/properties',
  '/reports',
  '/admin',
  '/app',
]

// Rutas que requieren roles específicos
const ADMIN_ROUTES = [
  '/admin',
]

// Rutas públicas (no requieren autenticación)
const PUBLIC_ROUTES = [
  '/',
  '/auth/login',
  '/auth/register',
  '/auth/verify-email',
  '/auth/forgot-password',
  '/auth/reset-password',
  '/pricing',
  '/contact',
  '/privacy',
  '/terms',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  // Skip archivos estáticos y API de auth
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.startsWith('/api/public') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Verificar rutas públicas primero
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Para rutas protegidas, verificar autenticación
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    try {
      const token = await getToken({ 
        req: request,
        secret: process.env.NEXTAUTH_SECRET 
      })

      if (!token) {
        const loginUrl = new URL('/auth/login', request.url)
        loginUrl.searchParams.set('callbackUrl', pathname)
        return NextResponse.redirect(loginUrl)
      }

      // Verificar estado de usuario
      if (!token.isActive) {
        return NextResponse.redirect(new URL('/auth/account-suspended', request.url))
      }

      // Verificar email verificado
      if (!token.emailVerified && !pathname.startsWith('/auth/verify-email')) {
        return NextResponse.redirect(new URL('/auth/verify-email', request.url))
      }

      // Verificar onboarding
      if (!token.onboardingCompleted && 
          !pathname.startsWith('/onboarding') && 
          !pathname.startsWith('/auth')) {
        return NextResponse.redirect(new URL('/onboarding', request.url))
      }

      // Verificar permisos de admin
      if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
        if (token.role !== 'ADMIN' && token.role !== 'MODERATOR') {
          return NextResponse.redirect(new URL('/403', request.url))
        }
      }
    } catch (error) {
      console.error('Middleware auth error:', error)
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
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
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}