/**
 * Utilidades de Validación
 * Funciones reutilizables para validación de datos
 */

/**
 * Validar email
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

/**
 * Validar contraseña
 */
export function isValidPassword(password: string): {
  isValid: boolean
  errors: string[]
} {
  const errors: string[] = []

  if (password.length < 8) {
    errors.push('La contraseña debe tener al menos 8 caracteres')
  }

  if (!/[a-z]/.test(password)) {
    errors.push('Debe contener al menos una letra minúscula')
  }

  if (!/[A-Z]/.test(password)) {
    errors.push('Debe contener al menos una letra mayúscula')
  }

  if (!/[0-9]/.test(password)) {
    errors.push('Debe contener al menos un número')
  }

  return {
    isValid: errors.length === 0,
    errors
  }
}

/**
 * Validar teléfono español
 */
export function isValidSpanishPhone(phone: string): boolean {
  // Eliminar espacios y guiones
  const cleanPhone = phone.replace(/[\s-]/g, '')
  
  // Validar formato español: +34 o 34 seguido de 9 dígitos
  const phoneRegex = /^(\+34|34)?[6-9]\d{8}$/
  return phoneRegex.test(cleanPhone)
}

/**
 * Sanitizar entrada de usuario
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/[<>]/g, '') // Eliminar tags HTML básicos
    .slice(0, 1000) // Limitar longitud
}

/**
 * Validar rango numérico
 */
export function isInRange(value: number, min: number, max: number): boolean {
  return value >= min && value <= max
}

/**
 * Validar precio de propiedad
 */
export function isValidPropertyPrice(price: number): boolean {
  return price > 0 && price <= 100000000 // Máximo 100M€
}

/**
 * Validar porcentaje de interés
 */
export function isValidInterestRate(rate: number): boolean {
  return rate >= 0 && rate <= 20 // 0% - 20%
}

/**
 * Validar plazo hipoteca (años)
 */
export function isValidMortgageTerm(years: number): boolean {
  return years >= 1 && years <= 40
}
