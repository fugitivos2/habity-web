'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { 
  Calculator, 
  Euro, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  PiggyBank,
  Home,
  Wallet
} from 'lucide-react';

export default function DebtCapacitySimulator() {
  // INGRESOS
  const [netSalary, setNetSalary] = useState(2500);
  const [otherIncome, setOtherIncome] = useState(0);
  const [rental1, setRental1] = useState(0);
  const [rental1Percent, setRental1Percent] = useState(50);
  const [rental2, setRental2] = useState(0);
  const [rental2Percent, setRental2Percent] = useState(50);

  // DEUDAS
  const [currentMortgage, setCurrentMortgage] = useState(0);
  const [loans, setLoans] = useState(0);
  const [creditCards, setCreditCards] = useState(0);
  const [otherDebts, setOtherDebts] = useState(0);

  // PARÁMETROS PRÉSTAMO
  const [ltv, setLtv] = useState(75);
  const [years, setYears] = useState(30);
  const [interestRate, setInterestRate] = useState(3.5);

  // CALCULADORA AHORRO
  const [currentSavings, setCurrentSavings] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);

  // ANÁLISIS ROI
  const [expectedRental, setExpectedRental] = useState(0);
  const [annualExpenses, setAnnualExpenses] = useState(0);

  // RESULTADOS
  const [results, setResults] = useState({
    totalIncome: 0,
    totalDebts: 0,
    availableCapacity: 0,
    maxMonthlyPayment: 0,
    maxPropertyPrice: 0,
    requiredDownPayment: 0,
    loanAmount: 0,
    monthsToSave: 0,
    estimatedDate: '',
    grossROI: 0,
    monthlyCashFlow: 0,
    netROI: 0
  });

  useEffect(() => {
    calculateCapacity();
  }, [
    netSalary, otherIncome, rental1, rental1Percent, rental2, rental2Percent,
    currentMortgage, loans, creditCards, otherDebts,
    ltv, years, interestRate,
    currentSavings, monthlySavings,
    expectedRental, annualExpenses
  ]);

  const calculateCapacity = () => {
    // INGRESOS TOTALES
    const rental1Valid = rental1 * (rental1Percent / 100);
    const rental2Valid = rental2 * (rental2Percent / 100);
    const totalIncome = netSalary + otherIncome + rental1Valid + rental2Valid;

    // DEUDAS TOTALES
    const totalDebts = currentMortgage + loans + creditCards + otherDebts;

    // CAPACIDAD DISPONIBLE
    const availableCapacity = totalIncome - totalDebts;

    // CUOTA MÁXIMA (40% de la capacidad disponible)
    const maxMonthlyPayment = availableCapacity * 0.40;

    // CALCULAR PRECIO MÁXIMO VIVIENDA
    const monthlyRate = (interestRate / 100) / 12;
    const numPayments = years * 12;
    
    let loanAmount = 0;
    if (monthlyRate > 0) {
      loanAmount = maxMonthlyPayment * ((1 - Math.pow(1 + monthlyRate, -numPayments)) / monthlyRate);
    } else {
      loanAmount = maxMonthlyPayment * numPayments;
    }

    // Con el LTV calculamos el precio total
    const maxPropertyPrice = loanAmount / (ltv / 100);
    const requiredDownPayment = maxPropertyPrice - loanAmount;

    // CALCULADORA AHORRO
    let monthsToSave = 0;
    let estimatedDate = '';
    
    if (monthlySavings > 0 && requiredDownPayment > currentSavings) {
      const remaining = requiredDownPayment - currentSavings;
      monthsToSave = Math.ceil(remaining / monthlySavings);
      
      const futureDate = new Date();
      futureDate.setMonth(futureDate.getMonth() + monthsToSave);
      estimatedDate = futureDate.toLocaleDateString('es-ES', { 
        month: 'long', 
        year: 'numeric' 
      });
    } else if (currentSavings >= requiredDownPayment) {
      monthsToSave = 0;
      estimatedDate = 'Ya tienes la entrada completa';
    }

    // ANÁLISIS ROI
    let grossROI = 0;
    let monthlyCashFlow = 0;
    let netROI = 0;

    if (maxPropertyPrice > 0 && expectedRental > 0) {
      const annualRental = expectedRental * 12;
      const netAnnualIncome = annualRental - annualExpenses;
      
      grossROI = (annualRental / maxPropertyPrice) * 100;
      netROI = (netAnnualIncome / maxPropertyPrice) * 100;
      
      const monthlyMortgagePayment = maxMonthlyPayment;
      const monthlyExpenses = annualExpenses / 12;
      monthlyCashFlow = expectedRental - monthlyMortgagePayment - monthlyExpenses;
    }

    setResults({
      totalIncome: Math.round(totalIncome),
      totalDebts: Math.round(totalDebts),
      availableCapacity: Math.round(availableCapacity),
      maxMonthlyPayment: Math.round(maxMonthlyPayment),
      maxPropertyPrice: Math.round(maxPropertyPrice),
      requiredDownPayment: Math.round(requiredDownPayment),
      loanAmount: Math.round(loanAmount),
      monthsToSave,
      estimatedDate,
      grossROI: Math.round(grossROI * 10) / 10,
      monthlyCashFlow: Math.round(monthlyCashFlow),
      netROI: Math.round(netROI * 10) / 10
    });
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="w-6 h-6 text-blue-600" />
            Simulador de Capacidad de Endeudamiento
          </CardTitle>
          <CardDescription className="text-base">
            Calcula cuánto puedes pedir prestado según tus ingresos y deudas actuales
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* INGRESOS */}
        <Card className="border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-green-700">
              <TrendingUp className="w-5 h-5" />
              💸 Ingresos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Salario Neto */}
            <div className="space-y-2">
              <Label htmlFor="netSalary">Salario neto mensual</Label>
              <div className="flex gap-2">
                <Input
                  id="netSalary"
                  type="number"
                  value={netSalary}
                  onChange={(e) => setNetSalary(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">
                  €/mes
                </span>
              </div>
            </div>

            {/* Otros Ingresos */}
            <div className="space-y-2">
              <Label htmlFor="otherIncome">Otros ingresos mensuales</Label>
              <div className="flex gap-2">
                <Input
                  id="otherIncome"
                  type="number"
                  value={otherIncome}
                  onChange={(e) => setOtherIncome(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">
                  €/mes
                </span>
              </div>
            </div>

            <Separator />

            {/* Alquiler 1 */}
            <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
              <Label htmlFor="rental1">Alquiler 1</Label>
              <div className="flex gap-2">
                <Input
                  id="rental1"
                  type="number"
                  value={rental1}
                  onChange={(e) => setRental1(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-white rounded-md text-sm font-medium">
                  €/mes
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rental1Percent" className="text-sm">% válido para el banco</Label>
                  <span className="text-sm font-semibold text-blue-600">{rental1Percent}%</span>
                </div>
                <Input
                  id="rental1Percent"
                  type="number"
                  min="0"
                  max="100"
                  value={rental1Percent}
                  onChange={(e) => setRental1Percent(Number(e.target.value))}
                  className="w-24"
                />
              </div>

              <div className="flex items-start gap-2 text-xs text-gray-600 bg-white p-2 rounded">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>La mayoría de los bancos lo computan al 50%</p>
              </div>
            </div>

            {/* Alquiler 2 */}
            <div className="space-y-3 bg-blue-50 p-4 rounded-lg">
              <Label htmlFor="rental2">Alquiler 2</Label>
              <div className="flex gap-2">
                <Input
                  id="rental2"
                  type="number"
                  value={rental2}
                  onChange={(e) => setRental2(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-white rounded-md text-sm font-medium">
                  €/mes
                </span>
              </div>
              
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="rental2Percent" className="text-sm">% válido para el banco</Label>
                  <span className="text-sm font-semibold text-blue-600">{rental2Percent}%</span>
                </div>
                <Input
                  id="rental2Percent"
                  type="number"
                  min="0"
                  max="100"
                  value={rental2Percent}
                  onChange={(e) => setRental2Percent(Number(e.target.value))}
                  className="w-24"
                />
              </div>

              <div className="flex items-start gap-2 text-xs text-gray-600 bg-white p-2 rounded">
                <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <p>La mayoría de los bancos lo computan al 50%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* DEUDAS */}
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-5 h-5" />
              ⚠️ Deudas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Hipoteca Actual */}
            <div className="space-y-2">
              <Label htmlFor="currentMortgage">Hipoteca actual</Label>
              <div className="flex gap-2">
                <Input
                  id="currentMortgage"
                  type="number"
                  value={currentMortgage}
                  onChange={(e) => setCurrentMortgage(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">
                  €/mes
                </span>
              </div>
            </div>

            {/* Préstamos */}
            <div className="space-y-2">
              <Label htmlFor="loans">Préstamos personales</Label>
              <div className="flex gap-2">
                <Input
                  id="loans"
                  type="number"
                  value={loans}
                  onChange={(e) => setLoans(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">
                  €/mes
                </span>
              </div>
            </div>

            {/* Tarjetas de Crédito */}
            <div className="space-y-2">
              <Label htmlFor="creditCards">Tarjetas de crédito</Label>
              <div className="flex gap-2">
                <Input
                  id="creditCards"
                  type="number"
                  value={creditCards}
                  onChange={(e) => setCreditCards(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">
                  €/mes
                </span>
              </div>
            </div>

            {/* Otras Deudas */}
            <div className="space-y-2">
              <Label htmlFor="otherDebts">Otras deudas</Label>
              <div className="flex gap-2">
                <Input
                  id="otherDebts"
                  type="number"
                  value={otherDebts}
                  onChange={(e) => setOtherDebts(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">
                  €/mes
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* PARÁMETROS DEL PRÉSTAMO */}
      <Card className="border-purple-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="w-5 h-5 text-purple-600" />
            📈 Parámetros del Préstamo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* LTV */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>LTV (Loan-to-Value)</Label>
                <span className="text-lg font-bold text-purple-600">{ltv}%</span>
              </div>
              <Slider
                value={[ltv]}
                onValueChange={(value) => setLtv(value[0])}
                min={50}
                max={95}
                step={5}
                className="w-full"
              />
              <p className="text-xs text-gray-500">% del precio que financia el banco</p>
            </div>

            {/* Plazo */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Plazo</Label>
                <span className="text-lg font-bold text-purple-600">{years} años</span>
              </div>
              <Slider
                value={[years]}
                onValueChange={(value) => setYears(value[0])}
                min={5}
                max={40}
                step={1}
                className="w-full"
              />
              <Input
                type="number"
                value={years}
                onChange={(e) => setYears(Number(e.target.value))}
                min="5"
                max="40"
                className="w-20"
              />
            </div>

            {/* Interés */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Interés</Label>
                <span className="text-lg font-bold text-purple-600">{interestRate}%</span>
              </div>
              <Slider
                value={[interestRate]}
                onValueChange={(value) => setInterestRate(value[0])}
                min={0.5}
                max={10}
                step={0.1}
                className="w-full"
              />
              <Input
                type="number"
                value={interestRate}
                onChange={(e) => setInterestRate(Number(e.target.value))}
                min="0.5"
                max="10"
                step="0.1"
                className="w-20"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* RESULTADOS */}
      <Card className="border-blue-300 bg-gradient-to-br from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="w-6 h-6 text-blue-600" />
            🎯 Resultados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-100 p-4 rounded-lg">
              <p className="text-sm text-green-700 font-medium">✅ Ingresos totales</p>
              <p className="text-2xl font-bold text-green-900">{formatCurrency(results.totalIncome)} €/mes</p>
            </div>
            
            <div className="bg-red-100 p-4 rounded-lg">
              <p className="text-sm text-red-700 font-medium">❌ Deudas totales</p>
              <p className="text-2xl font-bold text-red-900">{formatCurrency(results.totalDebts)} €/mes</p>
            </div>
            
            <div className="bg-blue-100 p-4 rounded-lg">
              <p className="text-sm text-blue-700 font-medium">💚 Capacidad disponible</p>
              <p className="text-2xl font-bold text-blue-900">{formatCurrency(results.availableCapacity)} €/mes</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-blue-300">
              <p className="text-sm text-gray-600 mb-1">🏦 CUOTA MÁXIMA HIPOTECA</p>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(results.maxMonthlyPayment)} €/mes</p>
              <p className="text-xs text-gray-500 mt-1">(40% de ingresos - deudas)</p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-green-300">
              <p className="text-sm text-gray-600 mb-1">🏠 PRECIO MÁXIMO VIVIENDA</p>
              <p className="text-3xl font-bold text-green-600">{formatCurrency(results.maxPropertyPrice)} €</p>
              <p className="text-xs text-gray-500 mt-1">
                (con LTV {ltv}% y entrada {formatCurrency(results.requiredDownPayment)} €)
              </p>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-2 border-orange-300">
              <p className="text-sm text-gray-600 mb-1">💰 ENTRADA NECESARIA</p>
              <p className="text-3xl font-bold text-orange-600">{formatCurrency(results.requiredDownPayment)} €</p>
              <p className="text-xs text-gray-500 mt-1">({100 - ltv}% del precio)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CALCULADORA DE AHORRO */}
      <Card className="border-yellow-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-yellow-600" />
            💵 Calculadora de Ahorro para Entrada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="currentSavings">Ahorro actual</Label>
              <div className="flex gap-2">
                <Input
                  id="currentSavings"
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">€</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="monthlySavings">Ahorro mensual</Label>
              <div className="flex gap-2">
                <Input
                  id="monthlySavings"
                  type="number"
                  value={monthlySavings}
                  onChange={(e) => setMonthlySavings(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">€</span>
              </div>
            </div>
          </div>

          {monthlySavings > 0 && (
            <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-300">
              <div className="flex items-center gap-3 mb-3">
                <Calendar className="w-6 h-6 text-yellow-600" />
                <p className="text-lg font-semibold text-gray-700">⏱️ TIEMPO PARA ENTRADA:</p>
              </div>
              <p className="text-4xl font-bold text-yellow-600 mb-2">
                {results.monthsToSave} {results.monthsToSave === 1 ? 'mes' : 'meses'}
              </p>
              <p className="text-sm text-gray-600">
                📅 Fecha estimada: <span className="font-semibold">{results.estimatedDate}</span>
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ANÁLISIS ROI */}
      <Card className="border-indigo-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-indigo-600" />
            📊 Análisis ROI (para inversores)
          </CardTitle>
          <CardDescription>
            Calcula la rentabilidad si compras para alquilar
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="expectedRental">Alquiler esperado</Label>
              <div className="flex gap-2">
                <Input
                  id="expectedRental"
                  type="number"
                  value={expectedRental}
                  onChange={(e) => setExpectedRental(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">€/mes</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="annualExpenses">Gastos anuales (IBI, seguro, comunidad...)</Label>
              <div className="flex gap-2">
                <Input
                  id="annualExpenses"
                  type="number"
                  value={annualExpenses}
                  onChange={(e) => setAnnualExpenses(Number(e.target.value))}
                  className="flex-1"
                />
                <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">€/año</span>
              </div>
            </div>
          </div>

          {expectedRental > 0 && results.maxPropertyPrice > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
              <div className="bg-green-100 p-4 rounded-lg">
                <p className="text-sm text-green-700 font-medium">💹 ROI BRUTO</p>
                <p className="text-3xl font-bold text-green-900">{results.grossROI}%</p>
                <p className="text-xs text-gray-500">anual</p>
              </div>

              <div className="bg-blue-100 p-4 rounded-lg">
                <p className="text-sm text-blue-700 font-medium">💸 CASH FLOW</p>
                <p className={`text-3xl font-bold ${results.monthlyCashFlow >= 0 ? 'text-blue-900' : 'text-red-600'}`}>
                  {results.monthlyCashFlow >= 0 ? '+' : ''}{formatCurrency(results.monthlyCashFlow)} €
                </p>
                <p className="text-xs text-gray-500">mensual</p>
              </div>

              <div className="bg-purple-100 p-4 rounded-lg">
                <p className="text-sm text-purple-700 font-medium">📈 ROI NETO</p>
                <p className="text-3xl font-bold text-purple-900">{results.netROI}%</p>
                <p className="text-xs text-gray-500">anual (descontando gastos)</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Disclaimer */}
      <Card className="bg-amber-50 border-amber-300">
        <CardContent className="pt-6">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div className="text-sm text-amber-800">
              <p className="font-semibold mb-1">⚠️ Cálculos estimados</p>
              <p>
                Los resultados son orientativos y pueden variar según cada entidad bancaria. 
                Cada banco tiene sus propios criterios de concesión. Consulta con un asesor 
                financiero para obtener un análisis personalizado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
