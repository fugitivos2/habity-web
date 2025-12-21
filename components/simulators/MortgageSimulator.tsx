'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { calculateMortgage } from '@/lib/simulators/mortgage';
import type { MortgageSimulationParams, MortgageSimulationResult } from '@/lib/simulators/mortgage';
import { Calculator, TrendingUp, Calendar, Percent, Home, Wallet } from 'lucide-react';
import SaveLoadButtons from './SaveLoadButtons';
import UsageBadge from '@/components/simulations/UsageBadge';

export default function MortgageSimulator() {
  const [params, setParams] = useState<MortgageSimulationParams>({
    propertyPrice: 250000,
    downPayment: 50000,
    interestRate: 3.5,
    termYears: 25,
  });

  const [result, setResult] = useState<MortgageSimulationResult | null>(null);

  // Calcular automáticamente cuando cambien los parámetros
  useEffect(() => {
    const calculationResult = calculateMortgage(params);
    setResult(calculationResult);
  }, [params]);

  const handleInputChange = (field: keyof MortgageSimulationParams, value: number) => {
    setParams(prev => ({ ...prev, [field]: value }));
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('es-ES', {
      style: 'currency',
      currency: 'EUR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatPercent = (value: number) => {
    return `${value.toFixed(2)}%`;
  };

  // Callback para cargar simulación guardada
  const handleLoadSimulation = useCallback((data: any) => {
    setParams(data.inputData);
  }, []);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-blue-100 rounded-lg">
          <Calculator className="w-6 h-6 text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Simulador de Hipoteca</h2>
          <p className="text-sm text-gray-600">Calcula tu cuota mensual y costes totales</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Panel de Parámetros */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Home className="w-5 h-5 text-blue-600" />
              Datos de la Hipoteca
            </CardTitle>
            <CardDescription>Ajusta los valores según tu situación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Precio de la Vivienda */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="propertyPrice" className="text-sm font-semibold">
                  Precio de la Vivienda
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="propertyPrice"
                    type="number"
                    value={params.propertyPrice}
                    onChange={(e) => handleInputChange('propertyPrice', Number(e.target.value))}
                    className="w-32 text-right font-mono"
                    min={10000}
                    max={2000000}
                    step={5000}
                  />
                  <span className="text-sm text-gray-600">€</span>
                </div>
              </div>
              <Slider
                value={[params.propertyPrice]}
                onValueChange={(value) => handleInputChange('propertyPrice', value[0])}
                min={10000}
                max={2000000}
                step={5000}
                className="w-full"
              />
              <p className="text-xs text-gray-500 text-right">{formatCurrency(params.propertyPrice)}</p>
            </div>

            {/* Entrada / Aportación */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="downPayment" className="text-sm font-semibold">
                  Entrada / Aportación
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="downPayment"
                    type="number"
                    value={params.downPayment}
                    onChange={(e) => handleInputChange('downPayment', Number(e.target.value))}
                    className="w-32 text-right font-mono"
                    min={0}
                    max={params.propertyPrice}
                    step={1000}
                  />
                  <span className="text-sm text-gray-600">€</span>
                </div>
              </div>
              <Slider
                value={[params.downPayment]}
                onValueChange={(value) => handleInputChange('downPayment', value[0])}
                min={0}
                max={params.propertyPrice}
                step={1000}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{formatCurrency(params.downPayment)}</span>
                <span>
                  {((params.downPayment / params.propertyPrice) * 100).toFixed(1)}% del precio
                </span>
              </div>
            </div>

            {/* Tipo de Interés */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="interestRate" className="text-sm font-semibold">
                  Tipo de Interés Anual
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="interestRate"
                    type="number"
                    value={params.interestRate}
                    onChange={(e) => handleInputChange('interestRate', Number(e.target.value))}
                    className="w-24 text-right font-mono"
                    min={0.1}
                    max={10}
                    step={0.1}
                  />
                  <span className="text-sm text-gray-600">%</span>
                </div>
              </div>
              <Slider
                value={[params.interestRate]}
                onValueChange={(value) => handleInputChange('interestRate', value[0])}
                min={0.1}
                max={10}
                step={0.1}
                className="w-full"
              />
              <p className="text-xs text-gray-500 text-right">{formatPercent(params.interestRate)}</p>
            </div>

            {/* Plazo */}
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <Label htmlFor="termYears" className="text-sm font-semibold">
                  Plazo de Amortización
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="termYears"
                    type="number"
                    value={params.termYears}
                    onChange={(e) => handleInputChange('termYears', Number(e.target.value))}
                    className="w-24 text-right font-mono"
                    min={5}
                    max={40}
                    step={1}
                  />
                  <span className="text-sm text-gray-600">años</span>
                </div>
              </div>
              <Slider
                value={[params.termYears]}
                onValueChange={(value) => handleInputChange('termYears', value[0])}
                min={5}
                max={40}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-gray-500">
                <span>{params.termYears} años</span>
                <span>{params.termYears * 12} cuotas mensuales</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panel de Resultados */}
        <div className="space-y-4">
          {/* Cuota Mensual - Destacada */}
          <Card className="border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Wallet className="w-6 h-6" />
                Cuota Mensual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-blue-600 mb-2">
                {result ? formatCurrency(result.monthlyPayment) : '---'}
              </div>
              <p className="text-sm text-gray-600">
                Durante {params.termYears} años ({params.termYears * 12} cuotas)
              </p>
            </CardContent>
          </Card>

          {/* Resumen Financiero */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-600" />
                  Resumen Financiero
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Cantidad Financiada */}
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calculator className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium text-gray-700">Cantidad a Financiar</span>
                  </div>
                  <span className="text-lg font-bold text-gray-900">
                    {formatCurrency(result.loanAmount)}
                  </span>
                </div>

                {/* Total de Intereses */}
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Percent className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">Total Intereses</span>
                  </div>
                  <span className="text-lg font-bold text-orange-600">
                    {formatCurrency(result.totalInterest)}
                  </span>
                </div>

                {/* Total a Pagar */}
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-blue-500" />
                    <span className="text-sm font-medium text-gray-700">Total a Pagar</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">
                    {formatCurrency(result.totalPayment)}
                  </span>
                </div>

                {/* Porcentaje Financiado */}
                <div className="pt-3 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Porcentaje financiado:</span>
                    <span className="font-semibold text-gray-900">
                      {formatPercent(result.ltv)}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${result.ltv}%` }}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Badge de Uso */}
          {result && (
            <div className="mb-4">
              <UsageBadge showUpgradeButton={false} size="sm" />
            </div>
          )}

          {/* Botones Guardar/Cargar */}
          {result && (
            <SaveLoadButtons
              simulationType="HIPOTECA"
              simulationData={{
                inputData: params,
                results: result,
              }}
              onLoadSimulation={handleLoadSimulation}
            />
          )}

          {/* Advertencia LTV */}
          {result && result.ltv > 80 && (
            <Card className="border-yellow-500 bg-yellow-50">
              <CardContent className="pt-6">
                <div className="flex gap-2">
                  <span className="text-yellow-600">⚠️</span>
                  <div className="text-sm text-yellow-800">
                    <p className="font-semibold mb-1">Financiación superior al 80%</p>
                    <p>
                      La mayoría de bancos financian hasta el 80% del valor de tasación.
                      Es posible que necesites aumentar tu entrada inicial.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
