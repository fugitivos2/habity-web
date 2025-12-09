'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import ClientUserMenu from './ClientUserMenu'

export default function DashboardHeader() {
  const pathname = usePathname()

  const isActive = (path: string) => pathname === path

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-8">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              tuHabity
            </Link>
            <nav className="hidden md:flex space-x-6">
              <Link 
                href="/dashboard" 
                className={`font-medium pb-1 transition-colors ${
                  isActive('/dashboard')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Dashboard
              </Link>
              <Link 
                href="/simuladores" 
                className={`font-medium pb-1 transition-colors ${
                  isActive('/simuladores')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Simuladores
              </Link>
              <Link 
                href="/mis-simulaciones" 
                className={`font-medium pb-1 transition-colors ${
                  isActive('/mis-simulaciones')
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                Mis Simulaciones
              </Link>
            </nav>
          </div>
          <ClientUserMenu />
        </div>
      </div>
    </header>
  )
}
