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
  TrendingUp, 
  AlertCircle, 
  Plus,
  Trash2,
  PiggyBank,
  Calendar
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



export default function DebtCapacitySimulator() {
  // INGRESOS
  const [netSalary, setNetSalary] = useState(2500);
  const [extraIncomes, setExtraIncomes] = useState<ExtraIncome[]>([]);

  // DEUDAS
  const [debts, setDebts] = useState<Debt[]>([]);

  // PARÁMETROS PRÉSTAMO
  const [ltv] = useState(75); // LTV fijo interno, no visible
  const [years] = useState(30); // Fijo 30 años
  const [interestRate] = useState(3.5); // Fijo 3.5%





  // CALCULADORA DE AHORRO
  const [targetAmount, setTargetAmount] = useState(0); // Cantidad necesaria (editable)
  const [currentSavings, setCurrentSavings] = useState(0); // Cantidad disponible (ahorro actual)
  const [monthlySavings, setMonthlySavings] = useState(0); // Capacidad de ahorro mensual

  // RESULTADOS
  const [results, setResults] = useState({
    totalIncome: 0,
    totalDebts: 0,
    availableCapacity: 0,
    debtRatio: 0,
    maxAdditionalLoan: 0,
    maxMonthlyPayment: 0,
    monthsToSave: 0, // Meses necesarios para alcanzar la cantidad
    estimatedDate: '' // Fecha estimada
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



  useEffect(() => {
    calculateCapacity();
  }, [netSalary, extraIncomes, debts, targetAmount, currentSavings, monthlySavings]);

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

    // CALCULADORA DE AHORRO
    let monthsToSave = 0;
    let estimatedDate = '';
    
    // Si hay cantidad objetivo y capacidad de ahorro mensual
    if (targetAmount > 0 && monthlySavings > 0) {
      if (currentSavings >= targetAmount) {
        // Ya tiene el dinero completo
        monthsToSave = 0;
        estimatedDate = '¡Ya tienes la cantidad necesaria!';
      } else {
        // Calcular cuánto falta y cuántos meses se necesitan
        const remaining = targetAmount - currentSavings;
        monthsToSave = Math.ceil(remaining / monthlySavings);
        
        // Calcular fecha estimada
        const futureDate = new Date();
        futureDate.setMonth(futureDate.getMonth() + monthsToSave);
        estimatedDate = futureDate.toLocaleDateString('es-ES', { 
          month: 'long', 
          year: 'numeric' 
        });
      }
    }

    setResults({
      totalIncome: Math.round(totalIncome),
      totalDebts: Math.round(totalDebts),
      availableCapacity: Math.round(availableCapacity),
      debtRatio: Math.round(debtRatio * 10) / 10,
      maxAdditionalLoan: Math.round(Math.max(0, maxAdditionalLoan)),
      maxMonthlyPayment: Math.round(maxMonthlyPayment),
      monthsToSave,
      estimatedDate
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

                  {/* % válido banco (siempre visible) */}
                  <div className="space-y-2 bg-white p-3 rounded border border-blue-300">
                    <div className="flex items-center justify-between">
                      <Label htmlFor={`income-percent-${income.id}`} className="text-xs">% que computa para el banco</Label>
                      <span className="text-sm font-bold text-blue-600">{income.bankPercent}%</span>
                    </div>
                    <div className="flex gap-2 items-center">
                      <Input
                        id={`income-percent-${income.id}`}
                        type="number"
                        min="0"
                        max="100"
                        value={income.bankPercent}
                        onChange={(e) => updateExtraIncome(income.id, 'bankPercent', Number(e.target.value))}
                        className="w-24"
                      />
                      <span className="text-xs text-gray-500">%</span>
                    </div>
                    <div className="flex items-start gap-2 text-xs text-gray-600 bg-blue-50 p-2 rounded">
                      <AlertCircle className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      <p>Los bancos normalmente computan un <strong>50%</strong></p>
                    </div>
                  </div>

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
              <p className="text-sm text-gray-600 mb-1">🏦 CUOTA MÁXIMA DE NUEVO PRÉSTAMO O HIPOTECA</p>
              <p className="text-3xl font-bold text-blue-600">{formatCurrency(results.maxMonthlyPayment)} €/mes</p>
              <p className="text-xs text-gray-500 mt-1">(40% de ingresos - deudas actuales)</p>
            </div>
          </div>
        </CardContent>
      </Card>




      {/* CALCULADORA DE AHORRO */}
      <Card className="border-yellow-300 bg-gradient-to-br from-yellow-50 to-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PiggyBank className="w-5 h-5 text-yellow-600" />
            💰 Calculadora de Ahorro
          </CardTitle>
          <CardDescription>
            Calcula cuánto tiempo necesitas para reunir la cantidad que necesitas
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Campos de entrada */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Cantidad necesaria */}
            <div className="space-y-2">
              <Label htmlFor="targetAmount" className="font-semibold">💵 Cantidad necesaria</Label>
              <div className="flex gap-2">
                <Input
                  id="targetAmount"
                  type="number"
                  value={targetAmount}
                  onChange={(e) => setTargetAmount(Number(e.target.value))}
                  className="flex-1"
                  placeholder="Ej: 20000"
                  min="0"
                />
                <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">€</span>
              </div>
              <p className="text-xs text-gray-500">¿Cuánto dinero necesitas?</p>
            </div>

            {/* Cantidad disponible (ahorro actual) */}
            <div className="space-y-2">
              <Label htmlFor="currentSavings" className="font-semibold">💳 Cantidad disponible</Label>
              <div className="flex gap-2">
                <Input
                  id="currentSavings"
                  type="number"
                  value={currentSavings}
                  onChange={(e) => setCurrentSavings(Number(e.target.value))}
                  className="flex-1"
                  placeholder="Ej: 5000"
                  min="0"
                />
                <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">€</span>
              </div>
              <p className="text-xs text-gray-500">Ahorro que ya tienes</p>
            </div>

            {/* Capacidad de ahorro mensual */}
            <div className="space-y-2">
              <Label htmlFor="monthlySavings" className="font-semibold">📅 Ahorro mensual</Label>
              <div className="flex gap-2">
                <Input
                  id="monthlySavings"
                  type="number"
                  value={monthlySavings}
                  onChange={(e) => setMonthlySavings(Number(e.target.value))}
                  className="flex-1"
                  placeholder="Ej: 500"
                  min="0"
                />
                <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">€/mes</span>
              </div>
              <p className="text-xs text-gray-500">¿Cuánto ahorras al mes?</p>
            </div>
          </div>

          <Separator />

          {/* Resultados de la calculadora */}
          {targetAmount > 0 && monthlySavings > 0 && (
            <div>
              {currentSavings >= targetAmount ? (
                // Caso: Ya tiene el dinero completo
                <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-lg border-2 border-green-300">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-5xl">🎉</span>
                    <div className="flex-1">
                      <p className="text-2xl font-bold text-green-700 mb-1">¡Ya tienes la cantidad necesaria!</p>
                      <p className="text-sm text-gray-600">
                        Tienes <strong>{formatCurrency(currentSavings)} €</strong> ahorrados, 
                        suficiente para cubrir los <strong>{formatCurrency(targetAmount)} €</strong> que necesitas.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
                // Caso: Todavía necesita ahorrar
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-6 rounded-lg border-2 border-yellow-300">
                  <div className="flex items-start gap-4">
                    <Calendar className="w-8 h-8 text-yellow-600 flex-shrink-0 mt-1" />
                    <div className="flex-1 space-y-4">
                      {/* Título y meses */}
                      <div>
                        <p className="text-lg font-semibold text-gray-700 mb-2">⏱️ Tiempo estimado:</p>
                        <p className="text-5xl font-bold text-yellow-600">
                          {results.monthsToSave} {results.monthsToSave === 1 ? 'mes' : 'meses'}
                        </p>
                        <p className="text-sm text-gray-600 mt-2">
                          Fecha estimada: <strong>{results.estimatedDate}</strong>
                        </p>
                      </div>

                      <Separator />

                      {/* Desglose detallado */}
                      <div className="bg-white p-4 rounded-lg space-y-2">
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">💵 Cantidad necesaria:</span>
                          <span className="font-semibold text-gray-900">{formatCurrency(targetAmount)} €</span>
                        </div>
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-600">💳 Ahorro actual:</span>
                          <span className="font-semibold text-green-600">- {formatCurrency(currentSavings)} €</span>
                        </div>
                        <Separator />
                        <div className="flex justify-between items-center text-sm">
                          <span className="text-gray-700 font-medium">📊 Aún te faltan:</span>
                          <span className="font-bold text-orange-600 text-lg">{formatCurrency(targetAmount - currentSavings)} €</span>
                        </div>
                        <div className="flex justify-between items-center text-sm mt-3 bg-yellow-50 p-2 rounded">
                          <span className="text-gray-700">📅 Ahorrando <strong>{formatCurrency(monthlySavings)} €/mes</strong></span>
                          <span className="text-yellow-700 font-semibold">→ {results.monthsToSave} meses</span>
                        </div>
                      </div>

                      {/* Consejo motivacional */}
                      <div className="bg-blue-50 p-3 rounded-lg border border-blue-200">
                        <p className="text-xs text-blue-800">
                          <strong>💡 Consejo:</strong> Si aumentas tu ahorro mensual a <strong>{formatCurrency(monthlySavings + 100)} €</strong>, 
                          podrías alcanzar tu objetivo en <strong>{Math.ceil((targetAmount - currentSavings) / (monthlySavings + 100))} meses</strong> 
                          ({results.monthsToSave - Math.ceil((targetAmount - currentSavings) / (monthlySavings + 100))} meses menos).
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Mensaje si faltan datos */}
          {(targetAmount === 0 || monthlySavings === 0) && (
            <div className="bg-gray-50 p-6 rounded-lg border-2 border-dashed border-gray-300 text-center">
              <PiggyBank className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <p className="text-sm text-gray-600">
                Introduce la <strong>cantidad necesaria</strong> y tu <strong>ahorro mensual</strong> para calcular cuánto tiempo necesitas.
              </p>
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
