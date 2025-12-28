/**
 * Planes de Suscripción
 * Configuración centralizada de planes y límites
 */

export const SUBSCRIPTION_PLANS = {
  LLAVE: {
    id: 'LLAVE',
    name: 'Llave',
    icon: '🔑',
    color: 'gray',
    price: 0,
    priceYearly: 0,
    interval: 'Gratis',
    simulationLimit: 5,
    features: [
      '5 simulaciones al mes',
      'Acceso a todos los simuladores',
      'Guardar simulaciones',
      'Soporte por email',
    ],
    limits: {
      simulations: 5,
      properties: 3,
      reports: 0,
      apiCalls: 100,
    }
  },
  ESCRITURA: {
    id: 'ESCRITURA',
    name: 'Escritura',
    icon: '📝',
    color: 'blue',
    price: 9.99,
    priceYearly: 99.99,
    interval: '/mes',
    simulationLimit: 50,
    features: [
      '50 simulaciones al mes',
      'Acceso a todos los simuladores',
      'Guardar simulaciones ilimitadas',
      'Exportar a PDF',
      'Comparador de propiedades',
      'Soporte prioritario',
      'Sin publicidad',
    ],
    limits: {
      simulations: 50,
      properties: 20,
      reports: 10,
      apiCalls: 1000,
    }
  },
  NOTARIA: {
    id: 'NOTARIA',
    name: 'Notaría',
    icon: '⭐',
    color: 'purple',
    price: 19.99,
    priceYearly: 199.99,
    interval: '/mes',
    simulationLimit: Infinity,
    features: [
      'Simulaciones ilimitadas',
      'Acceso a todos los simuladores',
      'Guardar simulaciones ilimitadas',
      'Exportar a PDF',
      'Comparador de simulaciones',
      'Análisis avanzado',
      'Multi-propiedad',
      'Análisis de rentabilidad',
      'Asesoría personalizada',
      'Soporte 24/7',
      'Sin publicidad',
    ],
    limits: {
      simulations: Infinity,
      properties: Infinity,
      reports: Infinity,
      apiCalls: Infinity,
    }
  },
  ENTERPRISE: {
    id: 'ENTERPRISE',
    name: 'Enterprise',
    icon: '🏢',
    color: 'amber',
    price: 0, // Precio personalizado
    priceYearly: 0,
    interval: 'Personalizado',
    simulationLimit: Infinity,
    features: [
      'Todo de Notaría',
      'Usuarios ilimitados',
      'API privada',
      'White label',
      'Integraciones personalizadas',
      'Gestor de cuenta dedicado',
      'SLA garantizado',
      'Formación del equipo',
    ],
    limits: {
      simulations: Infinity,
      properties: Infinity,
      reports: Infinity,
      apiCalls: Infinity,
    }
  }
} as const

export type PlanId = keyof typeof SUBSCRIPTION_PLANS

/**
 * Obtener configuración de un plan
 */
export function getPlanConfig(planId: PlanId) {
  return SUBSCRIPTION_PLANS[planId]
}

/**
 * Obtener límite de simulaciones por plan
 */
export function getSimulationLimit(planId: PlanId): number {
  return SUBSCRIPTION_PLANS[planId].simulationLimit
}

/**
 * Verificar si un plan tiene una característica
 */
export function hasFeature(planId: PlanId, feature: string): boolean {
  return SUBSCRIPTION_PLANS[planId].features.includes(feature)
}
