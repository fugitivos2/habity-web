'use client'

import { useState } from 'react'
import { Home, Calculator, TrendingUp, PiggyBank } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Simulators() {
  const [mortgage, setMortgage] = useState({ price: 250000, initial: 50000, years: 30, rate: 3.5 })
  const [expenses, setExpenses] = useState({ price: 250000 })

  const calculateMortgage = () => {
    const principal = mortgage.price - mortgage.initial
    const monthlyRate = mortgage.rate / 100 / 12
    const months = mortgage.years * 12
    if (monthlyRate === 0) return (principal / months).toFixed(2)
    const monthly = (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) / (Math.pow(1 + monthlyRate, months) - 1)
    return monthly.toFixed(2)
  }

  const calculateExpenses = () => {
    const notary = expenses.price * 0.005
    const registry = expenses.price * 0.004
    const itp = expenses.price * 0.08 // 8% ITP promedio
    const gestor = 600
    const total = notary + registry + itp + gestor
    return {
      notary: notary.toFixed(0),
      registry: registry.toFixed(0),
      itp: itp.toFixed(0),
      gestor: gestor.toFixed(0),
      total: total.toFixed(0),
    }
  }

  const monthlyPayment = calculateMortgage()
  const expensesBreakdown = calculateExpenses()

  return (
    <section id="simuladores" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Simuladores Inteligentes
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Prueba nuestras calculadoras profesionales y descubre el poder de HABITY
          </p>
        </motion.div>

        {/* Simulators Grid */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Mortgage Simulator */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-2xl border-2 border-blue-200 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-primary rounded-xl">
                <Home className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Simulador de Hipoteca</h3>
            </div>

            <div className="space-y-6">
              {/* Precio vivienda */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio de la vivienda
                </label>
                <div className="flex gap-3 items-center mb-2">
                  <input
                    type="number"
                    min="50000"
                    max="2000000"
                    step="10000"
                    value={mortgage.price}
                    onChange={(e) => setMortgage({ ...mortgage, price: Math.max(50000, parseInt(e.target.value) || 50000) })}
                    className="w-32 px-4 py-2 border-2 border-blue-300 rounded-lg font-bold text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <span className="text-gray-600">€</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="10000"
                  value={mortgage.price}
                  onChange={(e) => setMortgage({ ...mortgage, price: parseInt(e.target.value) })}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Entrada */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Entrada
                </label>
                <div className="flex gap-3 items-center mb-2">
                  <input
                    type="number"
                    min="0"
                    max={mortgage.price}
                    step="5000"
                    value={mortgage.initial}
                    onChange={(e) => setMortgage({ ...mortgage, initial: Math.min(mortgage.price, Math.max(0, parseInt(e.target.value) || 0)) })}
                    className="w-32 px-4 py-2 border-2 border-blue-300 rounded-lg font-bold text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <span className="text-gray-600">€</span>
                  <span className="text-sm text-gray-500">({((mortgage.initial / mortgage.price) * 100).toFixed(0)}%)</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max={mortgage.price * 0.5}
                  step="5000"
                  value={mortgage.initial}
                  onChange={(e) => setMortgage({ ...mortgage, initial: parseInt(e.target.value) })}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Plazo */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plazo
                </label>
                <div className="flex gap-3 items-center mb-2">
                  <input
                    type="number"
                    min="5"
                    max="40"
                    step="1"
                    value={mortgage.years}
                    onChange={(e) => setMortgage({ ...mortgage, years: Math.min(40, Math.max(5, parseInt(e.target.value) || 5)) })}
                    className="w-20 px-4 py-2 border-2 border-blue-300 rounded-lg font-bold text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <span className="text-gray-600">años</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="40"
                  step="5"
                  value={mortgage.years}
                  onChange={(e) => setMortgage({ ...mortgage, years: parseInt(e.target.value) })}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              {/* Interés */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tipo de interés
                </label>
                <div className="flex gap-3 items-center mb-2">
                  <input
                    type="number"
                    min="0.5"
                    max="10"
                    step="0.1"
                    value={mortgage.rate}
                    onChange={(e) => setMortgage({ ...mortgage, rate: Math.min(10, Math.max(0.5, parseFloat(e.target.value) || 0.5)) })}
                    className="w-20 px-4 py-2 border-2 border-blue-300 rounded-lg font-bold text-primary focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none"
                  />
                  <span className="text-gray-600">%</span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="7"
                  step="0.1"
                  value={mortgage.rate}
                  onChange={(e) => setMortgage({ ...mortgage, rate: parseFloat(e.target.value) })}
                  className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer accent-primary"
                />
              </div>

              <div className="pt-6 border-t-2 border-blue-200">
                <div className="flex items-baseline gap-2">
                  <span className="text-gray-600">Cuota mensual:</span>
                  <span className="text-4xl font-bold text-primary">{monthlyPayment}€</span>
                  <span className="text-gray-500">/mes</span>
                </div>
                <p className="text-sm text-gray-500 mt-2">
                  Capital: {(mortgage.price - mortgage.initial).toLocaleString()}€ a {mortgage.years} años
                </p>
              </div>
            </div>
          </motion.div>

          {/* Expenses Calculator */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-green-50 to-white p-8 rounded-2xl border-2 border-green-200 shadow-lg"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-secondary rounded-xl">
                <Calculator className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Gastos de Compra</h3>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Precio de la vivienda
                </label>
                <div className="flex gap-3 items-center mb-2">
                  <input
                    type="number"
                    min="50000"
                    max="2000000"
                    step="10000"
                    value={expenses.price}
                    onChange={(e) => setExpenses({ price: Math.max(50000, parseInt(e.target.value) || 50000) })}
                    className="w-32 px-4 py-2 border-2 border-green-300 rounded-lg font-bold text-secondary focus:border-secondary focus:ring-2 focus:ring-secondary/20 outline-none"
                  />
                  <span className="text-gray-600">€</span>
                </div>
                <input
                  type="range"
                  min="50000"
                  max="1000000"
                  step="10000"
                  value={expenses.price}
                  onChange={(e) => setExpenses({ price: parseInt(e.target.value) })}
                  className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer accent-secondary"
                />
              </div>

              <div className="pt-6 border-t-2 border-green-200 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Notaría:</span>
                  <span className="text-lg font-bold text-gray-900">{expensesBreakdown.notary}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Registro:</span>
                  <span className="text-lg font-bold text-gray-900">{expensesBreakdown.registry}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">ITP (8%):</span>
                  <span className="text-lg font-bold text-gray-900">{expensesBreakdown.itp}€</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Gestoría:</span>
                  <span className="text-lg font-bold text-gray-900">{expensesBreakdown.gestor}€</span>
                </div>
                <div className="pt-4 border-t-2 border-green-300 flex justify-between items-baseline">
                  <span className="text-gray-700 font-semibold">Total gastos:</span>
                  <span className="text-4xl font-bold text-secondary">{expensesBreakdown.total}€</span>
                </div>
                <p className="text-sm text-gray-500">
                  Aproximadamente el {((parseInt(expensesBreakdown.total) / expenses.price) * 100).toFixed(1)}% del precio
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
