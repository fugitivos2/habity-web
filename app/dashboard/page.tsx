import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { redirect } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import Link from 'next/link'
import { 
  Home, 
  Calculator, 
  Clock, 
  TrendingUp, 
  CreditCard,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  Sparkles,
  Shield,
  Building2,
  DollarSign,
  PiggyBank,
  Hammer,
  Receipt
} from 'lucide-react'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  const { user } = session

  // Obtener estadísticas del usuario
  const [simulationsCount, recentSimulations, subscription] = await Promise.all([
    prisma.simulation.count({
      where: { userId: user.id }
    }),
    prisma.simulation.findMany({
      where: { userId: user.id },
      orderBy: { updatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        name: true,
        type: true,
        updatedAt: true,
      }
    }),
    prisma.subscription.findUnique({
      where: { userId: user.id }
    })
  ])

  // Configuración de planes
  const planConfig = {
    LLAVE: { name: 'Llave', limit: 5, color: 'gray', icon: '🔑' },
    ESCRITURA: { name: 'Escritura', limit: 50, color: 'blue', icon: '📝' },
    NOTARIA: { name: 'Notaría', limit: Infinity, color: 'purple', icon: '⭐' },
  }

  const currentPlan = planConfig[subscription?.plan as keyof typeof planConfig] || planConfig.LLAVE
  const simulationsUsed = subscription?.simulationsUsed || 0
  const usagePercentage = currentPlan.limit === Infinity ? 0 : Math.min((simulationsUsed / currentPlan.limit) * 100, 100)

  // Tipos de simuladores con iconos y colores
  const simulatorTypes = {
    HIPOTECA: { name: 'Hipoteca', icon: Home, color: 'blue' },
    GASTOS_COMPRA: { name: 'Gastos de Compra', icon: Receipt, color: 'green' },
    RATIO_ENDEUDAMIENTO: { name: 'Capacidad de Deuda', icon: CreditCard, color: 'orange' },
    FISCAL: { name: 'Calculadora Fiscal', icon: DollarSign, color: 'purple' },
    REFORMA: { name: 'Reforma', icon: Hammer, color: 'red' },
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header con navegación */}
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
                  className="text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
                >
                  Dashboard
                </Link>
                <Link 
                  href="/simuladores" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Simuladores
                </Link>
                <Link 
                  href="/mis-simulaciones" 
                  className="text-gray-600 hover:text-gray-900 transition-colors"
                >
                  Mis Simulaciones
                </Link>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-medium text-gray-900">{user.name || 'Usuario'}</p>
                <p className="text-xs text-gray-500">{currentPlan.icon} {currentPlan.name}</p>
              </div>
              <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-lg font-bold shadow-md">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Bienvenida */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            ¡Hola, {user.name || user.email?.split('@')[0]}! 👋
          </h1>
          <p className="text-gray-600">
            Bienvenido a tu panel de control inmobiliario
          </p>
        </div>

        {/* Estadísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Total Simulaciones */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Simulaciones Guardadas</p>
                <p className="text-3xl font-bold text-gray-900">{simulationsCount}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          {/* Plan Actual */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Plan Actual</p>
                <p className="text-2xl font-bold text-gray-900">{currentPlan.icon} {currentPlan.name}</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Shield className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </div>

          {/* Uso del Plan */}
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">Uso Mensual</p>
                <p className="text-2xl font-bold text-gray-900">
                  {simulationsUsed} / {currentPlan.limit === Infinity ? '∞' : currentPlan.limit}
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
            </div>
            {currentPlan.limit !== Infinity && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all ${
                    usagePercentage > 80 ? 'bg-red-500' : 
                    usagePercentage > 50 ? 'bg-yellow-500' : 
                    'bg-green-500'
                  }`}
                  style={{ width: `${usagePercentage}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Grid: Simuladores + Actividad Reciente */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Acceso Rápido a Simuladores */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900">Simuladores Disponibles</h2>
              <Link 
                href="/simuladores"
                className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center"
              >
                Ver todos <ChevronRight className="h-4 w-4 ml-1" />
              </Link>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Simulador de Hipoteca */}
              <Link href="/simuladores?tab=mortgage">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-blue-300 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center group-hover:bg-blue-600 transition-colors">
                      <Home className="h-6 w-6 text-blue-600 group-hover:text-white transition-colors" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Simulador de Hipoteca</h3>
                  <p className="text-sm text-gray-600">Calcula tu cuota mensual</p>
                </div>
              </Link>

              {/* Gastos de Compra */}
              <Link href="/simuladores?tab=purchase">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-green-300 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center group-hover:bg-green-600 transition-colors">
                      <Receipt className="h-6 w-6 text-green-600 group-hover:text-white transition-colors" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-green-600 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Gastos de Compra</h3>
                  <p className="text-sm text-gray-600">Impuestos y notaría</p>
                </div>
              </Link>

              {/* Capacidad de Deuda */}
              <Link href="/simuladores?tab=debt">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-orange-300 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center group-hover:bg-orange-600 transition-colors">
                      <CreditCard className="h-6 w-6 text-orange-600 group-hover:text-white transition-colors" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-orange-600 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Capacidad de Deuda</h3>
                  <p className="text-sm text-gray-600">¿Cuánto puedes pedir?</p>
                </div>
              </Link>

              {/* Calculadora Fiscal */}
              <Link href="/simuladores?tab=tax">
                <div className="bg-white rounded-xl p-6 border border-gray-100 hover:border-purple-300 hover:shadow-lg transition-all cursor-pointer group">
                  <div className="flex items-start justify-between mb-4">
                    <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center group-hover:bg-purple-600 transition-colors">
                      <DollarSign className="h-6 w-6 text-purple-600 group-hover:text-white transition-colors" />
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-purple-600 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">Calculadora Fiscal</h3>
                  <p className="text-sm text-gray-600">IRPF y plusvalía</p>
                </div>
              </Link>
            </div>

            {/* Calculadora de Reforma (ancho completo) */}
            <Link href="/simuladores?tab=renovation">
              <div className="mt-4 bg-white rounded-xl p-6 border border-gray-100 hover:border-red-300 hover:shadow-lg transition-all cursor-pointer group">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center group-hover:bg-red-600 transition-colors">
                      <Hammer className="h-6 w-6 text-red-600 group-hover:text-white transition-colors" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-1">Calculadora de Reforma</h3>
                      <p className="text-sm text-gray-600">Estima el coste de tu reforma</p>
                    </div>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-red-600 transition-colors" />
                </div>
              </div>
            </Link>
          </div>

          {/* Actividad Reciente + Info Plan */}
          <div className="space-y-6">
            {/* Actividad Reciente */}
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  <Clock className="h-5 w-5 mr-2 text-gray-500" />
                  Actividad Reciente
                </h3>
              </div>
              
              {recentSimulations.length > 0 ? (
                <div className="space-y-3">
                  {recentSimulations.map((sim) => {
                    const simType = simulatorTypes[sim.type as keyof typeof simulatorTypes]
                    const Icon = simType?.icon || FileText
                    return (
                      <div key={sim.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                        <div className={`h-8 w-8 bg-${simType?.color || 'gray'}-100 rounded-lg flex items-center justify-center flex-shrink-0`}>
                          <Icon className={`h-4 w-4 text-${simType?.color || 'gray'}-600`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {sim.name || 'Sin nombre'}
                          </p>
                          <p className="text-xs text-gray-500">
                            {simType?.name || sim.type}
                          </p>
                          <p className="text-xs text-gray-400">
                            {new Date(sim.updatedAt).toLocaleDateString('es-ES')}
                          </p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-sm text-gray-500">No hay simulaciones guardadas aún</p>
                  <Link 
                    href="/simuladores"
                    className="text-sm text-blue-600 hover:text-blue-700 font-medium mt-2 inline-block"
                  >
                    Crear primera simulación
                  </Link>
                </div>
              )}

              {recentSimulations.length > 0 && (
                <Link 
                  href="/mis-simulaciones"
                  className="block text-center text-sm text-blue-600 hover:text-blue-700 font-medium mt-4 pt-4 border-t border-gray-100"
                >
                  Ver todas las simulaciones
                </Link>
              )}
            </div>

            {/* Info del Plan */}
            <div className={`bg-gradient-to-br from-${currentPlan.color}-50 to-${currentPlan.color}-100 rounded-xl p-6 border border-${currentPlan.color}-200`}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-semibold text-gray-900 flex items-center">
                  {currentPlan.icon} Plan {currentPlan.name}
                </h3>
                <span className={`px-3 py-1 bg-${currentPlan.color}-200 text-${currentPlan.color}-800 text-xs font-medium rounded-full`}>
                  Activo
                </span>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-700">Simulaciones este mes:</span>
                  <span className="font-semibold text-gray-900">
                    {simulationsUsed} / {currentPlan.limit === Infinity ? '∞' : currentPlan.limit}
                  </span>
                </div>
                {subscription?.expiresAt && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-700">Renovación:</span>
                    <span className="font-semibold text-gray-900">
                      {new Date(subscription.expiresAt).toLocaleDateString('es-ES')}
                    </span>
                  </div>
                )}
              </div>

              {currentPlan.limit !== Infinity && usagePercentage > 70 && (
                <div className="bg-white rounded-lg p-4 mb-4 border border-yellow-200">
                  <p className="text-sm text-yellow-800 font-medium mb-2">
                    ⚠️ Te estás acercando al límite
                  </p>
                  <p className="text-xs text-yellow-700">
                    Considera mejorar tu plan para acceso ilimitado
                  </p>
                </div>
              )}

              <Link
                href="/pricing"
                className={`block w-full text-center py-2.5 px-4 bg-${currentPlan.color}-600 hover:bg-${currentPlan.color}-700 text-white rounded-lg font-medium transition-colors`}
              >
                {currentPlan.name === 'Notaría' ? 'Ver características' : 'Mejorar plan'}
              </Link>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
