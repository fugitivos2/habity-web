import { getServerSession } from 'next-auth'
import { authOptions } from '../../lib/auth'
import { redirect } from 'next/navigation'
import { Home, Calculator, FileText, Settings, Users, BarChart3 } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)
  
  if (!session?.user) {
    redirect('/auth/login')
  }

  const { user } = session

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                Bienvenido, <span className="font-medium">{user.name || user.email}</span>
              </span>
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-sm font-medium">
                {user.name ? user.name.charAt(0).toUpperCase() : user.email?.charAt(0).toUpperCase()}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Info Card */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Información de tu cuenta</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-sm text-gray-900">{user.email}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Rol</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.role === 'ADMIN' ? 'bg-red-100 text-red-800' :
                user.role === 'PREMIUM_USER' ? 'bg-yellow-100 text-yellow-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {user.role}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Plan</p>
              <p className="text-sm text-gray-900">
                {user.subscription?.plan || 'LLAVE (Gratuito)'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Estado</p>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                user.emailVerified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
              }`}>
                {user.emailVerified ? 'Verificado' : 'Pendiente verificación'}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {/* Simuladores */}
          <Link href="/simuladores">
            <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow cursor-pointer">
              <div className="p-6">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <Calculator className="h-8 w-8 text-blue-600" />
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Simuladores</h3>
                    <p className="text-sm text-gray-600">
                      Calcula hipotecas, gastos y rentabilidad
                    </p>
                  </div>
                </div>
                <div className="mt-4">
                  <div className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-center font-medium">
                    Ir a Simuladores
                  </div>
                </div>
              </div>
            </div>
          </Link>

          {/* Propiedades */}
          <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <Home className="h-8 w-8 text-green-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Propiedades</h3>
                  <p className="text-sm text-gray-600">
                    Gestiona tus propiedades guardadas
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                  Ver Propiedades
                </button>
              </div>
            </div>
          </div>

          {/* Reportes */}
          <div className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FileText className="h-8 w-8 text-purple-600" />
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">Reportes</h3>
                  <p className="text-sm text-gray-600">
                    Genera reportes y dossieres
                  </p>
                </div>
              </div>
              <div className="mt-4">
                <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
                  Crear Reporte
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Admin Section - Solo para admins */}
        {(user.role === 'ADMIN' || user.role === 'MODERATOR') && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
              <Users className="h-5 w-5 mr-2" />
              Panel de Administración
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button className="bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                Gestionar Usuarios
              </button>
              <button className="bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                Ver Analytics
              </button>
              <button className="bg-white border border-red-200 text-red-700 px-4 py-2 rounded-lg hover:bg-red-50 transition-colors">
                Configuración
              </button>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Simulaciones</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Home className="h-8 w-8 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Propiedades</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <FileText className="h-8 w-8 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Reportes</p>
                <p className="text-2xl font-semibold text-gray-900">0</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Settings className="h-8 w-8 text-gray-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Configuración</p>
                <p className="text-sm text-gray-900">Actualizada</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}