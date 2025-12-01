'use client'

import { useState } from 'react'
import { Mail, ArrowRight, CheckCircle } from 'lucide-react'
import { motion } from 'framer-motion'

export default function CTA() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // TODO: Integrate with email service (Mailchimp/Brevo)
    console.log('Email submitted:', email)
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <section id="beta" className="py-24 bg-gradient-to-br from-primary via-blue-600 to-primary-dark relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          {/* Badge */}
          <div className="inline-block mb-6 px-6 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white font-medium">
            🎉 Lanzamiento Beta • Plazas Limitadas
          </div>

          {/* Headline */}
          <h2 className="text-4xl lg:text-6xl font-bold text-white mb-6 leading-tight">
            Sé de los primeros en
            <span className="block text-secondary">transformar tu experiencia inmobiliaria</span>
          </h2>

          <p className="text-xl text-blue-100 mb-10 max-w-2xl mx-auto">
            Únete a nuestra beta privada y accede gratis a todas las funcionalidades premium durante los primeros 3 meses
          </p>

          {/* Benefits */}
          <div className="flex flex-wrap justify-center gap-6 mb-10">
            <div className="flex items-center gap-2 text-white">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <span>Acceso anticipado</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <span>3 meses premium gratis</span>
            </div>
            <div className="flex items-center gap-2 text-white">
              <CheckCircle className="w-5 h-5 text-secondary" />
              <span>Soporte directo del equipo</span>
            </div>
          </div>

          {/* Email Form */}
          <form onSubmit={handleSubmit} className="max-w-md mx-auto">
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="w-full pl-12 pr-4 py-4 rounded-xl text-gray-900 font-medium focus:outline-none focus:ring-4 focus:ring-secondary/50 transition-all"
                />
              </div>
              <button
                type="submit"
                disabled={submitted}
                className="group px-8 py-4 bg-secondary hover:bg-secondary-dark text-white font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {submitted ? (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    ¡Registrado!
                  </>
                ) : (
                  <>
                    Únete a la Beta
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>
            <p className="text-sm text-blue-200 mt-4">
              Sin tarjeta de crédito • Cancela cuando quieras • GDPR compliant
            </p>
          </form>

          {/* Social proof */}
          <div className="mt-12 pt-8 border-t border-white/20">
            <p className="text-blue-100 mb-4">Ya confían en nosotros:</p>
            <div className="flex flex-wrap justify-center items-center gap-8 opacity-70">
              <div className="text-white font-semibold">500+ Beta Testers</div>
              <div className="w-px h-6 bg-white/30"></div>
              <div className="text-white font-semibold">50+ Profesionales</div>
              <div className="w-px h-6 bg-white/30"></div>
              <div className="text-white font-semibold">15+ Agencias</div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
