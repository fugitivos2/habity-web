'use client'

import Link from 'next/link'
import UsageBadge from '@/components/simulations/UsageBadge'
import { CreditCard } from 'lucide-react'

interface SubscriptionSidebarProps {
  planName: string
  planIcon: string
  planColor: string
  planLimit: number
  expiresAt?: string
}

export default function SubscriptionSidebar({
  planName,
  planIcon,
  planColor,
  planLimit,
  expiresAt,
}: SubscriptionSidebarProps) {
  return (
    <div className="lg:col-span-1">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden sticky top-4">
        {/* Header del Plan */}
        <div className={`bg-gradient-to-br from-${planColor}-500 to-${planColor}-600 text-white p-6`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-3xl">{planIcon}</span>
            <div>
              <h3 className="font-bold text-lg">Plan {planName}</h3>
              <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">Activo</span>
            </div>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-6">
          {/* Badge de Uso con barra de progreso */}
          <div className="mb-6">
            <UsageBadge showUpgradeButton={true} size="md" />
          </div>

          {/* Fecha de renovación */}
          {expiresAt && (
            <div className="flex items-center justify-between text-sm mb-4 pb-4 border-b border-gray-200">
              <span className="text-gray-600">Renovación:</span>
              <span className="font-semibold text-gray-900">
                {new Date(expiresAt).toLocaleDateString('es-ES')}
              </span>
            </div>
          )}

          {/* Botones de acción */}
          <div className="space-y-2">
            <Link
              href="/pricing"
              className={`block w-full text-center py-2.5 px-4 bg-${planColor}-600 hover:bg-${planColor}-700 text-white rounded-lg font-medium transition-colors`}
            >
              {planName === 'Notaría' ? 'Ver características' : 'Mejorar plan'}
            </Link>
            
            <Link
              href="/suscripcion"
              className="block w-full text-center py-2.5 px-4 border-2 border-gray-200 hover:border-gray-300 text-gray-700 rounded-lg font-medium transition-colors"
            >
              <CreditCard className="inline-block w-4 h-4 mr-2" />
              Gestionar Suscripción
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
