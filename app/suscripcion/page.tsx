import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import {
  ChevronLeft,
  CreditCard,
  Calendar,
  TrendingUp,
  Check,
  Zap,
  Crown,
  Star,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

export default async function SuscripcionPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login?callbackUrl=/suscripcion')
  }

  // Obtener datos de suscripción
  const subscription = await prisma.subscription.findUnique({
    where: { userId: session.user.id }
  })

  // Configuración de planes
  const plans = {
    LLAVE: {
      name: 'Llave',
      icon: '🔑',
      color: 'gray',
      price: 0,
      interval: 'Gratis',
      limit: 5,
      features: [
        '5 simulaciones al mes',
        'Acceso a todos los simuladores',
        'Guardar simulaciones',
        'Soporte por email',
      ]
    },
    ESCRITURA: {
      name: 'Escritura',
      icon: '📝',
      color: 'blue',
      price: 9.99,
      interval: '/mes',
      limit: 50,
      features: [
        '50 simulaciones al mes',
        'Acceso a todos los simuladores',
        'Guardar simulaciones ilimitadas',
        'Exportar a PDF',
        'Soporte prioritario',
        'Sin publicidad',
      ]
    },
    NOTARIA: {
      name: 'Notaría',
      icon: '⭐',
      color: 'purple',
      price: 29.99,
      interval: '/mes',
      limit: Infinity,
      features: [
        'Simulaciones ilimitadas',
        'Acceso a todos los simuladores',
        'Guardar simulaciones ilimitadas',
        'Exportar a PDF',
        'Comparador de simulaciones',
        'Análisis avanzado',
        'Asesoría personalizada',
        'Soporte 24/7',
        'Sin publicidad',
      ]
    },
  }

  const currentPlan = subscription?.plan ? plans[subscription.plan as keyof typeof plans] : plans.LLAVE
  const simulationsUsed = subscription?.simulationsUsed || 0
  const usagePercentage = currentPlan.limit === Infinity ? 0 : Math.min((simulationsUsed / currentPlan.limit) * 100, 100)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <Link href="/dashboard">
                <Button variant="ghost" size="sm" className="gap-2">
                  <ChevronLeft className="h-4 w-4" />
                  Volver al Dashboard
                </Button>
              </Link>
            </div>
            <Link href="/" className="text-xl font-bold text-blue-600">
              tuHabity
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Plan de Suscripción</h1>
          <p className="text-gray-600">Gestiona tu plan y consulta tu uso mensual</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Plan Actual - Tarjeta Grande */}
          <div className="lg:col-span-2">
            <div className={`bg-gradient-to-br from-${currentPlan.color}-50 to-white rounded-xl shadow-lg p-8 border-2 border-${currentPlan.color}-200`}>
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-4xl">{currentPlan.icon}</span>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Plan {currentPlan.name}</h2>
                      <p className="text-gray-600">Tu plan actual</p>
                    </div>
                  </div>
                </div>
                <span className={`px-4 py-2 bg-${currentPlan.color}-100 text-${currentPlan.color}-800 text-sm font-semibold rounded-full`}>
                  Activo
                </span>
              </div>

              {/* Precio */}
              <div className="mb-6">
                <div className="flex items-baseline gap-2">
                  <span className="text-5xl font-bold text-gray-900">
                    {currentPlan.price === 0 ? 'Gratis' : `€${currentPlan.price}`}
                  </span>
                  {currentPlan.price > 0 && (
                    <span className="text-gray-600">{currentPlan.interval}</span>
                  )}
                </div>
              </div>

              {/* Uso Mensual */}
              <div className="bg-white rounded-lg p-6 mb-6 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-900">Uso este mes</h3>
                  <span className="text-2xl font-bold text-gray-900">
                    {simulationsUsed} / {currentPlan.limit === Infinity ? '∞' : currentPlan.limit}
                  </span>
                </div>
                {currentPlan.limit !== Infinity && (
                  <>
                    <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                      <div 
                        className={`h-3 rounded-full transition-all ${
                          usagePercentage > 80 ? 'bg-red-500' : 
                          usagePercentage > 50 ? 'bg-yellow-500' : 
                          'bg-green-500'
                        }`}
                        style={{ width: `${usagePercentage}%` }}
                      />
                    </div>
                    <p className="text-sm text-gray-600">
                      {currentPlan.limit - simulationsUsed} simulaciones restantes
                    </p>
                  </>
                )}
              </div>

              {/* Fecha de renovación */}
              {subscription?.expiresAt && (
                <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Próxima renovación: {new Date(subscription.expiresAt).toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
              )}

              {/* Características */}
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 mb-3">Características incluidas:</h3>
                <ul className="space-y-2">
                  {currentPlan.features.map((feature, index) => (
                    <li key={index} className="flex items-center gap-2 text-gray-700">
                      <Check className="h-5 w-5 text-green-600 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>

              {/* Botón cambiar plan */}
              {currentPlan.name !== 'Notaría' && (
                <Link href="/pricing">
                  <Button className="w-full gap-2" size="lg">
                    <TrendingUp className="h-5 w-5" />
                    Mejorar mi Plan
                  </Button>
                </Link>
              )}
            </div>
          </div>

          {/* Sidebar - Otros Planes */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <Zap className="h-5 w-5 text-yellow-500" />
                ¿Por qué mejorar?
              </h3>
              <ul className="space-y-3 text-sm text-gray-600">
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Más simulaciones cada mes</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Exporta tus simulaciones a PDF</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Soporte prioritario</span>
                </li>
                <li className="flex items-start gap-2">
                  <Star className="h-4 w-4 text-blue-500 flex-shrink-0 mt-0.5" />
                  <span>Análisis avanzados</span>
                </li>
              </ul>
            </div>

            {/* Historial de pagos */}
            <div className="bg-white rounded-lg shadow-sm p-6 border border-gray-200">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-gray-500" />
                Historial de Pagos
              </h3>
              <p className="text-sm text-gray-500">
                No hay pagos registrados aún
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
