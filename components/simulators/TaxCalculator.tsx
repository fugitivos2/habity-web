'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Calculator, TrendingUp, Home, AlertCircle, DollarSign } from 'lucide-react';

// Tipos de IRPF por ganancia patrimonial (2024)
// Tramos progresivos según la ganancia
const IRPF_BRACKETS = [
  { max: 6000, rate: 19 },
  { max: 50000, rate: 21 },
  { max: 200000, rate: 23 },
  { max: 300000, rate: 27 },
  { max: Infinity, rate: 28 }
];

export default function TaxCalculator() {
  // Estados de compra
  const [purchasePrice, setPurchasePrice] = useState(200000);
  const [purchaseCosts, setPurchaseCosts] = useState(15000); // Gastos de compra
  const [yearsOwned, setYearsOwned] = useState(5);

  // Estados de venta
  const [salePrice, setSalePrice] = useState(280000);
  const [saleCosts, setSaleCosts] = useState(8000); // Gastos de venta (comisiones, etc)

  // Plusvalía municipal
  const [cityTaxRate, setCityTaxRate] = useState(3.0); // % anual (varía por municipio)

  // Reinversión en vivienda habitual
  const [isReinvestment, setIsReinvestment] = useState(false);

  // Cálculos
  const calculateTaxes = () => {
    // 1. GANANCIA PATRIMONIAL
    // Ganancia = Precio Venta - (Precio Compra + Gastos Compra + Gastos Venta)
    const totalAcquisitionCost = purchasePrice + purchaseCosts;
    const totalTransmissionCost = saleCosts;
    const capitalGain = salePrice - totalAcquisitionCost - totalTransmissionCost;

    // 2. IRPF (solo si NO se reinvierte en vivienda habitual)
    let irpfTax = 0;
    if (!isReinvestment && capitalGain > 0) {
      let remainingGain = capitalGain;
      let previousMax = 0;

      for (const bracket of IRPF_BRACKETS) {
        if (remainingGain <= 0) break;
        
        const taxableInBracket = Math.min(remainingGain, bracket.max - previousMax);
        irpfTax += taxableInBracket * (bracket.rate / 100);
        
        remainingGain -= taxableInBracket;
        previousMax = bracket.max;
      }
    }

    // 3. PLUSVALÍA MUNICIPAL
    // Base imponible = Valor catastral del suelo (aprox 20% del precio compra)
    const cadastralValue = purchasePrice * 0.20;
    
    // Incremento según años (máximo 20 años)
    const effectiveYears = Math.min(yearsOwned, 20);
    const municipalGainBase = cadastralValue * (cityTaxRate / 100) * effectiveYears;
    
    // Tipo impositivo municipal (suele ser 30%, editable implícitamente en cityTaxRate)
    const municipalTaxRate = 30; // %
    const plusvaliaTax = municipalGainBase * (municipalTaxRate / 100);

    // 4. TOTAL A PAGAR
    const totalTax = irpfTax + plusvaliaTax;

    // 5. GANANCIA NETA (después de impuestos)
    const netGain = capitalGain - totalTax;

    return {
      capitalGain,
      irpfTax,
      plusvaliaTax,
      totalTax,
      netGain,
      effectiveRate: capitalGain > 0 ? (totalTax / capitalGain) * 100 : 0
    };
  };

  const result = calculateTaxes();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-purple-50 to-white border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="w-6 h-6 text-purple-600" />
            Calculadora Fiscal de Venta de Vivienda
          </CardTitle>
          <CardDescription className="text-base">
            Calcula la plusvalía municipal y el IRPF que pagarás al vender tu vivienda
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Panel de Parámetros */}
        <div className="space-y-4">
          {/* DATOS DE COMPRA */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Home className="w-5 h-5" />
                📥 Datos de Compra
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Precio de compra */}
              <div className="space-y-2">
                <Label htmlFor="purchasePrice" className="font-semibold">
                  Precio de compra
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="purchasePrice"
                    type="number"
                    value={purchasePrice}
                    onChange={(e) => setPurchasePrice(Number(e.target.value))}
                    className="flex-1"
                    min={0}
                    step={5000}
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">€</span>
                </div>
              </div>

              {/* Gastos de compra */}
              <div className="space-y-2">
                <Label htmlFor="purchaseCosts" className="font-semibold">
                  Gastos de compra (ITP, notaría, registro...)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="purchaseCosts"
                    type="number"
                    value={purchaseCosts}
                    onChange={(e) => setPurchaseCosts(Number(e.target.value))}
                    className="flex-1"
                    min={0}
                    step={500}
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">€</span>
                </div>
                <p className="text-xs text-gray-500">Aprox. 7-10% del precio de compra</p>
              </div>

              {/* Años de propiedad */}
              <div className="space-y-2">
                <Label htmlFor="yearsOwned" className="font-semibold">
                  Años de propiedad
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="yearsOwned"
                    type="number"
                    value={yearsOwned}
                    onChange={(e) => setYearsOwned(Number(e.target.value))}
                    className="flex-1"
                    min={0}
                    max={50}
                    step={1}
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">años</span>
                </div>
                <p className="text-xs text-gray-500">Tiempo que has sido propietario</p>
              </div>
            </CardContent>
          </Card>

          {/* DATOS DE VENTA */}
          <Card className="border-2 border-green-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <TrendingUp className="w-5 h-5" />
                📤 Datos de Venta
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Precio de venta */}
              <div className="space-y-2">
                <Label htmlFor="salePrice" className="font-semibold">
                  Precio de venta
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="salePrice"
                    type="number"
                    value={salePrice}
                    onChange={(e) => setSalePrice(Number(e.target.value))}
                    className="flex-1"
                    min={0}
                    step={5000}
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">€</span>
                </div>
              </div>

              {/* Gastos de venta */}
              <div className="space-y-2">
                <Label htmlFor="saleCosts" className="font-semibold">
                  Gastos de venta (comisiones, certificados...)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="saleCosts"
                    type="number"
                    value={saleCosts}
                    onChange={(e) => setSaleCosts(Number(e.target.value))}
                    className="flex-1"
                    min={0}
                    step={500}
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">€</span>
                </div>
                <p className="text-xs text-gray-500">Comisión inmobiliaria, certificado energético, etc.</p>
              </div>

              {/* Tasa plusvalía municipal */}
              <div className="space-y-2">
                <Label htmlFor="cityTaxRate" className="font-semibold">
                  Coeficiente plusvalía municipal (%)
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="cityTaxRate"
                    type="number"
                    value={cityTaxRate}
                    onChange={(e) => setCityTaxRate(Number(e.target.value))}
                    className="flex-1"
                    min={0}
                    max={5}
                    step={0.1}
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">% anual</span>
                </div>
                <p className="text-xs text-gray-500">Varía por municipio (2-4% típico). Consulta con tu ayuntamiento.</p>
              </div>
            </CardContent>
          </Card>

          {/* REINVERSIÓN */}
          <Card className="border-2 border-yellow-200 bg-yellow-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <Home className="w-5 h-5" />
                🏡 Reinversión en Vivienda Habitual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3 p-4 bg-white rounded-lg border-2 border-yellow-300">
                <input
                  type="checkbox"
                  id="isReinvestment"
                  checked={isReinvestment}
                  onChange={(e) => setIsReinvestment(e.target.checked)}
                  className="w-5 h-5 text-yellow-600 border-2 border-yellow-400 rounded focus:ring-2 focus:ring-yellow-500 cursor-pointer"
                />
                <label htmlFor="isReinvestment" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Voy a reinvertir en otra vivienda habitual {isReinvestment && (
                    <span className="text-yellow-600 font-semibold">
                      (exento de IRPF ✅)
                    </span>
                  )}
                </label>
              </div>
              <p className="text-xs text-gray-600 mt-3">
                Si reinviertes el dinero en otra vivienda habitual en un plazo de 2 años, 
                <strong> estarás exento de pagar IRPF</strong> sobre la ganancia patrimonial.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Panel de Resultados */}
        <div className="space-y-4">
          {/* Ganancia Patrimonial */}
          <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <DollarSign className="w-6 h-6" />
                💰 Ganancia Patrimonial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-5xl font-bold mb-2 ${result.capitalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(result.capitalGain)}
              </div>
              <p className="text-sm text-gray-600">
                Precio venta ({formatCurrency(salePrice)}) - Precio compra total ({formatCurrency(purchasePrice + purchaseCosts + saleCosts)})
              </p>
            </CardContent>
          </Card>

          {/* Desglose de Impuestos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                📊 Impuestos a Pagar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* IRPF */}
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    IRPF (Ganancia Patrimonial)
                  </span>
                  {isReinvestment && (
                    <span className="text-xs text-green-600 font-semibold">
                      ✅ Exento por reinversión en vivienda habitual
                    </span>
                  )}
                  {!isReinvestment && result.capitalGain > 0 && (
                    <span className="text-xs text-blue-600">
                      Tramos: 19%-28% según ganancia
                    </span>
                  )}
                </div>
                <span className={`text-lg font-bold ${isReinvestment ? 'text-green-600' : 'text-blue-600'}`}>
                  {isReinvestment ? '0 €' : formatCurrency(result.irpfTax)}
                </span>
              </div>

              {/* Plusvalía Municipal */}
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">
                    Plusvalía Municipal
                  </span>
                  <span className="text-xs text-orange-600">
                    {cityTaxRate}% anual × {Math.min(yearsOwned, 20)} años × 30% tipo
                  </span>
                </div>
                <span className="text-lg font-bold text-orange-600">
                  {formatCurrency(result.plusvaliaTax)}
                </span>
              </div>

              <Separator />

              {/* Total Impuestos */}
              <div className="flex justify-between items-center p-4 bg-red-100 rounded-lg">
                <span className="text-base font-bold text-gray-900">TOTAL IMPUESTOS</span>
                <span className="text-2xl font-bold text-red-600">
                  {formatCurrency(result.totalTax)}
                </span>
              </div>

              {/* Tipo efectivo */}
              <div className="text-center text-sm text-gray-600">
                Tipo efectivo: <strong>{result.effectiveRate.toFixed(2)}%</strong> sobre la ganancia
              </div>
            </CardContent>
          </Card>

          {/* Ganancia Neta */}
          <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <TrendingUp className="w-6 h-6" />
                💵 Ganancia Neta (después de impuestos)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-green-600 mb-2">
                {formatCurrency(result.netGain)}
              </div>
              <p className="text-sm text-gray-600">
                Ganancia patrimonial ({formatCurrency(result.capitalGain)}) - Impuestos ({formatCurrency(result.totalTax)})
              </p>
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-2">⚠️ Importante:</p>
                  <ul className="space-y-1 list-disc list-inside leading-relaxed">
                    <li>Los cálculos son estimados y orientativos</li>
                    <li>El coeficiente de plusvalía municipal varía por ayuntamiento (consulta el tuyo)</li>
                    <li>La exención por reinversión solo aplica a vivienda habitual (no inversión)</li>
                    <li>Debes reinvertir en un plazo máximo de 2 años</li>
                    <li>Consulta con un asesor fiscal para tu caso específico</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
