'use client'

import { useState, useRef, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  User,
  CreditCard,
  Settings,
  LogOut,
  ChevronDown,
  Shield,
} from 'lucide-react'

export default function UserMenu() {
  const { data: session } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  if (!session?.user) return null

  const user = session.user

  // Configuración de planes
  const planConfig = {
    LLAVE: { name: 'Llave', icon: '🔑', color: 'gray' },
    ESCRITURA: { name: 'Escritura', icon: '📝', color: 'blue' },
    NOTARIA: { name: 'Notaría', icon: '⭐', color: 'purple' },
  }

  const currentPlan = user.subscription?.plan 
    ? planConfig[user.subscription.plan as keyof typeof planConfig] 
    : planConfig.LLAVE

  const handleSignOut = async () => {
    await signOut({ callbackUrl: '/' })
  }

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-3 hover:bg-gray-100 rounded-lg px-3 py-2 transition-colors"
      >
        <div className="text-right hidden sm:block">
          <p className="text-sm font-medium text-gray-900">{user.name || 'Usuario'}</p>
          <p className="text-xs text-gray-500">{currentPlan.icon} {currentPlan.name}</p>
        </div>
        <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
          {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
        </div>
        <ChevronDown 
          className={`h-4 w-4 text-gray-600 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} 
        />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* User Info */}
          <div className="px-4 py-3 border-b border-gray-100">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {user.name || user.email?.split('@')[0]}
            </p>
            <p className="text-xs text-gray-500 truncate">{user.email}</p>
            <div className="mt-2 flex items-center gap-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-${currentPlan.color}-100 text-${currentPlan.color}-800`}>
                {currentPlan.icon} {currentPlan.name}
              </span>
              {user.role === 'ADMIN' && (
                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                  <Shield className="h-3 w-3 mr-1" />
                  Admin
                </span>
              )}
            </div>
          </div>

          {/* Menu Items */}
          <div className="py-1">
            <Link
              href="/mi-cuenta"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <User className="h-4 w-4 mr-3 text-gray-500" />
              Mi Cuenta
            </Link>

            <Link
              href="/suscripcion"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <CreditCard className="h-4 w-4 mr-3 text-gray-500" />
              Plan de Suscripción
            </Link>

            <Link
              href="/configuracion"
              onClick={() => setIsOpen(false)}
              className="flex items-center px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <Settings className="h-4 w-4 mr-3 text-gray-500" />
              Configuración
            </Link>
          </div>

          {/* Logout */}
          <div className="border-t border-gray-100 pt-1">
            <button
              onClick={handleSignOut}
              className="flex items-center w-full px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="h-4 w-4 mr-3" />
              Cerrar Sesión
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
