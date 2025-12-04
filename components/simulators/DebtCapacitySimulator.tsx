'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AUTONOMOUS_REGIONS, type Region } from '@/lib/simulators/purchase-costs';
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
  X,
  FileText
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

interface InitialCost {
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

  // CAPITAL INVERTIDO
  const [region, setRegion] = useState<Region>('Madrid');
  const [isNewProperty, setIsNewProperty] = useState(false);
  const [itpIva, setItpIva] = useState(0);
  const [notaryCost, setNotaryCost] = useState(1500);
  const [registryCost, setRegistryCost] = useState(1000);
  const [agencyCost, setAgencyCost] = useState(800);
  const [appraisalCost, setAppraisalCost] = useState(300);
  const [initialCosts, setInitialCosts] = useState<InitialCost[]>([]);

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
    debtRatio: 0,
    maxAdditionalLoan: 0,
    maxMonthlyPayment: 0,
    maxPropertyPrice: 0,
    requiredDownPayment: 0,
    loanAmount: 0,
    monthsToSave: 0,
    estimatedDate: '',
    purchaseCosts: 0,
    totalCapitalInvested: 0,
    grossROI: 0,
    monthlyCashFlow: 0,
    netROI: 0,
    totalAnnualExpenses: 0,
    realGrossROI: 0,
    realNetROI: 0
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

  // FUNCIONES AÑADIR/ELIMINAR GASTOS INICIALES
  const addInitialCost = () => {
    const newCost: InitialCost = {
      id: Date.now().toString(),
      name: '',
      amount: 0
    };
    setInitialCosts([...initialCosts, newCost]);
  };

  const removeInitialCost = (id: string) => {
    setInitialCosts(initialCosts.filter(cost => cost.id !== id));
  };

  const updateInitialCost = (id: string, field: keyof InitialCost, value: any) => {
    setInitialCosts(initialCosts.map(cost => 
      cost.id === id ? { ...cost, [field]: value } : cost
    ));
  };

  // Auto-calcular ITP/IVA cuando cambia región o tipo vivienda
  useEffect(() => {
    if (results.maxPropertyPrice > 0) {
      const regionData = AUTONOMOUS_REGIONS[region];
      let calculatedTax = 0;

      if (isNewProperty) {
        // IVA 10% + AJD
        const iva = results.maxPropertyPrice * 0.10;
        const ajd = results.maxPropertyPrice * (regionData.ajdRate / 100);
        calculatedTax = iva + ajd;
      } else {
        // ITP
        calculatedTax = results.maxPropertyPrice * (regionData.itpRate / 100);
      }

      setItpIva(Math.round(calculatedTax));
    }
  }, [region, isNewProperty, results.maxPropertyPrice]);

  useEffect(() => {
    calculateCapacity();
  }, [
    netSalary, extraIncomes, debts, ltv, years, interestRate,
    currentSavings, monthlySavings, expectedRental,
    ibi, homeInsurance, community, maintenance, garbage, customExpenses,
    region, isNewProperty, itpIva, notaryCost, registryCost, agencyCost, appraisalCost, initialCosts
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

    // RATIO DE ENDEUDAMIENTO (Deudas / Ingresos)
    const debtRatio = totalIncome > 0 ? (totalDebts / totalIncome) * 100 : 0;

    // PRÉSTAMO ADICIONAL MÁXIMO
    // El banco permite hasta 40% de endeudamiento
    const maxAllowedDebt = totalIncome * 0.40;
    const maxAdditionalLoan = maxAllowedDebt - totalDebts;

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

    // CAPITAL INVERTIDO
    const purchaseCosts = itpIva + notaryCost + registryCost + agencyCost + appraisalCost;
    const initialCostsTotal = initialCosts.reduce((sum, cost) => sum + cost.amount, 0);
    const totalCapitalInvested = requiredDownPayment + purchaseCosts + initialCostsTotal;

    // ANÁLISIS ROI - Gastos desmenuzados
    const customExpensesTotal = customExpenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalAnnualExpenses = ibi + homeInsurance + community + maintenance + garbage + customExpensesTotal;

    let grossROI = 0;
    let monthlyCashFlow = 0;
    let netROI = 0;
    let realGrossROI = 0;
    let realNetROI = 0;

    if (maxPropertyPrice > 0 && expectedRental > 0) {
      const annualRental = expectedRental * 12;
      const netAnnualIncome = annualRental - totalAnnualExpenses;
      
      // ROI sobre precio total (tradicional)
      grossROI = (annualRental / maxPropertyPrice) * 100;
      netROI = (netAnnualIncome / maxPropertyPrice) * 100;
      
      // ROI REAL sobre capital invertido
      if (totalCapitalInvested > 0) {
        realGrossROI = (annualRental / totalCapitalInvested) * 100;
        realNetROI = (netAnnualIncome / totalCapitalInvested) * 100;
      }
      
      const monthlyMortgagePayment = maxMonthlyPayment;
      const monthlyExpenses = totalAnnualExpenses / 12;
      monthlyCashFlow = expectedRental - monthlyMortgagePayment - monthlyExpenses;
    }

    setResults({
      totalIncome: Math.round(totalIncome),
      totalDebts: Math.round(totalDebts),
      availableCapacity: Math.round(availableCapacity),
      debtRatio: Math.round(debtRatio * 10) / 10,
      maxAdditionalLoan: Math.round(Math.max(0, maxAdditionalLoan)),
      maxMonthlyPayment: Math.round(maxMonthlyPayment),
      maxPropertyPrice: Math.round(maxPropertyPrice),
      requiredDownPayment: Math.round(requiredDownPayment),
      loanAmount: Math.round(loanAmount),
      monthsToSave,
      estimatedDate,
      purchaseCosts: Math.round(purchaseCosts),
      totalCapitalInvested: Math.round(totalCapitalInvested),
      grossROI: Math.round(grossROI * 10) / 10,
      monthlyCashFlow: Math.round(monthlyCashFlow),
      netROI: Math.round(netROI * 10) / 10,
      totalAnnualExpenses: Math.round(totalAnnualExpenses),
      realGrossROI: Math.round(realGrossROI * 10) / 10,
      realNetROI: Math.round(realNetROI * 10) / 10
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
            <CardTitle className="flex items-center justify-between text-green-700">
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                💸 Ingresos
              </div>
              {extraIncomes.length > 0 && (
                <span className="text-sm bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">
                  {extraIncomes.length} {extraIncomes.length === 1 ? 'adicional' : 'adicionales'}
                </span>
              )}
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

              {extraIncomes.map((income, index) => (
                <div key={income.id} className="bg-blue-50 p-4 rounded-lg space-y-3 border border-blue-200">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Ingreso {index + 1}</Label>
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
            <CardTitle className="flex items-center justify-between text-red-700">
              <div className="flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                ⚠️ Deudas
              </div>
              {debts.length > 0 && (
                <span className="text-sm bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">
                  {debts.length} {debts.length === 1 ? 'deuda' : 'deudas'}
                </span>
              )}
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

              {debts.map((debt, index) => (
                <div key={debt.id} className="bg-red-50 p-4 rounded-lg space-y-3 border border-red-200">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Gasto {index + 1}</Label>
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

      {/* RESULTADOS */}
      <Card className="border-blue-300 bg-gradient-to-br from-blue-50 to-green-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="w-6 h-6 text-blue-600" />
            🎯 Resultados
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

            <div className={`p-4 rounded-lg ${
              results.debtRatio > 40 
                ? 'bg-red-100 border-2 border-red-300' 
                : 'bg-green-100 border-2 border-green-300'
            }`}>
              <p className={`text-sm font-medium ${
                results.debtRatio > 40 ? 'text-red-700' : 'text-green-700'
              }`}>
                📊 Ratio de endeudamiento
              </p>
              <p className={`text-2xl font-bold ${
                results.debtRatio > 40 ? 'text-red-900' : 'text-green-900'
              }`}>
                {results.debtRatio.toFixed(1)}%
              </p>
              <p className="text-xs text-gray-600 mt-1">
                (Deudas / Ingresos)
              </p>
            </div>
          </div>

          {/* Alerta dinámica según ratio */}
          {results.totalIncome > 0 && (
            <div className="mt-4">
              {results.debtRatio > 40 ? (
                <div className="bg-red-50 border-2 border-red-300 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">😞</span>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-red-800 mb-2">
                        ⚠️ Has sobrepasado tu límite de endeudamiento
                      </p>
                      <p className="text-sm text-red-700">
                        Tu ratio de endeudamiento actual es del <strong>{results.debtRatio.toFixed(1)}%</strong>, 
                        superando el <strong>40%</strong> recomendado por los bancos.
                      </p>
                      <p className="text-sm text-red-700 mt-2">
                        📊 <strong>Recomendación:</strong> Reduce tus deudas en al menos{' '}
                        <strong>{formatCurrency(Math.abs(results.maxAdditionalLoan))} €/mes</strong> para poder 
                        solicitar nuevos préstamos.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-green-50 border-2 border-green-300 p-5 rounded-lg">
                  <div className="flex items-start gap-3">
                    <span className="text-4xl">😊</span>
                    <div className="flex-1">
                      <p className="text-lg font-bold text-green-800 mb-2">
                        ✅ Tu nivel de endeudamiento es saludable
                      </p>
                      <p className="text-sm text-green-700">
                        Tu ratio de endeudamiento actual es del <strong>{results.debtRatio.toFixed(1)}%</strong>, 
                        por debajo del <strong>40%</strong> máximo admitido por los bancos.
                      </p>
                      {results.maxAdditionalLoan > 0 && (
                        <p className="text-sm text-green-700 mt-2">
                          💰 <strong>Buenas noticias:</strong> Podrías obtener un préstamo adicional de hasta{' '}
                          <strong>{formatCurrency(results.maxAdditionalLoan)} €/mes</strong> en cuota, 
                          manteniendo el 40% de endeudamiento.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

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

      {/* CAPITAL INVERTIDO */}
      <Card className="border-orange-300 bg-gradient-to-br from-orange-50 to-yellow-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Euro className="w-5 h-5 text-orange-600" />
            💰 Capital Invertido (para ROI real)
          </CardTitle>
          <CardDescription>
            Calcula el dinero que realmente sales de tu bolsillo para la inversión
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Entrada automática */}
          <div className="bg-white p-4 rounded-lg border-2 border-orange-200">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium text-gray-700">Entrada ({100 - ltv}% LTV)</span>
              <span className="text-xl font-bold text-orange-600">{formatCurrency(results.requiredDownPayment)} €</span>
            </div>
            <p className="text-xs text-gray-500 mt-1">Calculado automáticamente según LTV</p>
          </div>

          <Separator />

          {/* Gastos de compra */}
          <div className="space-y-4">
            <Label className="font-semibold text-lg">📋 Gastos de compra (calculados)</Label>
            
            {/* Región y tipo vivienda */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="region">Comunidad Autónoma</Label>
                <Select
                  value={region}
                  onValueChange={(value) => setRegion(value as Region)}
                >
                  <SelectTrigger id="region" className="w-full bg-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="max-h-80 bg-white">
                    {Object.keys(AUTONOMOUS_REGIONS).map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Tipo de vivienda</Label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setIsNewProperty(false)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      !isNewProperty
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-semibold">Segunda Mano</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsNewProperty(true)}
                    className={`p-3 rounded-lg border-2 transition-all ${
                      isNewProperty
                        ? 'border-orange-500 bg-orange-50 text-orange-700'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <div className="text-sm font-semibold">Obra Nueva</div>
                  </button>
                </div>
              </div>
            </div>

            {/* Gastos editables */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* ITP/IVA */}
              <div className="space-y-2">
                <Label htmlFor="itpIva" className="text-sm">
                  {isNewProperty ? 'IVA + AJD' : `ITP (${AUTONOMOUS_REGIONS[region].itpRate}%)`}
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="itpIva"
                    type="number"
                    value={itpIva}
                    onChange={(e) => setItpIva(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-xs font-medium">€</span>
                </div>
                <p className="text-xs text-gray-500">Auto-calculado, puedes editarlo</p>
              </div>

              {/* Notaría */}
              <div className="space-y-2">
                <Label htmlFor="notaryCost" className="text-sm">Notaría (estimado)</Label>
                <div className="flex gap-2">
                  <Input
                    id="notaryCost"
                    type="number"
                    value={notaryCost}
                    onChange={(e) => setNotaryCost(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-xs font-medium">€</span>
                </div>
              </div>

              {/* Registro */}
              <div className="space-y-2">
                <Label htmlFor="registryCost" className="text-sm">Registro Propiedad</Label>
                <div className="flex gap-2">
                  <Input
                    id="registryCost"
                    type="number"
                    value={registryCost}
                    onChange={(e) => setRegistryCost(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-xs font-medium">€</span>
                </div>
              </div>

              {/* Gestoría */}
              <div className="space-y-2">
                <Label htmlFor="agencyCost" className="text-sm">Gestoría</Label>
                <div className="flex gap-2">
                  <Input
                    id="agencyCost"
                    type="number"
                    value={agencyCost}
                    onChange={(e) => setAgencyCost(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-xs font-medium">€</span>
                </div>
              </div>

              {/* Tasación */}
              <div className="space-y-2">
                <Label htmlFor="appraisalCost" className="text-sm">Tasación</Label>
                <div className="flex gap-2">
                  <Input
                    id="appraisalCost"
                    type="number"
                    value={appraisalCost}
                    onChange={(e) => setAppraisalCost(Number(e.target.value))}
                    className="flex-1"
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-xs font-medium">€</span>
                </div>
              </div>
            </div>

            {/* Gastos iniciales extra */}
            <div className="space-y-3 mt-4">
              <div className="flex items-center justify-between">
                <Label className="font-medium">Otros gastos iniciales</Label>
                <button
                  onClick={addInitialCost}
                  className="flex items-center gap-1 px-3 py-1.5 text-sm bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors"
                >
                  <Plus className="w-4 h-4" />
                  Añadir gasto
                </button>
              </div>
              <p className="text-xs text-gray-500">Ej: Reformas, muebles, electrodomésticos...</p>

              {initialCosts.map((cost, index) => (
                <div key={cost.id} className="bg-orange-50 p-3 rounded-lg space-y-2 border border-orange-200">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Gasto inicial {index + 1}</Label>
                    <button
                      onClick={() => removeInitialCost(cost.id)}
                      className="text-red-500 hover:text-red-700 transition-colors"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Input
                      type="text"
                      placeholder="Nombre (ej: Reformas)"
                      value={cost.name}
                      onChange={(e) => updateInitialCost(cost.id, 'name', e.target.value)}
                      className="text-xs bg-white"
                    />
                    <div className="flex gap-1">
                      <Input
                        type="number"
                        value={cost.amount}
                        onChange={(e) => updateInitialCost(cost.id, 'amount', Number(e.target.value))}
                        className="text-xs bg-white"
                      />
                      <span className="flex items-center px-2 bg-white rounded text-xs">€</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Total capital invertido */}
          <div className="bg-gradient-to-r from-orange-100 to-yellow-100 p-6 rounded-lg border-2 border-orange-400">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Entrada ({100 - ltv}%)</span>
                <span className="font-semibold">{formatCurrency(results.requiredDownPayment)} €</span>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Gastos compra</span>
                <span className="font-semibold">{formatCurrency(results.purchaseCosts)} €</span>
              </div>
              {initialCosts.length > 0 && (
                <div className="flex justify-between items-center text-sm text-gray-600">
                  <span>Gastos iniciales extra</span>
                  <span className="font-semibold">
                    {formatCurrency(initialCosts.reduce((sum, cost) => sum + cost.amount, 0))} €
                  </span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between items-center pt-2">
                <span className="text-lg font-bold text-gray-900">💵 CAPITAL TOTAL INVERTIDO</span>
                <span className="text-3xl font-bold text-orange-600">{formatCurrency(results.totalCapitalInvested)} €</span>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                Este es el dinero real que sales de tu bolsillo. El ROI se calcula sobre esta cantidad.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CALCULADORA DE AHORRO */}
      <Card className="border-yellow-300">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-yellow-600" />
            💵 Calculadora de Ahorro para Inversión Total
          </CardTitle>
          <CardDescription>
            Calcula cuánto tiempo necesitas para reunir el capital invertido total
          </CardDescription>
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

          {monthlySavings > 0 && results.totalCapitalInvested > 0 && (
            <div>
              {currentSavings >= results.totalCapitalInvested ? (
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-300">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-6 h-6 text-green-600" />
                    <p className="text-lg font-semibold text-green-700">✅ ¡Ya tienes el capital completo!</p>
                  </div>
                  <p className="text-sm text-gray-600">
                    Tienes {formatCurrency(currentSavings)} € ahorrados, suficiente para cubrir los {formatCurrency(results.totalCapitalInvested)} € necesarios.
                  </p>
                </div>
              ) : (
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-300">
                  <div className="flex items-center gap-3 mb-3">
                    <Calendar className="w-6 h-6 text-yellow-600" />
                    <p className="text-lg font-semibold text-gray-700">⏱️ TIEMPO PARA CAPITAL COMPLETO:</p>
                  </div>
                  <p className="text-4xl font-bold text-yellow-600 mb-2">
                    {Math.ceil((results.totalCapitalInvested - currentSavings) / monthlySavings)} meses
                  </p>
                  <p className="text-sm text-gray-600">
                    Necesitas: {formatCurrency(results.totalCapitalInvested)} € | Tienes: {formatCurrency(currentSavings)} € | 
                    Faltan: {formatCurrency(results.totalCapitalInvested - currentSavings)} €
                  </p>
                </div>
              )}
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
            Calcula la rentabilidad REAL sobre tu capital invertido
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

              {customExpenses.map((expense, index) => (
                <div key={expense.id} className="bg-indigo-50 p-3 rounded-lg space-y-2 border border-indigo-200">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-medium">Gasto anual {index + 1}</Label>
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
          {expectedRental > 0 && results.maxPropertyPrice > 0 && results.totalCapitalInvested > 0 && (
            <div className="space-y-4">
              <Separator />
              
              <div className="bg-amber-50 border-2 border-amber-300 p-4 rounded-lg">
                <div className="flex items-start gap-2">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-800">
                    <p className="font-semibold mb-1">💡 ROI Real vs ROI Tradicional</p>
                    <p>
                      El <strong>ROI Real</strong> se calcula sobre los <strong>{formatCurrency(results.totalCapitalInvested)} €</strong> que realmente inviertes 
                      (entrada + gastos). Es más realista para inversores que usan financiación.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* ROI REAL */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-indigo-700 flex items-center gap-2">
                    <Wallet className="w-4 h-4" />
                    🎯 ROI REAL (sobre capital invertido)
                  </h4>
                  
                  <div className="bg-green-100 p-4 rounded-lg">
                    <p className="text-sm text-green-700 font-medium">💹 ROI Bruto Real</p>
                    <p className="text-3xl font-bold text-green-900">{results.realGrossROI}%</p>
                    <p className="text-xs text-gray-500">Sobre {formatCurrency(results.totalCapitalInvested)} € invertidos</p>
                  </div>

                  <div className="bg-purple-100 p-4 rounded-lg">
                    <p className="text-sm text-purple-700 font-medium">📈 ROI Neto Real</p>
                    <p className="text-3xl font-bold text-purple-900">{results.realNetROI}%</p>
                    <p className="text-xs text-gray-500">Descontando gastos anuales</p>
                  </div>
                </div>

                {/* ROI TRADICIONAL */}
                <div className="space-y-3">
                  <h4 className="font-semibold text-gray-700 flex items-center gap-2">
                    <FileText className="w-4 h-4" />
                    📊 ROI Tradicional (sobre precio total)
                  </h4>
                  
                  <div className="bg-blue-100 p-4 rounded-lg">
                    <p className="text-sm text-blue-700 font-medium">💹 ROI Bruto</p>
                    <p className="text-3xl font-bold text-blue-900">{results.grossROI}%</p>
                    <p className="text-xs text-gray-500">Sobre {formatCurrency(results.maxPropertyPrice)} € precio vivienda</p>
                  </div>

                  <div className="bg-gray-100 p-4 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium">📈 ROI Neto</p>
                    <p className="text-3xl font-bold text-gray-900">{results.netROI}%</p>
                    <p className="text-xs text-gray-500">Descontando gastos anuales</p>
                  </div>
                </div>
              </div>

              {/* Cash Flow */}
              <div className="bg-blue-100 p-6 rounded-lg">
                <p className="text-sm text-blue-700 font-medium mb-2">💸 CASH FLOW MENSUAL</p>
                <p className={`text-4xl font-bold ${results.monthlyCashFlow >= 0 ? 'text-blue-900' : 'text-red-600'}`}>
                  {results.monthlyCashFlow >= 0 ? '+' : ''}{formatCurrency(results.monthlyCashFlow)} €
                </p>
                <p className="text-xs text-gray-600 mt-2">
                  Alquiler ({formatCurrency(expectedRental)} €) - Cuota hipoteca ({formatCurrency(results.maxMonthlyPayment)} €) - Gastos mensuales ({formatCurrency(Math.round(results.totalAnnualExpenses / 12))} €)
                </p>
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
