'use client'

import { ArrowRight, Smartphone } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary via-primary-dark to-blue-900 text-white">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-block mb-4 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full text-sm font-medium">
              🚀 Próximo lanzamiento • Beta disponible
            </div>

            <h1 className="text-5xl lg:text-7xl font-bold mb-6 leading-tight">
              Tu hogar
              <span className="block text-secondary">en números</span>
            </h1>

            <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed">
              La plataforma integral que <strong>conecta tu sueño inmobiliario</strong> con la realidad financiera
            </p>

            <div className="space-y-4 mb-10">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-lg">Simuladores financieros inteligentes</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-lg">Conecta con profesionales verificados</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-secondary rounded-full flex items-center justify-center">
                  <span className="text-white text-sm">✓</span>
                </div>
                <span className="text-lg">Gestiona todo desde una sola app</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#beta"
                className="group inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-secondary hover:bg-secondary-dark text-white rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105"
              >
                Accede a la Beta Gratis
                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </a>
              <a
                href="#simuladores"
                className="inline-flex items-center justify-center px-8 py-4 text-lg font-semibold bg-white/10 hover:bg-white/20 text-white rounded-xl transition-all duration-300 backdrop-blur-sm border border-white/20"
              >
                Ver Demo
              </a>
            </div>

            {/* Stats */}
            <div className="mt-12 grid grid-cols-3 gap-6 pt-8 border-t border-white/20">
              <div>
                <div className="text-3xl font-bold">500+</div>
                <div className="text-sm text-blue-200">Beta Testers</div>
              </div>
              <div>
                <div className="text-3xl font-bold">4</div>
                <div className="text-sm text-blue-200">Simuladores</div>
              </div>
              <div>
                <div className="text-3xl font-bold">100%</div>
                <div className="text-sm text-blue-200">Gratuito (Beta)</div>
              </div>
            </div>
          </motion.div>

          {/* Right content - App mockup */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden lg:block"
          >
            <div className="relative">
              {/* Phone frame */}
              <div className="relative mx-auto w-[300px] h-[600px] bg-gradient-to-br from-gray-800 to-gray-900 rounded-[3rem] p-3 shadow-2xl">
                {/* Screen */}
                <div className="w-full h-full bg-white rounded-[2.5rem] overflow-hidden">
                  {/* App preview */}
                  <div className="h-full bg-gradient-to-br from-blue-50 to-white p-6 flex flex-col">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-6">
                      <div className="text-2xl font-bold text-primary">HABITY</div>
                      <Smartphone className="w-6 h-6 text-primary" />
                    </div>

                    {/* Cards preview */}
                    <div className="space-y-4 flex-1">
                      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Hipoteca</div>
                        <div className="text-2xl font-bold text-primary">1.250€<span className="text-sm text-gray-500">/mes</span></div>
                      </div>
                      <div className="bg-gradient-to-br from-secondary to-green-400 rounded-2xl p-4 shadow-lg text-white">
                        <div className="text-xs mb-1 opacity-90">ROI Anual</div>
                        <div className="text-2xl font-bold">7.8%</div>
                      </div>
                      <div className="bg-white rounded-2xl p-4 shadow-lg border border-gray-100">
                        <div className="text-xs text-gray-500 mb-1">Gastos totales</div>
                        <div className="text-2xl font-bold text-gray-900">32.500€</div>
                      </div>
                    </div>

                    {/* Bottom navigation */}
                    <div className="flex justify-around pt-4 border-t border-gray-200">
                      <div className="w-10 h-1 bg-primary rounded-full"></div>
                      <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
                      <div className="w-10 h-1 bg-gray-200 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating elements */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 3, repeat: Infinity }}
                className="absolute -top-6 -left-6 bg-white rounded-xl p-3 shadow-xl"
              >
                <div className="text-xs text-gray-500">Ahorro mensual</div>
                <div className="text-lg font-bold text-secondary">+245€</div>
              </motion.div>

              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 3, repeat: Infinity, delay: 1 }}
                className="absolute -bottom-6 -right-6 bg-white rounded-xl p-3 shadow-xl"
              >
                <div className="text-xs text-gray-500">Inversores</div>
                <div className="text-lg font-bold text-primary">1,247</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Wave separator */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white"/>
        </svg>
      </div>
    </section>
  )
}
