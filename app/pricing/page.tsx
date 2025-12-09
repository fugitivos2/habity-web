'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import {
  Check,
  X,
  Sparkles,
  Building2,
  Calculator,
  TrendingUp,
  FileText,
  BarChart3,
  Zap,
  Lock,
  CreditCard,
  Mail,
  Globe,
} from 'lucide-react'
import { Button } from '@/components/ui/button'

type BillingPeriod = 'monthly' | 'annual'

export default function PricingPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [billingPeriod, setBillingPeriod] = useState<BillingPeriod>('monthly')

  const plans = [
    {
      id: 'LLAVE',
      name: 'Llave',
      icon: '🔑',
      price: 0,
      priceAnnual: 0,
      description: 'Para explorar el mercado inmobiliario',
      badge: null,
      features: [
        { text: '5 simulaciones guardadas/mes', included: true },
        { text: 'Todos los simuladores', included: true },
        { text: 'Calculadora de Hipoteca', included: true },
        { text: 'Gastos de Compra', included: true },
        { text: 'Capacidad de Endeudamiento', included: true },
        { text: 'Impuestos (Plusvalía)', included: true },
        { text: 'Calculadora de Reforma', included: true },
        { text: 'Guardar y recuperar simulaciones', included: true },
        { text: 'Export a PDF', included: false },
        { text: 'Comparador de simulaciones', included: false },
        { text: 'Gráficos avanzados', included: false },
        { text: 'Análisis de escenarios', included: false },
      ],
      cta: 'Empezar Gratis',
      ctaVariant: 'outline' as const,
      highlight: false,
    },
    {
      id: 'ESCRITURA',
      name: 'Escritura',
      icon: '📝',
      price: 9.99,
      priceOriginal: 14.99,
      priceAnnual: 99,
      priceAnnualOriginal: 149,
      description: 'Para compradores activos y profesionales',
      badge: '⭐ MÁS POPULAR',
      features: [
        { text: '50 simulaciones guardadas/mes', included: true },
        { text: 'Todo lo del plan LLAVE, más:', included: true, bold: true },
        { text: 'Export de simulaciones a PDF', included: true },
        { text: 'Comparador de simulaciones (2 props)', included: true },
        { text: 'Historial completo de cambios', included: true },
        { text: 'Notas y etiquetas personalizadas', included: true },
        { text: 'Gráficos avanzados de amortización', included: true },
        { text: 'Análisis de escenarios (¿Qué pasa si...?)', included: true },
        { text: 'Dashboard analítico con insights', included: true },
        { text: 'Gestión multi-propiedad', included: false },
        { text: 'Calculadora de rentabilidad', included: false },
      ],
      cta: 'Probar 14 días gratis',
      ctaVariant: 'default' as const,
      highlight: true,
    },
    {
      id: 'NOTARIA',
      name: 'Notaría',
      icon: '⭐',
      price: 19.99,
      priceOriginal: 29.99,
      priceAnnual: 199,
      priceAnnualOriginal: 299,
      description: 'Para inversores y gestores de carteras',
      badge: '👑 PROFESIONAL',
      features: [
        { text: 'Simulaciones ilimitadas', included: true },
        { text: 'Todo lo del plan ESCRITURA, más:', included: true, bold: true },
        { text: 'Análisis multi-propiedad (cartera completa)', included: true },
        { text: 'Comparador de hasta 10 propiedades', included: true },
        { text: 'Calculadora de rentabilidad (TIR, VAN, Cashflow)', included: true },
        { text: 'Informes profesionales con branding', included: true },
        { text: 'Alertas automáticas de mercado', included: true },
        { text: 'Acceso anticipado a nuevas funciones', included: true },
        { text: 'API access (próximamente)', included: true },
        { text: 'Sin límites de guardado', included: true },
      ],
      cta: 'Probar 14 días gratis',
      ctaVariant: 'default' as const,
      highlight: false,
    },
  ]

  const handleSelectPlan = (planId: string) => {
    if (planId === 'LLAVE') {
      // Plan gratuito: redirigir a registro o dashboard
      if (session) {
        router.push('/dashboard')
      } else {
        router.push('/auth/register')
      }
    } else {
      // Planes de pago: redirigir a checkout (próximamente)
      // TODO: Integrar Stripe Checkout
      alert(`Checkout para plan ${planId} - Próximamente con Stripe`)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link href="/" className="text-2xl font-bold text-blue-600">
              tuHabity
            </Link>
            <div className="flex items-center gap-4">
              {session ? (
                <Link href="/dashboard">
                  <Button variant="outline">Ir al Dashboard</Button>
                </Link>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="ghost">Iniciar Sesión</Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button>Registrarse</Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="inline-flex items-center px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-sm font-medium mb-6">
          <Sparkles className="h-4 w-4 mr-2" />
          Lanzamiento especial: 33% de descuento
        </div>
        
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Elige el plan perfecto para ti
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Transparencia total. Sin sorpresas. Cancela cuando quieras.
        </p>

        {/* Billing Period Toggle */}
        <div className="flex items-center justify-center gap-4 mb-12">
          <button
            onClick={() => setBillingPeriod('monthly')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              billingPeriod === 'monthly'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Mensual
          </button>
          <button
            onClick={() => setBillingPeriod('annual')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              billingPeriod === 'annual'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
            }`}
          >
            Anual
            <span className="ml-2 text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
              Ahorra 17%
            </span>
          </button>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative bg-white rounded-2xl shadow-lg border-2 transition-all duration-300 hover:shadow-xl ${
                plan.highlight
                  ? 'border-blue-600 scale-105'
                  : 'border-gray-200 hover:border-blue-300'
              }`}
            >
              {/* Badge */}
              {plan.badge && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  {plan.badge}
                </div>
              )}

              <div className="p-8">
                {/* Plan Header */}
                <div className="text-center mb-6">
                  <div className="text-4xl mb-3">{plan.icon}</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {plan.name}
                  </h3>
                  <p className="text-sm text-gray-600">{plan.description}</p>
                </div>

                {/* Price */}
                <div className="text-center mb-6">
                  {plan.price === 0 ? (
                    <div className="text-5xl font-bold text-gray-900">Gratis</div>
                  ) : (
                    <>
                      {billingPeriod === 'monthly' ? (
                        <>
                          {plan.priceOriginal && (
                            <div className="text-lg text-gray-400 line-through">
                              {plan.priceOriginal}€/mes
                            </div>
                          )}
                          <div className="text-5xl font-bold text-gray-900">
                            {plan.price}€
                            <span className="text-xl text-gray-600">/mes</span>
                          </div>
                        </>
                      ) : (
                        <>
                          {plan.priceAnnualOriginal && (
                            <div className="text-lg text-gray-400 line-through">
                              {plan.priceAnnualOriginal}€/año
                            </div>
                          )}
                          <div className="text-5xl font-bold text-gray-900">
                            {plan.priceAnnual}€
                            <span className="text-xl text-gray-600">/año</span>
                          </div>
                          <div className="text-sm text-green-600 font-medium mt-1">
                            {(plan.priceAnnual! / 12).toFixed(2)}€/mes
                          </div>
                        </>
                      )}
                    </>
                  )}
                </div>

                {/* CTA Button */}
                <Button
                  onClick={() => handleSelectPlan(plan.id)}
                  variant={plan.ctaVariant}
                  className="w-full mb-6"
                  size="lg"
                >
                  {plan.cta}
                </Button>

                {/* Features */}
                <ul className="space-y-3">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-3">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                      ) : (
                        <X className="h-5 w-5 text-gray-300 flex-shrink-0 mt-0.5" />
                      )}
                      <span
                        className={`text-sm ${
                          feature.included ? 'text-gray-700' : 'text-gray-400'
                        } ${'bold' in feature && feature.bold ? 'font-semibold' : ''}`}
                      >
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Comparison Table */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Comparativa detallada
        </h2>
        
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900">
                    Característica
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    🔑 Llave
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900 bg-blue-50">
                    📝 Escritura
                  </th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-900">
                    ⭐ Notaría
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Precio</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">Gratis</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700 bg-blue-50">9.99€/mes</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">19.99€/mes</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Simulaciones/mes</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">5</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700 bg-blue-50">50</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">∞ Ilimitadas</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Todos los simuladores</td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-blue-50"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Export PDF</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-blue-50"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Comparador</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-blue-50 text-sm text-gray-700">2 props</td>
                  <td className="px-6 py-4 text-center text-sm text-gray-700">10 props</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Gráficos avanzados</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-blue-50"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Análisis de escenarios</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-blue-50"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Multi-propiedad</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-blue-50"><X className="h-5 w-5 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Calculadora rentabilidad</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-blue-50"><X className="h-5 w-5 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">Alertas automáticas</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-blue-50"><X className="h-5 w-5 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-green-600 mx-auto" /></td>
                </tr>
                <tr>
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">API access</td>
                  <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center bg-blue-50"><X className="h-5 w-5 text-gray-300 mx-auto" /></td>
                  <td className="px-6 py-4 text-center text-sm text-gray-600">Próximamente</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
          Preguntas Frecuentes
        </h2>
        
        <div className="space-y-6">
          <details className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 group">
            <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
              ¿Puedo cambiar de plan en cualquier momento?
              <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 text-sm">
              Sí, puedes actualizar o degradar tu plan cuando quieras. Los cambios se aplican inmediatamente y el precio se ajusta proporcionalmente.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 group">
            <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
              ¿Qué pasa si supero mi límite de simulaciones?
              <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 text-sm">
              En el plan LLAVE, no podrás guardar más simulaciones hasta el próximo mes. En ESCRITURA, cuando llegues a 50, te sugeriremos actualizar a NOTARÍA para acceso ilimitado.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 group">
            <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
              ¿Hay prueba gratuita?
              <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 text-sm">
              Sí, los planes ESCRITURA y NOTARÍA tienen <strong>14 días de prueba gratis</strong>. No se te cobrará hasta que termine la prueba. Puedes cancelar en cualquier momento.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 group">
            <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
              ¿Cómo cancelo mi suscripción?
              <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 text-sm">
              Puedes cancelar desde tu panel de Suscripción en cualquier momento. Seguirás teniendo acceso hasta el final de tu período de facturación actual.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 group">
            <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
              ¿Los precios incluyen IVA?
              <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 text-sm">
              Sí, todos los precios mostrados incluyen el 21% de IVA español.
            </p>
          </details>

          <details className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 group">
            <summary className="font-semibold text-gray-900 cursor-pointer flex items-center justify-between">
              ¿Ofrecen factura?
              <span className="ml-4 flex-shrink-0 text-gray-400 group-open:rotate-180 transition-transform">▼</span>
            </summary>
            <p className="mt-4 text-gray-600 text-sm">
              Sí, recibirás una factura automática por email cada mes. Puedes descargar todas tus facturas desde tu panel de Suscripción.
            </p>
          </details>
        </div>
      </section>

      {/* Trust Section */}
      <section className="bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="flex flex-col items-center">
              <Lock className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Pago seguro</p>
              <p className="text-xs text-gray-600">con Stripe</p>
            </div>
            <div className="flex flex-col items-center">
              <CreditCard className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Todas las tarjetas</p>
              <p className="text-xs text-gray-600">Visa, Mastercard, Amex</p>
            </div>
            <div className="flex flex-col items-center">
              <Zap className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Cancela cuando quieras</p>
              <p className="text-xs text-gray-600">Sin permanencia</p>
            </div>
            <div className="flex flex-col items-center">
              <Mail className="h-8 w-8 text-blue-600 mb-2" />
              <p className="text-sm font-medium text-gray-900">Soporte en español</p>
              <p className="text-xs text-gray-600">Email y chat</p>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          ¿Listo para tomar decisiones inmobiliarias más inteligentes?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Únete a cientos de usuarios que ya están usando tuHabity para sus inversiones inmobiliarias.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              Empezar Gratis - Plan LLAVE
            </Button>
          </Link>
          <Button
            size="lg"
            variant="outline"
            onClick={() => handleSelectPlan('ESCRITURA')}
          >
            Probar 14 días - Plan ESCRITURA
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-gray-400">
            © 2024 tuHabity. Todos los derechos reservados.
          </p>
        </div>
      </footer>
    </div>
  )
}
