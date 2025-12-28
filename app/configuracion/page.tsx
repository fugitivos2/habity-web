'use client'

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  Settings,
  User,
  Bell,
  Lock,
  Palette,
  Globe,
  Save,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'react-hot-toast'

export default function ConfiguracionPage() {
  const { data: session, status, update } = useSession()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [isSavingPassword, setIsSavingPassword] = useState(false)

  // Estados para preferencias
  const [preferences, setPreferences] = useState({
    theme: 'system',
    language: 'es',
    timezone: 'Europe/Madrid',
    notificationsEnabled: true,
    marketingEmails: false,
    productUpdates: true,
    weeklyDigest: true,
  })

  // Estados para cambio de contraseña
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login?callbackUrl=/configuracion')
    }
  }, [status, router])

  useEffect(() => {
    // Cargar preferencias del usuario
    if (session?.user?.id) {
      fetchUserPreferences()
    }
  }, [session])

  const fetchUserPreferences = async () => {
    try {
      const res = await fetch('/api/user/preferences')
      if (res.ok) {
        const data = await res.json()
        setPreferences(data)
      }
    } catch (error) {
      console.error('Error al cargar preferencias:', error)
    }
  }

  const handleSavePreferences = async () => {
    setIsLoading(true)
    try {
      const res = await fetch('/api/user/preferences', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(preferences),
      })

      if (res.ok) {
        toast.success('Preferencias guardadas correctamente')
        await update() // Actualizar sesión
      } else {
        toast.error('Error al guardar preferencias')
      }
    } catch (error) {
      toast.error('Error al guardar preferencias')
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Las contraseñas no coinciden')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('La contraseña debe tener al menos 8 caracteres')
      return
    }

    setIsSavingPassword(true)
    try {
      const res = await fetch('/api/user/change-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          currentPassword: passwordData.currentPassword,
          newPassword: passwordData.newPassword,
        }),
      })

      if (res.ok) {
        toast.success('Contraseña cambiada correctamente')
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        })
      } else {
        const error = await res.json()
        toast.error(error.error || 'Error al cambiar contraseña')
      }
    } catch (error) {
      toast.error('Error al cambiar contraseña')
    } finally {
      setIsSavingPassword(false)
    }
  }

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    )
  }

  if (!session) {
    return null
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
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center gap-3">
            <Settings className="h-8 w-8" />
            Configuración
          </h1>
          <p className="text-gray-600">Personaliza tu experiencia en tuHabity</p>
        </div>

        <Tabs defaultValue="preferences" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="preferences" className="gap-2">
              <User className="h-4 w-4" />
              Preferencias
            </TabsTrigger>
            <TabsTrigger value="notifications" className="gap-2">
              <Bell className="h-4 w-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="security" className="gap-2">
              <Lock className="h-4 w-4" />
              Seguridad
            </TabsTrigger>
          </TabsList>

          {/* Preferencias Generales */}
          <TabsContent value="preferences">
            <Card>
              <CardHeader>
                <CardTitle>Preferencias Generales</CardTitle>
                <CardDescription>
                  Configura la apariencia y el idioma de la aplicación
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Tema */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Palette className="h-4 w-4" />
                    Tema
                  </Label>
                  <select
                    value={preferences.theme}
                    onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="light">Claro</option>
                    <option value="dark">Oscuro</option>
                    <option value="system">Sistema</option>
                  </select>
                </div>

                {/* Idioma */}
                <div className="space-y-2">
                  <Label className="flex items-center gap-2">
                    <Globe className="h-4 w-4" />
                    Idioma
                  </Label>
                  <select
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="es">Español</option>
                    <option value="en">English</option>
                    <option value="ca">Català</option>
                  </select>
                </div>

                {/* Zona Horaria */}
                <div className="space-y-2">
                  <Label>Zona Horaria</Label>
                  <select
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="Europe/Madrid">España (Madrid)</option>
                    <option value="Europe/London">Reino Unido (Londres)</option>
                    <option value="America/New_York">Estados Unidos (Nueva York)</option>
                    <option value="America/Los_Angeles">Estados Unidos (Los Ángeles)</option>
                  </select>
                </div>

                <Button 
                  onClick={handleSavePreferences} 
                  disabled={isLoading}
                  className="w-full gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Guardar Preferencias
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Notificaciones */}
          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notificaciones</CardTitle>
                <CardDescription>
                  Controla qué notificaciones deseas recibir
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notificaciones generales</Label>
                    <p className="text-sm text-gray-500">
                      Recibe notificaciones sobre tu cuenta
                    </p>
                  </div>
                  <Switch
                    checked={preferences.notificationsEnabled}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, notificationsEnabled: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Emails de marketing</Label>
                    <p className="text-sm text-gray-500">
                      Recibe ofertas y promociones
                    </p>
                  </div>
                  <Switch
                    checked={preferences.marketingEmails}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, marketingEmails: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Actualizaciones de producto</Label>
                    <p className="text-sm text-gray-500">
                      Novedades y nuevas funcionalidades
                    </p>
                  </div>
                  <Switch
                    checked={preferences.productUpdates}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, productUpdates: checked })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Resumen semanal</Label>
                    <p className="text-sm text-gray-500">
                      Recibe un resumen de tu actividad
                    </p>
                  </div>
                  <Switch
                    checked={preferences.weeklyDigest}
                    onCheckedChange={(checked) =>
                      setPreferences({ ...preferences, weeklyDigest: checked })
                    }
                  />
                </div>

                <Button 
                  onClick={handleSavePreferences} 
                  disabled={isLoading}
                  className="w-full gap-2"
                >
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  Guardar Preferencias
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Seguridad */}
          <TabsContent value="security">
            <Card>
              <CardHeader>
                <CardTitle>Cambiar Contraseña</CardTitle>
                <CardDescription>
                  Actualiza tu contraseña periódicamente por seguridad
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Contraseña actual</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwordData.currentPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, currentPassword: e.target.value })
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-password">Nueva contraseña</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, newPassword: e.target.value })
                    }
                  />
                  <p className="text-sm text-gray-500">Mínimo 8 caracteres</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmar nueva contraseña</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) =>
                      setPasswordData({ ...passwordData, confirmPassword: e.target.value })
                    }
                  />
                </div>

                <Button
                  onClick={handleChangePassword}
                  disabled={isSavingPassword}
                  className="w-full gap-2"
                >
                  {isSavingPassword ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Lock className="h-4 w-4" />
                  )}
                  Cambiar Contraseña
                </Button>
              </CardContent>
            </Card>

            {/* Autenticación de dos factores */}
            <Card className="mt-6">
              <CardHeader>
                <CardTitle>Autenticación de Dos Factores</CardTitle>
                <CardDescription>
                  Añade una capa extra de seguridad (Próximamente)
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button disabled variant="outline" className="w-full">
                  Configurar 2FA (Próximamente)
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  )
}
