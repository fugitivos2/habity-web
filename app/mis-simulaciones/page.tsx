'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useSimulations } from '@/hooks/useSimulations'
import {
  Search,
  Filter,
  Trash2,
  Edit2,
  Star,
  ExternalLink,
  Calendar,
  Home,
  Receipt,
  CreditCard,
  DollarSign,
  Hammer,
  Loader2,
  AlertCircle,
  ChevronLeft,
  MoreVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Label } from '@/components/ui/label'

// Tipos de simuladores
const SIMULATOR_TYPES = {
  HIPOTECA: { 
    name: 'Hipoteca', 
    icon: Home, 
    color: 'blue',
    url: '/simuladores?tab=mortgage'
  },
  GASTOS_COMPRA: { 
    name: 'Gastos de Compra', 
    icon: Receipt, 
    color: 'green',
    url: '/simuladores?tab=purchase'
  },
  RATIO_ENDEUDAMIENTO: { 
    name: 'Capacidad de Deuda', 
    icon: CreditCard, 
    color: 'orange',
    url: '/simuladores?tab=debt'
  },
  FISCAL: { 
    name: 'Calculadora Fiscal', 
    icon: DollarSign, 
    color: 'purple',
    url: '/simuladores?tab=tax'
  },
  REFORMA: { 
    name: 'Reforma', 
    icon: Hammer, 
    color: 'red',
    url: '/simuladores?tab=renovation'
  },
} as const

type SimulationType = keyof typeof SIMULATOR_TYPES

export default function MisSimulacionesPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { 
    simulations, 
    loading, 
    error, 
    loadSimulations, 
    deleteSimulation, 
    updateSimulation 
  } = useSimulations()

  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState<string>('all')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [selectedSimulation, setSelectedSimulation] = useState<any>(null)
  const [editName, setEditName] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/mis-simulaciones')
    }
  }, [status, router])

  // Cargar simulaciones al montar
  useEffect(() => {
    if (status === 'authenticated') {
      loadSimulations()
    }
  }, [status])

  // Filtrar simulaciones
  const filteredSimulations = simulations.filter((sim) => {
    const matchesSearch = sim.name?.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesFilter = filterType === 'all' || sim.type === filterType
    return matchesSearch && matchesFilter
  })

  // Handlers
  const handleDelete = async () => {
    if (!selectedSimulation) return
    
    setIsDeleting(true)
    const success = await deleteSimulation(selectedSimulation.id)
    setIsDeleting(false)
    
    if (success) {
      setShowDeleteDialog(false)
      setSelectedSimulation(null)
    }
  }

  const handleEdit = async () => {
    if (!selectedSimulation || !editName.trim()) return
    
    setIsUpdating(true)
    const success = await updateSimulation(selectedSimulation.id, {
      name: editName.trim()
    })
    setIsUpdating(false)
    
    if (success) {
      setShowEditDialog(false)
      setSelectedSimulation(null)
      setEditName('')
    }
  }

  const handleToggleFavorite = async (simulation: any) => {
    await updateSimulation(simulation.id, {
      isFavorite: !simulation.isFavorite
    })
  }

  const openEditDialog = (simulation: any) => {
    setSelectedSimulation(simulation)
    setEditName(simulation.name || '')
    setShowEditDialog(true)
  }

  const openDeleteDialog = (simulation: any) => {
    setSelectedSimulation(simulation)
    setShowDeleteDialog(true)
  }

  // Loading state
  if (status === 'loading' || loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando simulaciones...</p>
        </div>
      </div>
    )
  }

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
        {/* Título y estadísticas */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Mis Simulaciones
          </h1>
          <p className="text-gray-600">
            Gestiona todas tus simulaciones guardadas ({filteredSimulations.length} {filteredSimulations.length === 1 ? 'resultado' : 'resultados'})
          </p>
        </div>

        {/* Filtros y búsqueda */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-6 border border-gray-200">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Búsqueda */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Buscar por nombre..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filtro por tipo */}
            <div className="sm:w-64">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="w-full">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos los tipos</SelectItem>
                  {Object.entries(SIMULATOR_TYPES).map(([key, value]) => (
                    <SelectItem key={key} value={key}>
                      {value.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6 flex items-center gap-3">
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Lista de simulaciones */}
        {filteredSimulations.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center border border-gray-200">
            <div className="max-w-md mx-auto">
              <div className="h-16 w-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No hay simulaciones
              </h3>
              <p className="text-gray-600 mb-6">
                {searchQuery || filterType !== 'all' 
                  ? 'No se encontraron simulaciones con esos criterios.'
                  : 'Aún no has guardado ninguna simulación. Crea tu primera simulación en los simuladores.'}
              </p>
              <Link href="/simuladores">
                <Button className="gap-2">
                  <ExternalLink className="h-4 w-4" />
                  Ir a Simuladores
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSimulations.map((simulation) => {
              const simType = SIMULATOR_TYPES[simulation.type as SimulationType]
              const Icon = simType?.icon || Home

              return (
                <div
                  key={simulation.id}
                  className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow border border-gray-200 overflow-hidden"
                >
                  {/* Header de la tarjeta */}
                  <div className={`h-2 bg-${simType?.color || 'gray'}-500`} />
                  
                  <div className="p-6">
                    {/* Icono y tipo */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <div className={`h-10 w-10 bg-${simType?.color || 'gray'}-100 rounded-lg flex items-center justify-center`}>
                          <Icon className={`h-5 w-5 text-${simType?.color || 'gray'}-600`} />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500">{simType?.name || simulation.type}</p>
                          <h3 className="font-semibold text-gray-900 line-clamp-1">
                            {simulation.name || 'Sin nombre'}
                          </h3>
                        </div>
                      </div>
                      
                      {/* Botón favorito */}
                      <button
                        onClick={() => handleToggleFavorite(simulation)}
                        className="p-1 hover:bg-gray-100 rounded transition-colors"
                      >
                        <Star
                          className={`h-5 w-5 ${
                            simulation.isFavorite
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-400'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Fecha */}
                    <div className="flex items-center text-xs text-gray-500 mb-4">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(simulation.updatedAt).toLocaleDateString('es-ES', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>

                    {/* Notas (si existen) */}
                    {simulation.notes && (
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                        {simulation.notes}
                      </p>
                    )}

                    {/* Acciones */}
                    <div className="flex items-center gap-2 pt-4 border-t border-gray-100">
                      <Link href={simType?.url || '/simuladores'} className="flex-1">
                        <Button variant="default" size="sm" className="w-full gap-2">
                          <ExternalLink className="h-4 w-4" />
                          Abrir
                        </Button>
                      </Link>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditDialog(simulation)}
                        className="gap-2"
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openDeleteDialog(simulation)}
                        className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Diálogo de Editar */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Editar Simulación</DialogTitle>
            <DialogDescription>
              Cambia el nombre de tu simulación
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Nombre de la simulación</Label>
              <Input
                id="edit-name"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Ej: Hipoteca piso Madrid 250k"
                onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancelar
            </Button>
            <Button onClick={handleEdit} disabled={!editName.trim() || isUpdating}>
              {isUpdating ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Guardando...
                </>
              ) : (
                'Guardar cambios'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Diálogo de Eliminar */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>¿Eliminar simulación?</DialogTitle>
            <DialogDescription>
              Esta acción no se puede deshacer. La simulación será eliminada permanentemente.
            </DialogDescription>
          </DialogHeader>
          
          {selectedSimulation && (
            <div className="bg-gray-50 rounded-lg p-4 my-4">
              <p className="font-medium text-gray-900 mb-1">
                {selectedSimulation.name || 'Sin nombre'}
              </p>
              <p className="text-sm text-gray-600">
                {SIMULATOR_TYPES[selectedSimulation.type as SimulationType]?.name || selectedSimulation.type}
              </p>
            </div>
          )}

          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteDialog(false)}
              disabled={isDeleting}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Eliminando...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
