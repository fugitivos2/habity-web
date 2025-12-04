'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Calculator, 
  Euro, 
  TrendingUp, 
  AlertCircle, 
  Calendar,
  PiggyBank,
  Home,
  Wallet,
  Plus,
  Trash2,
  X
} from 'lucide-react';

// Tipos
interface ExtraIncome {
  id: string;
  name: string;
  amount: number;
  type: 'rental' | 'other';
  bankPercent: number;
}

interface Debt {
  id: string;
  name: string;
  amount: number;
}

interface PropertyExpense {
  id: string;
  name: string;
  amount: number;
}

export default function DebtCapacitySimulator() {
  // INGRESOS
  const [netSalary, setNetSalary] = useState(2500);
  const [extraIncomes, setExtraIncomes] = useState<ExtraIncome[]>([]);

  // DEUDAS
  const [debts, setDebts] = useState<Debt[]>([]);

  // PARÁMETROS PRÉSTAMO
  const [ltv, setLtv] = useState(75);
  const [years, setYears] = useState(30);
  const [interestRate, setInterestRate] = useState(3.5);

  // CALCULADORA AHORRO
  const [currentSavings, setCurrentSavings] = useState(0);
  const [monthlySavings, setMonthlySavings] = useState(0);

  // ANÁLISIS ROI
  const [expectedRental, setExpectedRental] = useState(0);
  const [ibi, setIbi] = useState(0);
  const [homeInsurance, setHomeInsurance] = useState(0);
  const [community, setCommunity] = useState(0);
  const [maintenance, setMaintenance] = useState(0);
  const [garbage, setGarbage] = useState(0);
  const [customExpenses, setCustomExpenses] = useState<PropertyExpense[]>([]);

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
    netROI: 0,
    totalAnnualExpenses: 0
  });

  // FUNCIONES AÑADIR/ELIMINAR INGRESOS
  const addExtraIncome = () => {
    const newIncome: ExtraIncome = {
      id: Date.now().toString(),
      name: '',
      amount: 0,
      type: 'other',
      bankPercent: 100
    };
    setExtraIncomes([...extraIncomes, newIncome]);
  };

  const removeExtraIncome = (id: string) => {
    setExtraIncomes(extraIncomes.filter(income => income.id !== id));
  };

  const updateExtraIncome = (id: string, field: keyof ExtraIncome, value: any) => {
    setExtraIncomes(extraIncomes.map(income => 
      income.id === id ? { ...income, [field]: value } : income
    ));
  };

  // FUNCIONES AÑADIR/ELIMINAR DEUDAS
  const addDebt = () => {
    const newDebt: Debt = {
      id: Date.now().toString(),
      name: '',
      amount: 0
    };
    setDebts([...debts, newDebt]);
  };

  const removeDebt = (id: string) => {
    setDebts(debts.filter(debt => debt.id !== id));
  };

  const updateDebt = (id: string, field: keyof Debt, value: any) => {
    setDebts(debts.map(debt => 
      debt.id === id ? { ...debt, [field]: value } : debt
    ));
  };

  // FUNCIONES AÑADIR/ELIMINAR GASTOS PERSONALIZADOS ROI
  const addCustomExpense = () => {
    const newExpense: PropertyExpense = {
      id: Date.now().toString(),
      name: '',
      amount: 0
    };
    setCustomExpenses([...customExpenses, newExpense]);
  };

  const removeCustomExpense = (id: string) => {
    setCustomExpenses(customExpenses.filter(expense => expense.id !== id));
  };

  const updateCustomExpense = (id: string, field: keyof PropertyExpense, value: any) => {
    setCustomExpenses(customExpenses.map(expense => 
      expense.id === id ? { ...expense, [field]: value } : expense
    ));
  };

  useEffect(() => {
    calculateCapacity();
  }, [
    netSalary, extraIncomes, debts, ltv, years, interestRate,
    currentSavings, monthlySavings, expectedRental,
    ibi, homeInsurance, community, maintenance, garbage, customExpenses
  ]);

  const calculateCapacity = () => {
    // INGRESOS TOTALES
    const extraIncomesTotal = extraIncomes.reduce((sum, income) => {
      const validAmount = income.amount * (income.bankPercent / 100);
      return sum + validAmount;
    }, 0);
    const totalIncome = netSalary + extraIncomesTotal;

    // DEUDAS TOTALES
    const totalDebts = debts.reduce((sum, debt) => sum + debt.amount, 0);

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

    // ANÁLISIS ROI - Gastos desmenuzados
    const customExpensesTotal = customExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalAnnualExpenses = ibi + homeInsurance + community + maintenance + garbage + customExpensesTotal;

    let grossROI = 0;
    let monthlyCashFlow = 0;
    let netROI = 0;

    if (maxPropertyPrice > 0 && expectedRental > 0) {
      const annualRental = expectedRental * 12;
      const netAnnualIncome = annualRental - totalAnnualExpenses;
      
      grossROI = (annualRental / maxPropertyPrice) * 100;
      netROI = (netAnnualIncome / maxPropertyPrice) * 100;
      
      const monthlyMortgagePayment = maxMonthlyPayment;
      const monthlyExpenses = totalAnnualExpenses / 12;
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
      netROI: Math.round(netROI * 10) / 10,
      totalAnnualExpenses: Math.round(totalAnnualExpenses)
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
            {/* Salario Neto (fijo) */}
            <div className="space-y-2">
              <Label htmlFor="netSalary" className="font-semibold">Salario neto mensual</Label>
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

            <Separator />

            {/* Ingresos Extra Dinámicos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Ingresos adicionales</Label>
                <button
                  onClick={addExtraIncome}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Añadir ingreso
                </button>
              </div>

              {extraIncomes.length === 0 && (
                <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
                  No hay ingresos adicionales. Haz clic en "Añadir ingreso" para agregar.
                </div>
              )}

              {extraIncomes.map((income) => (
                <div key={income.id} className="bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Ingreso #{income.id.slice(-4)}</Label>
                    <button
                      onClick={() => removeExtraIncome(income.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Nombre del ingreso */}
                  <div className="space-y-1">
                    <Label htmlFor={`income-name-${income.id}`} className="text-xs">Nombre/Descripción</Label>
                    <Input
                      id={`income-name-${income.id}`}
                      type="text"
                      placeholder="Ej: Alquiler piso Madrid, Freelance, Pensión..."
                      value={income.name}
                      onChange={(e) => updateExtraIncome(income.id, 'name', e.target.value)}
                      className="text-sm"
                    />
                  </div>

                  {/* Tipo de ingreso */}
                  <div className="space-y-1">
                    <Label htmlFor={`income-type-${income.id}`} className="text-xs">Tipo de ingreso</Label>
                    <Select
                      value={income.type}
                      onValueChange={(value) => {
                        updateExtraIncome(income.id, 'type', value);
                        // Si cambia a "other", poner % al 100%
                        if (value === 'other') {
                          updateExtraIncome(income.id, 'bankPercent', 100);
                        } else {
                          updateExtraIncome(income.id, 'bankPercent', 50);
                        }
                      }}
                    >
                      <SelectTrigger id={`income-type-${income.id}`} className="w-full bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-white">
                        <SelectItem value="other">Otro ingreso</SelectItem>
                        <SelectItem value="rental">Alquiler</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Cantidad */}
                  <div className="space-y-1">
                    <Label htmlFor={`income-amount-${income.id}`} className="text-xs">Cantidad</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`income-amount-${income.id}`}
                        type="number"
                        value={income.amount}
                        onChange={(e) => updateExtraIncome(income.id, 'amount', Number(e.target.value))}
                        className="flex-1"
                      />
                      <span className="flex items-center px-3 bg-white rounded-md text-xs font-medium">€/mes</span>
                    </div>
                  </div>

                  {/* % válido banco (solo si es alquiler) */}
                  {income.type === 'rental' && (
                    <div className="space-y-2 bg-white p-3 rounded border border-blue-300">
                      <div className="flex items-center justify-between">
                        <Label htmlFor={`income-percent-${income.id}`} className="text-xs">% válido para el banco</Label>
                        <span className="text-sm font-bold text-blue-600">{income.bankPercent}%</span>
                      </div>
                      <Input
                        id={`income-percent-${income.id}`}
                        type="number"
                        min="0"
                        max="100"
                        value={income.bankPercent}
                        onChange={(e) => updateExtraIncome(income.id, 'bankPercent', Number(e.target.value))}
                        className="w-24"
                      />
                      <div className="flex items-start gap-2 text-xs text-gray-600">
                        <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                        <p>La mayoría de los bancos lo computan al 50%</p>
                      </div>
                    </div>
                  )}

                  {/* Resumen calculado */}
                  <div className="text-xs text-gray-600 bg-white p-2 rounded">
                    <strong>Computa:</strong> {formatCurrency(income.amount * (income.bankPercent / 100))} € 
                    {income.type === 'rental' && income.bankPercent < 100 && (
                      <span className="text-gray-500"> ({income.bankPercent}% de {formatCurrency(income.amount)} €)</span>
                    )}
                  </div>
                </div>
              ))}
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
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="font-semibold">Cuotas mensuales</Label>
                <button
                  onClick={addDebt}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Añadir cuota/gasto
                </button>
              </div>

              {debts.length === 0 && (
                <div className="text-center py-6 text-sm text-gray-500 bg-gray-50 rounded-lg border-2 border-dashed">
                  No hay deudas registradas. Haz clic en "Añadir cuota/gasto" para agregar.
                </div>
              )}

              {debts.map((debt) => (
                <div key={debt.id} className="bg-red-50 p-4 rounded-lg space-y-3 border border-red-200">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Deuda #{debt.id.slice(-4)}</Label>
                    <button
                      onClick={() => removeDebt(debt.id)}
                      className="text-red-600 hover:text-red-800 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Nombre de la deuda */}
                  <div className="space-y-1">
                    <Label htmlFor={`debt-name-${debt.id}`} className="text-xs">Nombre/Descripción</Label>
                    <Input
                      id={`debt-name-${debt.id}`}
                      type="text"
                      placeholder="Ej: Hipoteca 1, Crédito coche, Tarjeta Visa..."
                      value={debt.name}
                      onChange={(e) => updateDebt(debt.id, 'name', e.target.value)}
                      className="text-sm bg-white"
                    />
                  </div>

                  {/* Cuota mensual */}
                  <div className="space-y-1">
                    <Label htmlFor={`debt-amount-${debt.id}`} className="text-xs">Cuota mensual</Label>
                    <div className="flex gap-2">
                      <Input
                        id={`debt-amount-${debt.id}`}
                        type="number"
                        value={debt.amount}
                        onChange={(e) => updateDebt(debt.id, 'amount', Number(e.target.value))}
                        className="flex-1 bg-white"
                      />
                      <span className="flex items-center px-3 bg-white rounded-md text-xs font-medium">€/mes</span>
                    </div>
                  </div>
                </div>
              ))}
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

      {/* ANÁLISIS ROI - DESMENUZADO */}
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
        <CardContent className="space-y-6">
          {/* Alquiler esperado */}
          <div className="space-y-2">
            <Label htmlFor="expectedRental" className="font-semibold">Alquiler esperado</Label>
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

          <Separator />

          {/* Gastos anuales desmenuzados */}
          <div className="space-y-4">
            <Label className="font-semibold text-lg">📋 Gastos anuales de la propiedad</Label>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* IBI */}
              <div className="space-y-2">
                <Label htmlFor="ibi" className="text-sm">IBI (Impuesto Bienes Inmuebles)</Label>
                <div className="flex gap-2">
                  <Input
                    id="ibi"
                    type="number"
                    value={ibi}
                    onChange={(e) => setIbi(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-xs font-medium">€/año</span>
                </div>
              </div>

              {/* Seguro */}
              <div className="space-y-2">
                <Label htmlFor="homeInsurance" className="text-sm">Seguro hogar</Label>
                <div className="flex gap-2">
                  <Input
                    id="homeInsurance"
                    type="number"
                    value={homeInsurance}
                    onChange={(e) => setHomeInsurance(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-xs font-medium">€/año</span>
                </div>
              </div>

              {/* Comunidad */}
              <div className="space-y-2">
                <Label htmlFor="community" className="text-sm">Comunidad propietarios</Label>
                <div className="flex gap-2">
                  <Input
                    id="community"
                    type="number"
                    value={community}
                    onChange={(e) => setCommunity(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-xs font-medium">€/año</span>
                </div>
              </div>

              {/* Mantenimiento */}
              <div className="space-y-2">
                <Label htmlFor="maintenance" className="text-sm">Mantenimiento/reparaciones</Label>
                <div className="flex gap-2">
                  <Input
                    id="maintenance"
                    type="number"
                    value={maintenance}
                    onChange={(e) => setMaintenance(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-xs font-medium">€/año</span>
                </div>
              </div>

              {/* Basura */}
              <div className="space-y-2">
                <Label htmlFor="garbage" className="text-sm">Basura (si no está en IBI)</Label>
                <div className="flex gap-2">
                  <Input
                    id="garbage"
                    type="number"
                    value={garbage}
                    onChange={(e) => setGarbage(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-xs font-medium">€/año</span>
                </div>
              </div>
            </div>

            {/* Gastos personalizados */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Otros gastos personalizados</Label>
                <button
                  onClick={addCustomExpense}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Añadir gasto
                </button>
              </div>

              {customExpenses.map((expense) => (
                <div key={expense.id} className="bg-indigo-50 p-3 rounded-lg space-y-2 border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Gasto #{expense.id.slice(-4)}</Label>
                    <button
                      onClick={() => removeCustomExpense(expense.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="text"
                      placeholder="Nombre (ej: Derrama)"
                      value={expense.name}
                      onChange={(e) => updateCustomExpense(expense.id, 'name', e.target.value)}
                      className="text-xs bg-white"
                    />
                    <div className="flex gap-1">
                      <Input
                        type="number"
                        value={expense.amount}
                        onChange={(e) => updateCustomExpense(expense.id, 'amount', Number(e.target.value))}
                        className="text-xs bg-white"
                      />
                      <span className="flex items-center px-2 bg-white rounded text-xs">€/año</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total gastos */}
            <div className="bg-gray-100 p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <span className="font-semibold">TOTAL GASTOS ANUALES:</span>
                <span className="text-xl font-bold text-indigo-600">{formatCurrency(results.totalAnnualExpenses)} €/año</span>
              </div>
            </div>
          </div>

          {/* Resultados ROI */}
          {expectedRental > 0 && results.maxPropertyPrice > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
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
