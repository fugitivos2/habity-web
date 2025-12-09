'use client'

import { useSimulationUsage } from '@/hooks/useSimulationUsage'
import { AlertCircle, Sparkles, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface UsageBadgeProps {
  showUpgradeButton?: boolean
  size?: 'sm' | 'md' | 'lg'
}

export default function UsageBadge({ showUpgradeButton = false, size = 'md' }: UsageBadgeProps) {
  const { usage, loading } = useSimulationUsage()

  if (loading || !usage) {
    return null
  }

  // Si es ilimitado, mostrar badge especial
  if (usage.isUnlimited) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 rounded-full ${
        size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'
      }`}>
        <Sparkles className={size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'} />
        <span className="font-medium">Simulaciones ilimitadas</span>
      </div>
    )
  }

  // Calcular porcentaje de uso
  const percentage = (usage.used / usage.limit) * 100
  const isNearLimit = percentage >= 80
  const isAtLimit = !usage.canSave

  return (
    <div className="space-y-2">
      {/* Badge principal */}
      <div
        className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
          isAtLimit
            ? 'bg-red-100 text-red-700'
            : isNearLimit
            ? 'bg-yellow-100 text-yellow-700'
            : 'bg-blue-100 text-blue-700'
        } ${size === 'sm' ? 'text-xs' : size === 'md' ? 'text-sm' : 'text-base'}`}
      >
        {isAtLimit && <AlertCircle className={size === 'sm' ? 'h-3 w-3' : size === 'md' ? 'h-4 w-4' : 'h-5 w-5'} />}
        <span className="font-medium">
          {usage.used}/{usage.limit} simulaciones este mes
        </span>
      </div>

      {/* Barra de progreso */}
      {size !== 'sm' && (
        <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              isAtLimit
                ? 'bg-red-500'
                : isNearLimit
                ? 'bg-yellow-500'
                : 'bg-blue-500'
            }`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          />
        </div>
      )}

      {/* Mensaje de upgrade */}
      {isAtLimit && showUpgradeButton && (
        <div className="bg-gradient-to-r from-red-50 to-orange-50 border border-red-200 rounded-lg p-4 mt-3">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-red-900 mb-1">
                Has alcanzado tu límite mensual
              </p>
              <p className="text-xs text-red-700 mb-3">
                Actualiza a <strong>ESCRITURA</strong> para guardar hasta 50 simulaciones/mes, o a <strong>NOTARÍA</strong> para acceso ilimitado.
              </p>
              <Link
                href="/pricing"
                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
              >
                <TrendingUp className="h-4 w-4" />
                Ver Planes y Precios
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Advertencia cuando está cerca del límite */}
      {isNearLimit && !isAtLimit && showUpgradeButton && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-2">
          <p className="text-xs text-yellow-800">
            ⚠️ Te quedan solo <strong>{usage.remaining} simulaciones</strong> este mes.{' '}
            <Link href="/pricing" className="underline font-medium hover:text-yellow-900">
              Considera actualizar tu plan
            </Link>
          </p>
        </div>
      )}
    </div>
  )
}
