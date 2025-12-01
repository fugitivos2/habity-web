'use client'

import { Search, Calculator, FileText, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

const steps = [
  {
    icon: Search,
    number: '01',
    title: 'Explora y busca',
    description: 'Encuentra tu propiedad ideal y guárdala en tu carpeta personal. Conect con profesionales verificados.',
  },
  {
    icon: Calculator,
    number: '02',
    title: 'Simula y calcula',
    description: 'Usa nuestros simuladores para calcular hipoteca, gastos, rentabilidad y ratio de endeudamiento.',
  },
  {
    icon: FileText,
    number: '03',
    title: 'Genera documentación',
    description: 'Crea automáticamente el dossier bancario completo con toda la información necesaria.',
  },
  {
    icon: CheckCircle,
    number: '04',
    title: 'Cierra la operación',
    description: 'Conecta con notarios, gestores y completa la firma con seguimiento completo del proceso.',
  },
]

export default function HowItWorks() {
  return (
    <section id="como-funciona" className="py-24 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            ¿Cómo funciona HABITY?
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            4 pasos simples para ir desde tu sueño inmobiliario hasta las llaves en tu mano
          </p>
        </motion.div>

        {/* Steps */}
        <div className="relative">
          {/* Connection line */}
          <div className="hidden lg:block absolute top-1/2 left-0 right-0 h-1 bg-gradient-to-r from-primary via-secondary to-primary opacity-20 -translate-y-1/2"></div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, index) => (
              <motion.div
                key={step.number}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 hover:border-primary/30 hover:shadow-2xl transition-all duration-300 h-full">
                  {/* Number badge */}
                  <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                    {step.number}
                  </div>

                  {/* Icon */}
                  <div className="mb-6 mt-4">
                    <div className="inline-flex p-4 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                      <step.icon className="w-8 h-8 text-primary" />
                    </div>
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Bottom text */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-16 text-center"
        >
          <p className="text-lg text-gray-600">
            Todo en <strong className="text-primary">una sola plataforma</strong>, sin fragmentación ni pérdidas de información.
          </p>
        </motion.div>
      </div>
    </section>
  )
}
