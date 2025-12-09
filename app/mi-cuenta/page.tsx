'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  User,
  Mail,
  Phone,
  Save,
  Loader2,
  ChevronLeft,
  Camera,
  CheckCircle2,
  FileText,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function MiCuentaPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    bio: '',
  })
  
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [saveSuccess, setSaveSuccess] = useState(false)
  const [error, setError] = useState('')

  // Redirigir si no está autenticado
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/mi-cuenta')
    }
  }, [status, router])

  // Cargar datos del usuario
  useEffect(() => {
    if (session?.user) {
      setIsLoading(true)
      fetch('/api/user/profile')
        .then(res => res.json())
        .then(data => {
          if (data.user) {
            setFormData({
              name: data.user.name || '',
              email: data.user.email || '',
              firstName: data.user.firstName || '',
              lastName: data.user.lastName || '',
              phone: data.user.phone || '',
              bio: data.user.bio || '',
            })
          }
        })
        .catch(err => console.error('Error loading profile:', err))
        .finally(() => setIsLoading(false))
    }
  }, [session])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
    if (error) setError('')
    if (saveSuccess) setSaveSuccess(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')

    try {
      // Construir nombre completo a partir de firstName + lastName
      const fullName = `${formData.firstName.trim()} ${formData.lastName.trim()}`
      
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          name: fullName, // Asegurar que name se actualice
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al guardar')
      }

      // Actualizar sesión con el nuevo nombre completo
      if (fullName !== session?.user?.name) {
        await update({ name: fullName })
      }

      setSaveSuccess(true)
      setTimeout(() => setSaveSuccess(false), 3000)
    } catch (err: any) {
      setError(err.message || 'Error al guardar los cambios')
    } finally {
      setIsSaving(false)
    }
  }

  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600">Cargando perfil...</p>
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mi Cuenta</h1>
          <p className="text-gray-600">Gestiona tu información personal y preferencias</p>
        </div>

        {/* Avatar Section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6 border border-gray-200">
          <div className="flex items-center space-x-6">
            <div className="relative">
              <div className="h-24 w-24 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-3xl font-bold shadow-lg">
                {formData.name ? formData.name.charAt(0).toUpperCase() : formData.email?.charAt(0).toUpperCase()}
              </div>
              {/* Botón de cámara deshabilitado por ahora */}
              <button 
                type="button"
                disabled
                className="absolute bottom-0 right-0 h-8 w-8 bg-gray-100 rounded-full border-2 border-gray-300 flex items-center justify-center cursor-not-allowed opacity-50"
                title="Próximamente: subir foto de perfil"
              >
                <Camera className="h-4 w-4 text-gray-400" />
              </button>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {formData.firstName && formData.lastName 
                  ? `${formData.firstName} ${formData.lastName}` 
                  : formData.name || 'Sin nombre'}
              </h3>
              <p className="text-sm text-gray-600">{formData.email}</p>
              <p className="text-xs text-gray-500 mt-1">Miembro desde {new Date(session?.user?.emailVerified || Date.now()).getFullYear()}</p>
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 flex items-center">
              <User className="h-5 w-5 mr-2 text-gray-500" />
              Información Personal
            </h2>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {/* Nombre y Apellidos */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="firstName">Nombre *</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleChange}
                  placeholder="Juan"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Apellidos *</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  type="text"
                  value={formData.lastName}
                  onChange={handleChange}
                  placeholder="Pérez García"
                  required
                />
              </div>
            </div>

            {/* Teléfono */}
            <div className="space-y-2">
              <Label htmlFor="phone">Teléfono</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="+34 600 000 000"
                  className="pl-10"
                />
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-2">
              <Label htmlFor="bio">Biografía</Label>
              <div className="relative">
                <FileText className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <textarea
                  id="bio"
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  placeholder="Cuéntanos un poco sobre ti..."
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent min-h-[100px] resize-y"
                  maxLength={500}
                />
              </div>
              <p className="text-xs text-gray-500">
                {formData.bio.length}/500 caracteres
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Success Message */}
            {saveSuccess && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                <CheckCircle2 className="h-5 w-5 mr-2" />
                ¡Cambios guardados correctamente!
              </div>
            )}

            {/* Submit Button */}
            <div className="flex justify-end pt-4 border-t border-gray-200">
              <Button
                type="submit"
                disabled={isSaving}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Guardando...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Guardar Cambios
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  )
}
