/**
 * Calculadora de Gastos de Compraventa
 * tuHabity.com - Simulador de Costes de Compra de Vivienda
 */

export type Region =
  | 'Andalucía'
  | 'Aragón'
  | 'Asturias'
  | 'Baleares'
  | 'Canarias'
  | 'Cantabria'
  | 'Castilla-La Mancha'
  | 'Castilla y León'
  | 'Cataluña'
  | 'Ceuta'
  | 'Extremadura'
  | 'Galicia'
  | 'La Rioja'
  | 'Madrid'
  | 'Melilla'
  | 'Murcia'
  | 'Navarra'
  | 'País Vasco'
  | 'Valencia';

export interface RegionTaxData {
  itpRate: number; // Impuesto de Transmisiones Patrimoniales (%)
  ajdRate: number; // Actos Jurídicos Documentados (%)
  ivaRate: number; // IVA para obra nueva (%)
  notes?: string;
}

/**
 * Tabla de ITP por Comunidad Autónoma (2024)
 * Fuente: Agencia Tributaria y Consejerías de Hacienda Autonómicas
 */
export const AUTONOMOUS_REGIONS: Record<Region, RegionTaxData> = {
  Andalucía: {
    itpRate: 8.0, // Progresivo: 8-10%
    ajdRate: 1.5,
    ivaRate: 10.0,
    notes: 'Escala progresiva según valor',
  },
  Aragón: {
    itpRate: 8.0,
    ajdRate: 1.5,
    ivaRate: 10.0,
  },
  Asturias: {
    itpRate: 8.0,
    ajdRate: 1.5,
    ivaRate: 10.0,
  },
  Baleares: {
    itpRate: 8.0, // Progresivo: 8-13%
    ajdRate: 1.5,
    ivaRate: 10.0,
    notes: 'Escala progresiva según valor',
  },
  Canarias: {
    itpRate: 6.5,
    ajdRate: 1.0,
    ivaRate: 7.0, // IGIC en lugar de IVA
    notes: 'IGIC 7% (equivalente al IVA)',
  },
  Cantabria: {
    itpRate: 10.0,
    ajdRate: 1.5,
    ivaRate: 10.0,
  },
  'Castilla-La Mancha': {
    itpRate: 9.0,
    ajdRate: 1.5,
    ivaRate: 10.0,
  },
  'Castilla y León': {
    itpRate: 8.0,
    ajdRate: 1.5,
    ivaRate: 10.0,
  },
  Cataluña: {
    itpRate: 10.0, // Progresivo: 10-11%
    ajdRate: 1.5,
    ivaRate: 10.0,
    notes: 'Escala progresiva según valor',
  },
  Ceuta: {
    itpRate: 3.0, // Bonificado del 6% al 3%
    ajdRate: 0.5,
    ivaRate: 10.0,
    notes: 'Bonificación del 50% sobre ITP (del 6% al 3%)',
  },
  Extremadura: {
    itpRate: 8.0,
    ajdRate: 1.5,
    ivaRate: 10.0,
  },
  Galicia: {
    itpRate: 10.0,
    ajdRate: 1.5,
    ivaRate: 10.0,
  },
  'La Rioja': {
    itpRate: 7.0,
    ajdRate: 1.5,
    ivaRate: 10.0,
  },
  Madrid: {
    itpRate: 6.0,
    ajdRate: 1.5,
    ivaRate: 10.0,
  },
  Melilla: {
    itpRate: 3.0, // Bonificado del 6% al 3%
    ajdRate: 0.5,
    ivaRate: 10.0,
    notes: 'Bonificación del 50% sobre ITP (del 6% al 3%)',
  },
  Murcia: {
    itpRate: 8.0,
    ajdRate: 1.5,
    ivaRate: 10.0,
  },
  Navarra: {
    itpRate: 6.0,
    ajdRate: 0.5,
    ivaRate: 10.0,
  },
  'País Vasco': {
    itpRate: 7.0, // Varía por provincia: 4-7%
    ajdRate: 0.5,
    ivaRate: 10.0,
    notes: 'Varía según provincia',
  },
  Valencia: {
    itpRate: 10.0,
    ajdRate: 1.5,
    ivaRate: 10.0,
  },
};

export interface PurchaseCostsParams {
  propertyPrice: number;
  region: Region;
  isNewProperty: boolean; // Obra nueva (IVA) vs. Segunda mano (ITP)
  hasMortgage: boolean; // Si necesita hipoteca (gastos adicionales)
}

export interface PurchaseCostsResult {
  // Impuestos
  itpTransfer: number; // ITP (segunda mano) o AJD (obra nueva)
  ivaAJD: number; // IVA (solo obra nueva)

  // Gastos de escritura y registro
  notaryCosts: number; // Notaría
  registryCosts: number; // Registro de la Propiedad
  agencyCosts: number; // Gestoría (opcional)

  // Total
  totalCosts: number;

  // Desglose para referencia
  breakdown: {
    taxRate: number;
    taxAmount: number;
    taxType: 'ITP' | 'IVA+AJD';
  };
}

/**
 * Calcula gastos orientativos de notaría según valor
 * Basado en Aranceles del Real Decreto 1426/1989
 */
function calculateNotaryCosts(propertyPrice: number): number {
  if (propertyPrice <= 6000) return 150;
  if (propertyPrice <= 30000) return 300;
  if (propertyPrice <= 60000) return 450;
  if (propertyPrice <= 150000) return 600;
  if (propertyPrice <= 250000) return 850;
  if (propertyPrice <= 500000) return 1200;
  return 1500; // > 500.000€
}

/**
 * Calcula gastos orientativos de registro de propiedad
 */
function calculateRegistryCosts(propertyPrice: number): number {
  // Aproximadamente 0.1-0.2% del valor
  const baseCost = propertyPrice * 0.0015;
  return Math.max(400, Math.min(baseCost, 1000));
}

/**
 * Calcula gastos de gestoría (opcional, si se solicita hipoteca)
 */
function calculateAgencyCosts(hasMortgage: boolean): number {
  return hasMortgage ? 600 : 0; // Gastos de gestoría orientativos
}

/**
 * Calcula todos los gastos de compraventa
 */
export function calculatePurchaseCosts(params: PurchaseCostsParams): PurchaseCostsResult {
  const { propertyPrice, region, isNewProperty, hasMortgage } = params;
  const regionData = AUTONOMOUS_REGIONS[region];

  let itpTransfer = 0;
  let ivaAJD = 0;
  let taxRate = 0;
  let taxAmount = 0;
  let taxType: 'ITP' | 'IVA+AJD';

  if (isNewProperty) {
    // Obra nueva: IVA (10%) + AJD (1.5% aprox.)
    const ivaAmount = propertyPrice * (regionData.ivaRate / 100);
    const ajdAmount = propertyPrice * (regionData.ajdRate / 100);
    ivaAJD = ivaAmount;
    itpTransfer = ajdAmount; // AJD se guarda aquí para mantener compatibilidad
    taxRate = regionData.ivaRate + regionData.ajdRate;
    taxAmount = ivaAmount + ajdAmount;
    taxType = 'IVA+AJD';
  } else {
    // Segunda mano: ITP (varía por comunidad)
    itpTransfer = propertyPrice * (regionData.itpRate / 100);
    taxRate = regionData.itpRate;
    taxAmount = itpTransfer;
    taxType = 'ITP';
  }

  const notaryCosts = calculateNotaryCosts(propertyPrice);
  const registryCosts = calculateRegistryCosts(propertyPrice);
  const agencyCosts = calculateAgencyCosts(hasMortgage);

  const totalCosts = taxAmount + notaryCosts + registryCosts + agencyCosts;

  return {
    itpTransfer,
    ivaAJD,
    notaryCosts,
    registryCosts,
    agencyCosts,
    totalCosts,
    breakdown: {
      taxRate,
      taxAmount,
      taxType,
    },
  };
}

/**
 * Valida los parámetros de entrada
 */
export function validatePurchaseCostsParams(params: PurchaseCostsParams): {
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

  if (!AUTONOMOUS_REGIONS[params.region]) {
    errors.push(`Comunidad autónoma no válida: ${params.region}`);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
