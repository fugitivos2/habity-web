/**
 * Simulador de Hipoteca
 * tuHabity.com - Calculadora de Cuota Hipotecaria
 */

export interface MortgageSimulationParams {
  propertyPrice: number;
  downPayment: number;
  interestRate: number;
  termYears: number;
}

export interface MortgageSimulationResult {
  loanAmount: number;
  monthlyPayment: number;
  totalPayment: number;
  totalInterest: number;
  ltv: number; // Loan-to-Value ratio (%)
}

/**
 * Calcula la cuota mensual de una hipoteca usando la fórmula de anualidad
 * Fórmula: M = P * [i(1 + i)^n] / [(1 + i)^n - 1]
 * 
 * M = Cuota mensual
 * P = Principal (cantidad prestada)
 * i = Tasa de interés mensual (anual / 12 / 100)
 * n = Número de pagos (años * 12)
 */
export function calculateMortgage(params: MortgageSimulationParams): MortgageSimulationResult {
  const { propertyPrice, downPayment, interestRate, termYears } = params;

  // Cantidad a financiar
  const loanAmount = propertyPrice - downPayment;

  // Si no hay préstamo, retornar valores en 0
  if (loanAmount <= 0) {
    return {
      loanAmount: 0,
      monthlyPayment: 0,
      totalPayment: downPayment,
      totalInterest: 0,
      ltv: 0,
    };
  }

  // Tasa de interés mensual (decimal)
  const monthlyRate = interestRate / 100 / 12;
  
  // Número de pagos mensuales
  const numPayments = termYears * 12;

  // Calcular cuota mensual usando la fórmula de anualidad
  let monthlyPayment: number;
  
  if (monthlyRate === 0) {
    // Si el interés es 0%, la cuota es simplemente el préstamo dividido entre los pagos
    monthlyPayment = loanAmount / numPayments;
  } else {
    // Fórmula de anualidad: M = P * [i(1 + i)^n] / [(1 + i)^n - 1]
    const numerator = monthlyRate * Math.pow(1 + monthlyRate, numPayments);
    const denominator = Math.pow(1 + monthlyRate, numPayments) - 1;
    monthlyPayment = loanAmount * (numerator / denominator);
  }

  // Total pagado durante toda la hipoteca
  const totalPayment = monthlyPayment * numPayments;

  // Total de intereses pagados
  const totalInterest = totalPayment - loanAmount;

  // LTV (Loan-to-Value): Porcentaje financiado sobre el valor de la propiedad
  const ltv = (loanAmount / propertyPrice) * 100;

  return {
    loanAmount,
    monthlyPayment: Math.round(monthlyPayment * 100) / 100, // Redondear a 2 decimales
    totalPayment: Math.round(totalPayment * 100) / 100,
    totalInterest: Math.round(totalInterest * 100) / 100,
    ltv: Math.round(ltv * 100) / 100,
  };
}

/**
 * Valida los parámetros de entrada
 */
export function validateMortgageParams(params: MortgageSimulationParams): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (params.propertyPrice < 10000) {
    errors.push('El precio de la vivienda debe ser al menos 10.000€');
  }

  if (params.propertyPrice > 10000000) {
    errors.push('El precio de la vivienda no puede superar 10.000.000€');
  }

  if (params.downPayment < 0) {
    errors.push('La entrada no puede ser negativa');
  }

  if (params.downPayment > params.propertyPrice) {
    errors.push('La entrada no puede ser mayor que el precio de la vivienda');
  }

  if (params.interestRate < 0) {
    errors.push('El tipo de interés no puede ser negativo');
  }

  if (params.interestRate > 20) {
    errors.push('El tipo de interés no puede superar el 20%');
  }

  if (params.termYears < 1) {
    errors.push('El plazo debe ser al menos 1 año');
  }

  if (params.termYears > 50) {
    errors.push('El plazo no puede superar los 50 años');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calcula la tabla de amortización (opcional, para features futuras)
 */
export interface AmortizationEntry {
  month: number;
  payment: number;
  principal: number;
  interest: number;
  balance: number;
}

export function calculateAmortizationSchedule(
  params: MortgageSimulationParams
): AmortizationEntry[] {
  const { propertyPrice, downPayment, interestRate, termYears } = params;
  const loanAmount = propertyPrice - downPayment;
  const monthlyRate = interestRate / 100 / 12;
  const numPayments = termYears * 12;

  // Calcular cuota mensual
  const result = calculateMortgage(params);
  const monthlyPayment = result.monthlyPayment;

  const schedule: AmortizationEntry[] = [];
  let balance = loanAmount;

  for (let month = 1; month <= numPayments; month++) {
    const interestPayment = balance * monthlyRate;
    const principalPayment = monthlyPayment - interestPayment;
    balance -= principalPayment;

    // Asegurar que el balance no sea negativo en el último pago
    if (balance < 0) balance = 0;

    schedule.push({
      month,
      payment: Math.round(monthlyPayment * 100) / 100,
      principal: Math.round(principalPayment * 100) / 100,
      interest: Math.round(interestPayment * 100) / 100,
      balance: Math.round(balance * 100) / 100,
    });
  }

  return schedule;
}
