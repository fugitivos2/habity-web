// Utilidades para cálculo de hipoteca

export interface MortgageInputs {
  propertyPrice: number        // Precio de la vivienda
  downPayment: number          // Entrada (€)
  downPaymentPercentage: number // Entrada (%)
  loanAmount: number           // Cantidad a financiar
  interestRate: number         // TIN - Tipo de interés (%)
  years: number                // Plazo (años)
}

export interface MortgageResults {
  monthlyPayment: number       // Cuota mensual
  totalInterest: number        // Intereses totales
  totalAmount: number          // Cantidad total a pagar
  annualPayment: number        // Pago anual
  payments: PaymentDetail[]    // Detalle de pagos por año
}

export interface PaymentDetail {
  year: number
  principal: number            // Capital amortizado
  interest: number             // Intereses pagados
  remainingBalance: number     // Capital pendiente
  cumulativeInterest: number   // Intereses acumulados
}

/**
 * Calcula la cuota mensual de una hipoteca usando la fórmula francesa
 */
export function calculateMonthlyPayment(
  loanAmount: number,
  annualInterestRate: number,
  years: number
): number {
  if (loanAmount <= 0 || years <= 0) return 0
  
  // Si el interés es 0, simplemente dividir el préstamo entre meses
  if (annualInterestRate === 0) {
    return loanAmount / (years * 12)
  }

  const monthlyRate = annualInterestRate / 100 / 12
  const numberOfPayments = years * 12
  
  // Fórmula: M = P * [i(1 + i)^n] / [(1 + i)^n - 1]
  const factor = Math.pow(1 + monthlyRate, numberOfPayments)
  const monthlyPayment = loanAmount * (monthlyRate * factor) / (factor - 1)
  
  return monthlyPayment
}

/**
 * Calcula el desglose completo de la hipoteca
 */
export function calculateMortgage(inputs: MortgageInputs): MortgageResults {
  const monthlyPayment = calculateMonthlyPayment(
    inputs.loanAmount,
    inputs.interestRate,
    inputs.years
  )
  
  const numberOfPayments = inputs.years * 12
  const totalAmount = monthlyPayment * numberOfPayments
  const totalInterest = totalAmount - inputs.loanAmount
  const annualPayment = monthlyPayment * 12

  // Calcular tabla de amortización por años
  const payments: PaymentDetail[] = []
  let remainingBalance = inputs.loanAmount
  let cumulativeInterest = 0
  const monthlyRate = inputs.interestRate / 100 / 12

  for (let year = 1; year <= inputs.years; year++) {
    let yearlyPrincipal = 0
    let yearlyInterest = 0

    // Calcular 12 meses
    for (let month = 1; month <= 12; month++) {
      if (remainingBalance <= 0) break

      const interestPayment = remainingBalance * monthlyRate
      const principalPayment = monthlyPayment - interestPayment

      yearlyPrincipal += principalPayment
      yearlyInterest += interestPayment
      remainingBalance -= principalPayment
      cumulativeInterest += interestPayment
    }

    payments.push({
      year,
      principal: yearlyPrincipal,
      interest: yearlyInterest,
      remainingBalance: Math.max(0, remainingBalance),
      cumulativeInterest,
    })

    if (remainingBalance <= 0) break
  }

  return {
    monthlyPayment,
    totalInterest,
    totalAmount,
    annualPayment,
    payments,
  }
}

/**
 * Calcula el porcentaje de entrada dado el monto
 */
export function calculateDownPaymentPercentage(
  downPayment: number,
  propertyPrice: number
): number {
  if (propertyPrice <= 0) return 0
  return (downPayment / propertyPrice) * 100
}

/**
 * Calcula el monto de entrada dado el porcentaje
 */
export function calculateDownPaymentAmount(
  percentage: number,
  propertyPrice: number
): number {
  return (percentage / 100) * propertyPrice
}

/**
 * Formatea cantidad en euros
 */
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-ES', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

/**
 * Formatea porcentaje
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${value.toFixed(decimals)}%`
}
