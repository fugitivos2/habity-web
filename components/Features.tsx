'use client'

import { Calculator, Users, FolderOpen, TrendingUp, Shield, Zap } from 'lucide-react'
import { motion } from 'framer-motion'

const features = [
  {
    icon: Calculator,
    title: 'Simuladores Inteligentes',
    description: 'Calcula tu hipoteca, gastos de compra, rentabilidad de inversión y ratio de endeudamiento con precisión profesional.',
    color: 'from-blue-500 to-blue-600',
  },
  {
    icon: FolderOpen,
    title: 'Carpetas Digitales',
    description: 'Organiza documentos, guarda propiedades favoritas y genera dossieres bancarios automáticamente.',
    color: 'from-purple-500 to-purple-600',
  },
  {
    icon: Users,
    title: 'Conecta Profesionales',
    description: 'Accede a brokers, notarios, gestores, tasadores y agencias inmobiliarias verificadas.',
    color: 'from-green-500 to-green-600',
  },
  {
    icon: TrendingUp,
    title: 'Análisis de Inversión',
    description: 'ROI real, cash-flow con costes reales, y proyecciones de rentabilidad a 5, 10 y 20 años.',
    color: 'from-orange-500 to-orange-600',
  },
  {
    icon: Shield,
    title: 'Seguro y Privado',
    description: 'Tus datos están protegidos con encriptación de nivel bancario y cumplimiento GDPR/LOPDGDD.',
    color: 'from-red-500 to-red-600',
  },
  {
    icon: Zap,
    title: 'Rápido y Eficiente',
    description: 'Reduce el tiempo de gestión de semanas a días. Todo centralizado en una sola plataforma.',
    color: 'from-yellow-500 to-yellow-600',
  },
]

export default function Features() {
  return (
    <section id="caracteristicas" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Todo lo que necesitas en una sola app
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            HABITY centraliza el proceso inmobiliario completo: desde la búsqueda hasta la firma, pasando por financiación y gestión documental.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative bg-gradient-to-br from-gray-50 to-white p-8 rounded-2xl border border-gray-200 hover:border-primary/30 hover:shadow-xl transition-all duration-300"
            >
              {/* Icon */}
              <div className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${feature.color} mb-6 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              {/* Content */}
              <h3 className="text-2xl font-bold text-gray-900 mb-3 group-hover:text-primary transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-600 leading-relaxed">
                {feature.description}
              </p>

              {/* Hover effect border */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-primary/0 via-primary/0 to-secondary/0 group-hover:from-primary/5 group-hover:via-primary/5 group-hover:to-secondary/5 transition-all duration-300 pointer-events-none"></div>
            </motion.div>
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600 mb-6">
            ¿Quieres ver cómo funciona? Prueba nuestros simuladores gratuitos
          </p>
          <a
            href="#simuladores"
            className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-primary hover:bg-primary-dark text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            Probar Simuladores →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
