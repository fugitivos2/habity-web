'use client'

import { Check, Star } from 'lucide-react'
import { motion } from 'framer-motion'

const plans = [
  {
    name: 'LLAVE',
    tagline: 'Para empezar',
    price: 'Gratis',
    period: 'Siempre',
    description: 'Perfecto para exploradores y primeros compradores',
    features: [
      'Simuladores básicos (hipoteca, gastos)',
      'Hasta 5 propiedades guardadas',
      '1 carpeta personal',
      'Exportar PDF básico',
      'Soporte por email',
    ],
    cta: 'Comenzar Gratis',
    popular: false,
    gradient: 'from-gray-100 to-gray-200',
    borderColor: 'border-gray-300',
  },
  {
    name: 'ESCRITURA',
    tagline: 'Más vendido',
    price: '7.99€',
    period: '/mes',
    description: 'Ideal para compradores serios e inversores principiantes',
    features: [
      'Todo en LLAVE +',
      'Simuladores avanzados (ROI, ratio)',
      'Propiedades ilimitadas',
      'Carpetas ilimitadas',
      'Dossier bancario automatizado',
      'CRM básico (propiedades, visitas)',
      'Sincronización calendario',
      'Soporte prioritario',
    ],
    cta: 'Probar 14 días gratis',
    popular: true,
    gradient: 'from-primary to-blue-600',
    borderColor: 'border-primary',
  },
  {
    name: 'NOTARÍA',
    tagline: 'Profesional',
    price: '15.99€',
    period: '/mes',
    description: 'Para inversores profesionales y agencias',
    features: [
      'Todo en ESCRITURA +',
      'CRM profesional completo',
      'Gestión de múltiples clientes',
      'Análisis comparativo avanzado',
      'Reportes personalizados',
      'API integración (próximamente)',
      'Soporte 24/7 prioritario',
      'Consultoría mensual incluida',
    ],
    cta: 'Contactar Ventas',
    popular: false,
    gradient: 'from-amber-400 to-orange-500',
    borderColor: 'border-amber-400',
  },
]

export default function Pricing() {
  return (
    <section id="precios" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Precios transparentes para todos
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tu etapa inmobiliaria
          </p>
          <div className="inline-flex items-center gap-2 mt-6 px-4 py-2 bg-secondary/10 rounded-full">
            <Star className="w-5 h-5 text-secondary fill-secondary" />
            <span className="text-sm font-medium text-gray-700">14 días de prueba gratis • Sin tarjeta de crédito</span>
          </div>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative bg-white rounded-2xl border-2 ${plan.borderColor} p-8 ${
                plan.popular ? 'shadow-2xl scale-105 lg:scale-110' : 'shadow-lg'
              } hover:shadow-2xl transition-all duration-300`}
            >
              {/* Popular badge */}
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-gradient-to-r from-secondary to-green-500 text-white text-sm font-bold rounded-full shadow-lg">
                  ⭐ MÁS POPULAR
                </div>
              )}

              {/* Header */}
              <div className="mb-6">
                <div className={`inline-block px-4 py-1 bg-gradient-to-r ${plan.gradient} rounded-lg mb-4`}>
                  <span className={`text-sm font-bold ${plan.popular ? 'text-white' : 'text-gray-700'}`}>
                    {plan.tagline}
                  </span>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                <p className="text-gray-600 text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">{plan.period}</span>
                </div>
              </div>

              {/* Features */}
              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-5 h-5 bg-secondary/20 rounded-full flex items-center justify-center mt-0.5">
                      <Check className="w-3 h-3 text-secondary" />
                    </div>
                    <span className="text-gray-700 text-sm">{feature}</span>
                  </li>
                ))}
              </ul>

              {/* CTA */}
              <a
                href="#beta"
                className={`block w-full py-4 text-center font-semibold rounded-xl transition-all duration-300 ${
                  plan.popular
                    ? 'bg-gradient-to-r from-primary to-blue-600 text-white shadow-lg hover:shadow-xl hover:scale-105'
                    : 'bg-gray-100 text-gray-900 hover:bg-gray-200'
                }`}
              >
                {plan.cta}
              </a>
            </motion.div>
          ))}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center text-gray-600"
        >
          <p className="mb-2">🎉 <strong>Oferta de lanzamiento:</strong> Todos los planes con 50% de descuento los primeros 6 meses</p>
          <p className="text-sm">¿Eres estudiante, ONG o startup? <a href="#contacto" className="text-primary font-medium hover:underline">Contáctanos</a> para descuentos especiales</p>
        </motion.div>
      </div>
    </section>
  )
}
