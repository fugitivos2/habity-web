'use client'

import { X, Sparkles, Check } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface UpgradeModalProps {
  isOpen: boolean
  onClose: () => void
  currentUsage: number
  currentLimit: number
}

export default function UpgradeModal({ isOpen, onClose, currentUsage, currentLimit }: UpgradeModalProps) {
  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-lg animate-in zoom-in-95 duration-200">
        <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 relative">
            <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white/80 hover:text-white transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">¡Has alcanzado tu límite!</h2>
                <p className="text-blue-100 text-sm mt-1">
                  Has usado {currentUsage}/{currentLimit} simulaciones este mes
                </p>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-6">
            <p className="text-gray-700 mb-6">
              Para continuar guardando simulaciones, actualiza tu plan y desbloquea funcionalidades premium:
            </p>

            {/* Plans Comparison */}
            <div className="space-y-4 mb-6">
              {/* Plan ESCRITURA */}
              <div className="border-2 border-blue-600 rounded-lg p-4 bg-blue-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">📝 Plan ESCRITURA</h3>
                    <p className="text-sm text-gray-600">Más popular</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-blue-600">9.99€</div>
                    <div className="text-xs text-gray-600">por mes</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600" />
                    <span><strong>50 simulaciones/mes</strong></span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Export a PDF</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Comparador de simulaciones</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Gráficos avanzados</span>
                  </li>
                </ul>
              </div>

              {/* Plan NOTARÍA */}
              <div className="border-2 border-purple-600 rounded-lg p-4 bg-purple-50">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">⭐ Plan NOTARÍA</h3>
                    <p className="text-sm text-gray-600">Profesional</p>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-600">19.99€</div>
                    <div className="text-xs text-gray-600">por mes</div>
                  </div>
                </div>
                <ul className="space-y-2">
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600" />
                    <span><strong>Simulaciones ilimitadas</strong></span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Todo lo de ESCRITURA, más:</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Análisis multi-propiedad</span>
                  </li>
                  <li className="flex items-center gap-2 text-sm text-gray-700">
                    <Check className="h-4 w-4 text-green-600" />
                    <span>Calculadora de rentabilidad</span>
                  </li>
                </ul>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex gap-3">
              <Button variant="outline" onClick={onClose} className="flex-1">
                Tal vez luego
              </Button>
              <Link href="/pricing" className="flex-1">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Ver Todos los Planes
                </Button>
              </Link>
            </div>

            <p className="text-xs text-center text-gray-500 mt-4">
              🎉 14 días de prueba gratis en planes premium
            </p>
          </div>
        </div>
      </div>
    </>
  )
}
