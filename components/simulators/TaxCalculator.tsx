'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { Calculator, TrendingUp, Home, AlertCircle, Euro, Plus, X } from 'lucide-react';

// Tipos de IRPF por ganancia patrimonial (2024)
const IRPF_BRACKETS = [
  { max: 6000, rate: 19 },
  { max: 50000, rate: 21 },
  { max: 200000, rate: 23 },
  { max: 300000, rate: 27 },
  { max: Infinity, rate: 28 }
];

interface PurchaseExpense {
  id: string;
  name: string;
  amount: number;
}

interface SaleExpense {
  id: string;
  name: string;
  amount: number;
}

export default function TaxCalculator() {
  // Estados de compra
  const [purchasePrice, setPurchasePrice] = useState(200000);
  const [purchaseExpenses, setPurchaseExpenses] = useState<PurchaseExpense[]>([
    { id: '1', name: 'ITP', amount: 12000 },
    { id: '2', name: 'Notaría', amount: 1250 },
    { id: '3', name: 'Registro', amount: 1000 },
    { id: '4', name: 'Tasación', amount: 300 },
    { id: '5', name: 'Gestoría', amount: 600 }
  ]);
  const [yearsOwned, setYearsOwned] = useState(5);

  // Estados de venta
  const [salePrice, setSalePrice] = useState(280000);
  const [saleExpenses, setSaleExpenses] = useState<SaleExpense[]>([
    { id: '1', name: 'Comisión Inmobiliaria', amount: 8400 },
    { id: '2', name: 'Certificado Energético', amount: 150 }
  ]);

  // Plusvalía municipal
  const [cityTaxRate, setCityTaxRate] = useState(3.0);

  // Reinversión
  const [isReinvestment, setIsReinvestment] = useState(false);

  // Funciones gastos compra
  const addPurchaseExpense = () => {
    setPurchaseExpenses([...purchaseExpenses, {
      id: Date.now().toString(),
      name: '',
      amount: 0
    }]);
  };

  const removePurchaseExpense = (id: string) => {
    setPurchaseExpenses(purchaseExpenses.filter(exp => exp.id !== id));
  };

  const updatePurchaseExpense = (id: string, field: keyof PurchaseExpense, value: any) => {
    setPurchaseExpenses(purchaseExpenses.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  // Funciones gastos venta
  const addSaleExpense = () => {
    setSaleExpenses([...saleExpenses, {
      id: Date.now().toString(),
      name: '',
      amount: 0
    }]);
  };

  const removeSaleExpense = (id: string) => {
    setSaleExpenses(saleExpenses.filter(exp => exp.id !== id));
  };

  const updateSaleExpense = (id: string, field: keyof SaleExpense, value: any) => {
    setSaleExpenses(saleExpenses.map(exp => 
      exp.id === id ? { ...exp, [field]: value } : exp
    ));
  };

  // Cálculos
  const calculateTaxes = () => {
    const totalPurchaseCosts = purchaseExpenses.reduce((sum, exp) => sum + exp.amount, 0);
    const totalSaleCosts = saleExpenses.reduce((sum, exp) => sum + exp.amount, 0);

    const totalAcquisitionCost = purchasePrice + totalPurchaseCosts;
    const capitalGain = salePrice - totalAcquisitionCost - totalSaleCosts;

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

    const cadastralValue = purchasePrice * 0.20;
    const effectiveYears = Math.min(yearsOwned, 20);
    const municipalGainBase = cadastralValue * (cityTaxRate / 100) * effectiveYears;
    const municipalTaxRate = 30;
    const plusvaliaTax = municipalGainBase * (municipalTaxRate / 100);

    const totalTax = irpfTax + plusvaliaTax;
    const netGain = capitalGain - totalTax;

    return {
      capitalGain,
      irpfTax,
      plusvaliaTax,
      totalTax,
      netGain,
      effectiveRate: capitalGain > 0 ? (totalTax / capitalGain) * 100 : 0,
      totalPurchaseCosts,
      totalSaleCosts
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

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">💸 Gastos de compra (desglose)</Label>
                  <button
                    onClick={addPurchaseExpense}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir gasto
                  </button>
                </div>

                {purchaseExpenses.map((expense, index) => (
                  <div key={expense.id} className="bg-blue-50 p-3 rounded-lg space-y-2 border border-blue-200">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Gasto {index + 1}</Label>
                      {purchaseExpenses.length > 1 && (
                        <button
                          onClick={() => removePurchaseExpense(expense.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="text"
                        placeholder="Concepto (ej: ITP)"
                        value={expense.name}
                        onChange={(e) => updatePurchaseExpense(expense.id, 'name', e.target.value)}
                        className="text-sm bg-white"
                      />
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          placeholder="Cantidad"
                          value={expense.amount}
                          onChange={(e) => updatePurchaseExpense(expense.id, 'amount', Number(e.target.value))}
                          className="text-sm bg-white"
                          min={0}
                        />
                        <span className="flex items-center px-2 bg-white rounded text-xs">€</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-blue-100 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-blue-900">Total gastos compra:</span>
                    <span className="text-lg font-bold text-blue-700">{formatCurrency(result.totalPurchaseCosts)}</span>
                  </div>
                </div>
              </div>

              <Separator />

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

              <Separator />

              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="font-semibold">💸 Gastos de venta (desglose)</Label>
                  <button
                    onClick={addSaleExpense}
                    className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                    Añadir gasto
                  </button>
                </div>

                {saleExpenses.map((expense, index) => (
                  <div key={expense.id} className="bg-green-50 p-3 rounded-lg space-y-2 border border-green-200">
                    <div className="flex items-center justify-between">
                      <Label className="text-xs font-medium">Gasto {index + 1}</Label>
                      {saleExpenses.length > 1 && (
                        <button
                          onClick={() => removeSaleExpense(expense.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <Input
                        type="text"
                        placeholder="Concepto"
                        value={expense.name}
                        onChange={(e) => updateSaleExpense(expense.id, 'name', e.target.value)}
                        className="text-sm bg-white"
                      />
                      <div className="flex gap-1">
                        <Input
                          type="number"
                          placeholder="Cantidad"
                          value={expense.amount}
                          onChange={(e) => updateSaleExpense(expense.id, 'amount', Number(e.target.value))}
                          className="text-sm bg-white"
                          min={0}
                        />
                        <span className="flex items-center px-2 bg-white rounded text-xs">€</span>
                      </div>
                    </div>
                  </div>
                ))}

                <div className="bg-green-100 p-3 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-semibold text-green-900">Total gastos venta:</span>
                    <span className="text-lg font-bold text-green-700">{formatCurrency(result.totalSaleCosts)}</span>
                  </div>
                </div>
              </div>

              <Separator />

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

        {/* Panel Resultados */}
        <div className="space-y-4">
          <Card className="border-2 border-purple-300 bg-gradient-to-br from-purple-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <Euro className="w-6 h-6" />
                💰 Ganancia Patrimonial
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className={`text-5xl font-bold mb-2 ${result.capitalGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                {formatCurrency(result.capitalGain)}
              </div>
              <p className="text-sm text-gray-600">
                Precio venta ({formatCurrency(salePrice)}) - Precio compra total ({formatCurrency(purchasePrice + result.totalPurchaseCosts + result.totalSaleCosts)})
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                📊 Impuestos a Pagar
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
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

              <div className="flex justify-between items-center p-4 bg-red-100 rounded-lg">
                <span className="text-base font-bold text-gray-900">TOTAL IMPUESTOS</span>
                <span className="text-2xl font-bold text-red-600">
                  {formatCurrency(result.totalTax)}
                </span>
              </div>

              <div className="text-center text-sm text-gray-600">
                Tipo efectivo: <strong>{result.effectiveRate.toFixed(2)}%</strong> sobre la ganancia
              </div>
            </CardContent>
          </Card>

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

          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-2">⚠️ Importante:</p>
                  <ul className="space-y-1 list-disc list-inside leading-relaxed">
                    <li>Los cálculos son estimados y orientativos</li>
                    <li>El coeficiente de plusvalía municipal varía por ayuntamiento</li>
                    <li>La exención por reinversión solo aplica a vivienda habitual</li>
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
