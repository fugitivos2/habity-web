'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'
import Image from 'next/image'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white rounded-sm relative">
                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[6px] border-l-transparent border-r-transparent border-b-white"></div>
              </div>
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-gray-900">HABITY</span>
              <span className="text-xs text-gray-500 -mt-1">Los números hablan, tú decides</span>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <a href="#features" className="text-gray-700 hover:text-primary transition-colors">
              Características
            </a>
            <a href="#simuladores" className="text-gray-700 hover:text-primary transition-colors">
              Simuladores
            </a>
            <a href="#pricing" className="text-gray-700 hover:text-primary transition-colors">
              Precios
            </a>
            <a href="#faq" className="text-gray-700 hover:text-primary transition-colors">
              FAQ
            </a>
            <div className="flex items-center gap-3">
              <a
                href="/auth/login"
                className="text-gray-700 hover:text-primary font-medium transition-colors px-4 py-2"
              >
                Accede
              </a>
              <a
                href="/auth/register"
                className="bg-primary hover:bg-primary-dark text-white px-6 py-2 rounded-lg font-medium transition-colors shadow-sm hover:shadow-md"
              >
                Regístrate
              </a>
            </div>
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-200">
            <div className="flex flex-col gap-4">
              <a
                href="#features"
                className="text-gray-700 hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Características
              </a>
              <a
                href="#simuladores"
                className="text-gray-700 hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Simuladores
              </a>
              <a
                href="#pricing"
                className="text-gray-700 hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Precios
              </a>
              <a
                href="#faq"
                className="text-gray-700 hover:text-primary transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </a>
              <div className="flex flex-col gap-3 pt-2 border-t border-gray-200">
                <a
                  href="/auth/login"
                  className="text-center text-gray-700 hover:text-primary font-medium transition-colors py-2 border border-gray-300 rounded-lg"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Accede
                </a>
                <a
                  href="/auth/register"
                  className="text-center bg-primary hover:bg-primary-dark text-white px-6 py-3 rounded-lg font-medium transition-colors w-full"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Regístrate
                </a>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}
