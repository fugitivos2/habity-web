import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'

// Rutas que requieren autenticación
const PROTECTED_ROUTES = [
  '/dashboard',
  '/profile',
  '/settings',
  '/simulators',
  '/properties',
  '/reports',
  '/admin',
  '/app', // Toda la app está protegida
]

// Rutas que requieren roles específicos
const ADMIN_ROUTES = [
  '/admin',
]

// Rutas que requieren suscripción premium
const PREMIUM_ROUTES = [
  '/simulators/advanced',
  '/reports/premium',
  '/analytics',
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
  
  // Skip archivos estáticos
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/auth') ||
    pathname.includes('.')
  ) {
    return NextResponse.next()
  }

  // Obtener sesión
  const session = await auth()
  
  // Log de requests
  const ip = request.ip || request.headers.get('x-forwarded-for') || 'unknown'
  console.log(`🌐 ${request.method} ${pathname} - IP: ${ip} - User: ${session?.user?.email || 'anonymous'}`)

  // Verificar rutas públicas
  if (PUBLIC_ROUTES.some(route => pathname === route || pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Verificar autenticación para rutas protegidas
  if (PROTECTED_ROUTES.some(route => pathname.startsWith(route))) {
    if (!session?.user) {
      const loginUrl = new URL('/auth/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    // Verificar estado de usuario
    if (!session.user.isActive) {
      return NextResponse.redirect(new URL('/auth/account-suspended', request.url))
    }

    // Verificar email verificado
    if (!session.user.emailVerified && !pathname.startsWith('/auth/verify-email')) {
      return NextResponse.redirect(new URL('/auth/verify-email', request.url))
    }

    // Verificar onboarding
    if (!session.user.onboardingCompleted && 
        !pathname.startsWith('/onboarding') && 
        !pathname.startsWith('/auth')) {
      return NextResponse.redirect(new URL('/onboarding', request.url))
    }

    // Verificar permisos de admin
    if (ADMIN_ROUTES.some(route => pathname.startsWith(route))) {
      if (session.user.role !== 'ADMIN' && session.user.role !== 'MODERATOR') {
        return NextResponse.redirect(new URL('/403', request.url))
      }
    }

    // Verificar suscripción premium
    if (PREMIUM_ROUTES.some(route => pathname.startsWith(route))) {
      const subscription = session.user.subscription
      
      if (!subscription || subscription.status !== 'ACTIVE') {
        return NextResponse.redirect(new URL('/pricing?upgrade=required', request.url))
      }
      
      if (subscription.expiresAt && new Date() > new Date(subscription.expiresAt)) {
        return NextResponse.redirect(new URL('/pricing?expired=true', request.url))
      }
    }
  }

  // Headers de seguridad
  const response = NextResponse.next()
  
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()')
  
  return response
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
}