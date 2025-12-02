'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { calculatePurchaseCosts, AUTONOMOUS_REGIONS, type Region } from '@/lib/simulators/purchase-costs';
import type { PurchaseCostsParams, PurchaseCostsResult } from '@/lib/simulators/purchase-costs';
import { FileText, Scale, Building2, Wallet, PiggyBank, Calculator } from 'lucide-react';

export default function PurchaseCostsSimulator() {
  const [params, setParams] = useState<PurchaseCostsParams>({
    propertyPrice: 250000,
    region: 'Madrid',
    isNewProperty: false,
    hasMortgage: true,
  });

  const [result, setResult] = useState<PurchaseCostsResult | null>(null);

  // Calcular automáticamente cuando cambien los parámetros
  useEffect(() => {
    const calculationResult = calculatePurchaseCosts(params);
    setResult(calculationResult);
  }, [params]);

  const handleInputChange = (field: keyof PurchaseCostsParams, value: any) => {
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="p-3 bg-green-100 rounded-lg">
          <FileText className="w-6 h-6 text-green-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Calculadora de Gastos de Compraventa</h2>
          <p className="text-sm text-gray-600">Calcula todos los gastos asociados a tu compra</p>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Panel de Parámetros */}
        <Card className="border-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5 text-green-600" />
              Datos de la Compra
            </CardTitle>
            <CardDescription>Introduce los detalles de la operación</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Precio de la Vivienda */}
            <div className="space-y-2">
              <Label htmlFor="propertyPrice" className="text-sm font-semibold">
                Precio de Venta
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="propertyPrice"
                  type="number"
                  value={params.propertyPrice}
                  onChange={(e) => handleInputChange('propertyPrice', Number(e.target.value))}
                  className="text-right font-mono text-lg"
                  min={10000}
                  max={5000000}
                  step={5000}
                />
                <span className="text-sm text-gray-600">€</span>
              </div>
              <p className="text-xs text-gray-500">{formatCurrency(params.propertyPrice)}</p>
            </div>

            {/* Comunidad Autónoma */}
            <div className="space-y-2">
              <Label htmlFor="region" className="text-sm font-semibold">
                Comunidad Autónoma
              </Label>
              <Select
                value={params.region}
                onValueChange={(value) => handleInputChange('region', value as Region)}
              >
                <SelectTrigger id="region" className="w-full">
                  <SelectValue placeholder="Selecciona una comunidad" />
                </SelectTrigger>
                <SelectContent className="max-h-80">
                  {Object.keys(AUTONOMOUS_REGIONS).map((region) => (
                    <SelectItem key={region} value={region}>
                      {region} ({formatPercent(AUTONOMOUS_REGIONS[region as Region].itpRate)})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                ITP aplicable: {formatPercent(AUTONOMOUS_REGIONS[params.region].itpRate)}
                {params.region === 'Ceuta' && ' (Bonificado del 6% al 3%)'}
                {params.region === 'Melilla' && ' (Bonificado del 6% al 3%)'}
              </p>
            </div>

            {/* Tipo de Vivienda */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Tipo de Vivienda</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('isNewProperty', true)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    params.isNewProperty
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-sm font-semibold">Obra Nueva</div>
                    <div className="text-xs text-gray-500 mt-1">IVA 10%</div>
                  </div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('isNewProperty', false)}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    !params.isNewProperty
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-sm font-semibold">Segunda Mano</div>
                    <div className="text-xs text-gray-500 mt-1">ITP</div>
                  </div>
                </button>
              </div>
            </div>

            {/* ¿Necesitas Hipoteca? */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">¿Necesitas Hipoteca?</Label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => handleInputChange('hasMortgage', true)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    params.hasMortgage
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-semibold text-center">Sí</div>
                </button>
                <button
                  type="button"
                  onClick={() => handleInputChange('hasMortgage', false)}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    !params.hasMortgage
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <div className="text-sm font-semibold text-center">No</div>
                </button>
              </div>
              <p className="text-xs text-gray-500">
                {params.hasMortgage
                  ? 'Se incluirán gastos de gestoría y registro hipotecario'
                  : 'Solo gastos de compraventa'}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Panel de Resultados */}
        <div className="space-y-4">
          {/* Total de Gastos - Destacado */}
          <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <PiggyBank className="w-6 h-6" />
                Total Gastos de Compra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-green-600 mb-2">
                {result ? formatCurrency(result.totalCosts) : '---'}
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Sobre precio de venta</span>
                <span className="font-semibold">
                  {result ? formatPercent((result.totalCosts / params.propertyPrice) * 100) : '---'}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Desglose de Gastos */}
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="w-5 h-5 text-blue-600" />
                  Desglose Detallado
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* ITP o IVA + AJD */}
                <div className="space-y-2">
                  {params.isNewProperty ? (
                    <>
                      <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <Scale className="w-4 h-4 text-blue-500" />
                          <span className="text-sm font-medium text-gray-700">IVA (10%)</span>
                        </div>
                        <span className="text-base font-bold text-blue-600">
                          {formatCurrency(result.ivaAJD)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium text-gray-700">
                            AJD ({formatPercent(AUTONOMOUS_REGIONS[params.region].ajdRate)})
                          </span>
                        </div>
                        <span className="text-base font-bold text-gray-900">
                          {formatCurrency(result.itpTransfer)}
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Scale className="w-4 h-4 text-purple-500" />
                        <span className="text-sm font-medium text-gray-700">
                          ITP ({formatPercent(AUTONOMOUS_REGIONS[params.region].itpRate)})
                        </span>
                      </div>
                      <span className="text-base font-bold text-purple-600">
                        {formatCurrency(result.itpTransfer)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Notaría */}
                <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-500" />
                    <span className="text-sm font-medium text-gray-700">Notaría</span>
                  </div>
                  <span className="text-base font-bold text-orange-600">
                    {formatCurrency(result.notaryCosts)}
                  </span>
                </div>

                {/* Registro */}
                <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-indigo-500" />
                    <span className="text-sm font-medium text-gray-700">Registro Propiedad</span>
                  </div>
                  <span className="text-base font-bold text-indigo-600">
                    {formatCurrency(result.registryCosts)}
                  </span>
                </div>

                {/* Gestoría (solo si hay hipoteca) */}
                {params.hasMortgage && result.agencyCosts > 0 && (
                  <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Wallet className="w-4 h-4 text-teal-500" />
                      <span className="text-sm font-medium text-gray-700">Gestoría</span>
                    </div>
                    <span className="text-base font-bold text-teal-600">
                      {formatCurrency(result.agencyCosts)}
                    </span>
                  </div>
                )}

                {/* Total */}
                <div className="pt-3 border-t-2 border-gray-200">
                  <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg">
                    <span className="text-base font-bold text-gray-900">TOTAL GASTOS</span>
                    <span className="text-2xl font-bold text-green-600">
                      {formatCurrency(result.totalCosts)}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Información Adicional */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <div className="flex gap-2">
                <span className="text-blue-600">ℹ️</span>
                <div className="text-sm text-blue-800">
                  <p className="font-semibold mb-2">Recuerda:</p>
                  <ul className="space-y-1 list-disc list-inside">
                    <li>Estos gastos son orientativos y pueden variar</li>
                    <li>Los gastos de notaría y registro dependen del valor de la operación</li>
                    {params.hasMortgage && (
                      <li>Si solicitas hipoteca, deberás sumar los gastos bancarios adicionales</li>
                    )}
                    <li>En algunas comunidades pueden existir bonificaciones fiscales</li>
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
