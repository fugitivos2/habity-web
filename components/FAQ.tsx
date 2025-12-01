'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

const faqs = [
  {
    question: '¿Qué es HABITY exactamente?',
    answer: 'HABITY es una plataforma integral que centraliza todo el proceso inmobiliario: desde la búsqueda de vivienda hasta la firma, incluyendo simuladores financieros, gestión documental, conexión con profesionales y seguimiento completo. No somos solo un portal inmobiliario ni un simple CRM, somos la infraestructura digital completa para el sector.',
  },
  {
    question: '¿Es realmente gratis?',
    answer: 'Sí, el plan LLAVE es 100% gratuito para siempre e incluye simuladores básicos y funcionalidades esenciales. Durante la beta, todos los usuarios tendrán acceso completo a funcionalidades premium de forma gratuita durante 3 meses. Después, puedes continuar con el plan gratuito o actualizar a ESCRITURA (7.99€/mes) o NOTARÍA (15.99€/mes).',
  },
  {
    question: '¿Cómo ganan dinero si hay un plan gratuito?',
    answer: 'Nuestro modelo de negocio se basa en: 1) Suscripciones premium (ESCRITURA y NOTARÍA) para usuarios avanzados e inversores, 2) Comisiones por leads cualificados a profesionales (brokers, notarios, gestores), 3) Servicios adicionales como seguros y reformas. El plan gratuito nos permite llegar a más usuarios y ofrecer valor desde el inicio.',
  },
  {
    question: '¿Mis datos están seguros?',
    answer: 'Absolutamente. Usamos encriptación de nivel bancario (AES-256) para todos los datos sensibles. Cumplimos 100% con GDPR/LOPDGDD. Tus datos nunca se venden a terceros. Solo compartimos información con profesionales cuando tú explícitamente lo autorizas. Puedes exportar o eliminar tus datos en cualquier momento.',
  },
  {
    question: '¿En qué se diferencia de portales como Idealista o Fotocasa?',
    answer: 'Los portales tradicionales son solo escaparates de propiedades. HABITY va mucho más allá: 1) Incluye simuladores financieros avanzados, 2) Gestiona toda la documentación y proceso legal, 3) Conecta con todos los profesionales necesarios (brokers, notarios, gestores), 4) Automatiza el dossier bancario, 5) Ofrece CRM para seguimiento completo. Somos un ecosistema completo, no solo un listado de pisos.',
  },
  {
    question: '¿Está disponible en mi ciudad?',
    answer: 'HABITY está diseñada para funcionar en toda España desde el día 1. Los simuladores y funcionalidades principales son independientes de la ubicación. La red de profesionales verificados está en constante expansión, empezando por Madrid, Barcelona, Valencia y Málaga, pero puedes usar la app en cualquier ciudad.',
  },
  {
    question: '¿Puedo usarla si soy inversor?',
    answer: 'Sí, HABITY es ideal para inversores. El plan ESCRITURA incluye análisis de ROI, cash-flow con costes reales, y proyecciones a 5, 10 y 20 años. El plan NOTARÍA añade gestión de múltiples propiedades, comparativas avanzadas y reportes personalizados. Muchos inversores profesionales ya están en nuestra beta.',
  },
  {
    question: '¿Necesito conocimientos técnicos para usarla?',
    answer: 'Para nada. HABITY está diseñada para ser intuitiva y accesible para cualquier persona, desde primerizos hasta profesionales. Los simuladores te guían paso a paso, la interfaz es limpia y moderna, y tenemos tutoriales integrados. Si necesitas ayuda, nuestro equipo de soporte está disponible.',
  },
]

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section id="faq" className="py-24 bg-white">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Preguntas Frecuentes
          </h2>
          <p className="text-xl text-gray-600">
            Todo lo que necesitas saber sobre HABITY
          </p>
        </motion.div>

        {/* FAQ Items */}
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="border-2 border-gray-200 rounded-xl overflow-hidden hover:border-primary/30 transition-colors"
            >
              <button
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-gray-50 transition-colors"
              >
                <span className="text-lg font-semibold text-gray-900 pr-4">
                  {faq.question}
                </span>
                <ChevronDown
                  className={`w-6 h-6 text-primary flex-shrink-0 transition-transform duration-300 ${
                    openIndex === index ? 'rotate-180' : ''
                  }`}
                />
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-6 pb-5 text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        {/* Contact CTA */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 text-center bg-gradient-to-r from-blue-50 to-green-50 rounded-2xl p-8"
        >
          <p className="text-lg text-gray-700 mb-4">
            ¿No encuentras la respuesta que buscas?
          </p>
          <a
            href="mailto:hola@tuhabity.com"
            className="inline-flex items-center justify-center px-6 py-3 bg-primary hover:bg-primary-dark text-white font-semibold rounded-xl transition-all duration-300"
          >
            Contáctanos →
          </a>
        </motion.div>
      </div>
    </section>
  )
}
