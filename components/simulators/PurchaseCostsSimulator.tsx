'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AUTONOMOUS_REGIONS, type Region } from '@/lib/simulators/purchase-costs';
import { FileText, Scale, Building2, Calculator, AlertCircle } from 'lucide-react';

export default function PurchaseCostsSimulator() {
  // Estados principales
  const [propertyPrice, setPropertyPrice] = useState(250000);
  const [region, setRegion] = useState<Region>('Madrid');
  const [isNewProperty, setIsNewProperty] = useState(false);
  
  // Gastos adicionales EDITABLES (como en la landing)
  const [notaryFee, setNotaryFee] = useState(1250);
  const [registryFee, setRegistryFee] = useState(1000);
  const [appraisalFee, setAppraisalFee] = useState(300);
  const [gestorFee, setGestorFee] = useState(600);
  const [agencyCommission, setAgencyCommission] = useState(0);

  // Cálculo automático de ITP/IVA/IPSI (SOLO este impuesto es automático)
  const calculateTax = () => {
    const regionData = AUTONOMOUS_REGIONS[region];
    let tax = 0;
    let taxName = '';
    let taxRate = 0;
    
    if (isNewProperty) {
      // Vivienda nueva en Ceuta/Melilla: IPSI 0.5% (bonificado)
      if (region === 'Ceuta' || region === 'Melilla') {
        tax = propertyPrice * 0.005; // IPSI 0.5% bonificado
        taxName = 'IPSI (0.5% bonificado)';
        taxRate = 0.5;
      } else {
        // Vivienda nueva en resto de España: IVA 10% (NO se calcula automáticamente)
        tax = 0; // Usuario debe introducirlo manualmente
        taxName = 'IVA (10%)';
        taxRate = 10;
      }
    } else {
      // Vivienda de segunda mano: ITP según comunidad
      // Ceuta y Melilla tienen ITP bonificado al 3%
      if (region === 'Ceuta' || region === 'Melilla') {
        tax = propertyPrice * 0.03; // ITP 3% bonificado
        taxName = 'ITP (3% bonificado)';
        taxRate = 3;
      } else {
        tax = propertyPrice * (regionData.itpRate / 100);
        taxName = `ITP (${regionData.itpRate}%)`;
        taxRate = regionData.itpRate;
      }
    }
    
    return { tax, taxName, taxRate };
  };

  const { tax, taxName, taxRate } = calculateTax();

  // Total de gastos
  const totalCosts = notaryFee + registryFee + appraisalFee + tax + gestorFee + agencyCommission;

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
      <Card className="bg-gradient-to-br from-green-50 to-white border-green-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Calculator className="w-6 h-6 text-green-600" />
            Calculadora de Gastos de Compraventa
          </CardTitle>
          <CardDescription className="text-base">
            Calcula todos los gastos asociados a la compra de tu vivienda
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Panel de Parámetros */}
        <Card className="border-2 border-green-200">
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
                Precio de la vivienda
              </Label>
              <div className="flex items-center gap-2">
                <Input
                  id="propertyPrice"
                  type="number"
                  value={propertyPrice}
                  onChange={(e) => setPropertyPrice(Number(e.target.value))}
                  className="text-right font-mono text-lg"
                  min={10000}
                  max={5000000}
                  step={5000}
                  placeholder="Ej: 250000"
                />
                <span className="text-sm text-gray-600 font-medium">€</span>
              </div>
              <p className="text-xs text-gray-500">{formatCurrency(propertyPrice)}</p>
            </div>

            {/* Comunidad Autónoma */}
            <div className="space-y-2">
              <Label htmlFor="region" className="text-sm font-semibold">
                Comunidad Autónoma
              </Label>
              <Select
                value={region}
                onValueChange={(value) => setRegion(value as Region)}
              >
                <SelectTrigger id="region" className="w-full bg-white">
                  <SelectValue placeholder="Selecciona una comunidad" />
                </SelectTrigger>
                <SelectContent className="max-h-80 bg-white">
                  {Object.keys(AUTONOMOUS_REGIONS).map((r) => (
                    <SelectItem key={r} value={r}>
                      {r} - ITP {AUTONOMOUS_REGIONS[r as Region].itpRate}%
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-gray-500">
                {isNewProperty 
                  ? (region === 'Ceuta' || region === 'Melilla'
                      ? 'IPSI 0.5% bonificado (obra nueva)'
                      : 'Obra nueva: IVA 10%')
                  : `ITP aplicable: ${region === 'Ceuta' || region === 'Melilla' ? '3% bonificado' : AUTONOMOUS_REGIONS[region].itpRate + '%'}`}
              </p>
            </div>

            {/* Tipo de Vivienda - Checkbox */}
            <div className="space-y-2">
              <div className="flex items-center gap-3 p-4 bg-green-100 rounded-lg border-2 border-green-300">
                <input
                  type="checkbox"
                  id="isNewProperty"
                  checked={isNewProperty}
                  onChange={(e) => setIsNewProperty(e.target.checked)}
                  className="w-5 h-5 text-green-600 border-2 border-green-400 rounded focus:ring-2 focus:ring-green-500 cursor-pointer"
                />
                <label htmlFor="isNewProperty" className="text-sm font-medium text-gray-700 cursor-pointer">
                  Vivienda nueva {isNewProperty && (
                    <span className="text-green-600 font-semibold">
                      ({region === 'Ceuta' || region === 'Melilla' ? 'IPSI 0.5% bonificado' : 'IVA 10%'})
                    </span>
                  )}
                </label>
              </div>
              <p className="text-xs text-gray-500">
                {isNewProperty 
                  ? (region === 'Ceuta' || region === 'Melilla' 
                      ? 'IPSI 0.5% se calcula automáticamente' 
                      : 'Marca si la vivienda es de obra nueva (IVA 10%)')
                  : `ITP ${taxRate}% se calcula automáticamente según la comunidad`}
              </p>
            </div>

            {/* Gastos adicionales EDITABLES */}
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg border-2 border-gray-200">
              <p className="text-xs font-semibold text-gray-600 uppercase mb-3">
                Gastos adicionales (editables)
              </p>
              
              <div className="grid grid-cols-2 gap-3">
                {/* Notaría */}
                <div className="space-y-1">
                  <Label htmlFor="notaryFee" className="text-xs font-medium text-gray-600">
                    Notaría
                  </Label>
                  <div className="flex items-center gap-1">
                    <Input
                      id="notaryFee"
                      type="number"
                      min="0"
                      max="5000"
                      step="50"
                      value={notaryFee}
                      onChange={(e) => setNotaryFee(Number(e.target.value))}
                      className="text-sm font-medium"
                    />
                    <span className="text-xs text-gray-500">€</span>
                  </div>
                </div>

                {/* Registro */}
                <div className="space-y-1">
                  <Label htmlFor="registryFee" className="text-xs font-medium text-gray-600">
                    Registro
                  </Label>
                  <div className="flex items-center gap-1">
                    <Input
                      id="registryFee"
                      type="number"
                      min="0"
                      max="5000"
                      step="50"
                      value={registryFee}
                      onChange={(e) => setRegistryFee(Number(e.target.value))}
                      className="text-sm font-medium"
                    />
                    <span className="text-xs text-gray-500">€</span>
                  </div>
                </div>

                {/* Tasación */}
                <div className="space-y-1">
                  <Label htmlFor="appraisalFee" className="text-xs font-medium text-gray-600">
                    Tasación
                  </Label>
                  <div className="flex items-center gap-1">
                    <Input
                      id="appraisalFee"
                      type="number"
                      min="0"
                      max="2000"
                      step="50"
                      value={appraisalFee}
                      onChange={(e) => setAppraisalFee(Number(e.target.value))}
                      className="text-sm font-medium"
                    />
                    <span className="text-xs text-gray-500">€</span>
                  </div>
                </div>

                {/* Gestoría */}
                <div className="space-y-1">
                  <Label htmlFor="gestorFee" className="text-xs font-medium text-gray-600">
                    Gestoría
                  </Label>
                  <div className="flex items-center gap-1">
                    <Input
                      id="gestorFee"
                      type="number"
                      min="0"
                      max="2000"
                      step="50"
                      value={gestorFee}
                      onChange={(e) => setGestorFee(Number(e.target.value))}
                      className="text-sm font-medium"
                    />
                    <span className="text-xs text-gray-500">€</span>
                  </div>
                </div>
              </div>

              {/* Comisión Inmobiliaria */}
              <div className="space-y-1">
                <Label htmlFor="agencyCommission" className="text-xs font-medium text-gray-600">
                  Comisión Inmobiliaria (opcional)
                </Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="agencyCommission"
                    type="number"
                    min="0"
                    max="50000"
                    step="100"
                    value={agencyCommission}
                    onChange={(e) => setAgencyCommission(Number(e.target.value))}
                    className="text-sm font-medium"
                  />
                  <span className="text-xs text-gray-500">€</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Panel de Resultados */}
        <div className="space-y-4">
          {/* Total de Gastos - Destacado */}
          <Card className="border-2 border-green-500 bg-gradient-to-br from-green-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-700">
                <Scale className="w-6 h-6" />
                Total Gastos de Compra
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-green-600 mb-2">
                {formatCurrency(totalCosts)}
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Sobre precio de venta</span>
                <span className="font-semibold">
                  {((totalCosts / propertyPrice) * 100).toFixed(1)}%
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Desglose de Gastos */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Desglose Detallado
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Notaría */}
              <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Notaría</span>
                <span className="text-lg font-bold text-orange-600">
                  {formatCurrency(notaryFee)}
                </span>
              </div>

              {/* Registro */}
              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Registro Propiedad</span>
                <span className="text-lg font-bold text-indigo-600">
                  {formatCurrency(registryFee)}
                </span>
              </div>

              {/* Tasación */}
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Tasación</span>
                <span className="text-lg font-bold text-blue-600">
                  {formatCurrency(appraisalFee)}
                </span>
              </div>

              {/* ITP o IVA/IPSI (AUTO-CALCULADO) */}
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg border-2 border-purple-200">
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">{taxName}</span>
                  <span className="text-xs text-purple-600 font-semibold">Auto-calculado ({taxRate}%)</span>
                </div>
                <span className="text-lg font-bold text-purple-600">
                  {formatCurrency(tax)}
                </span>
              </div>

              {/* Gestoría */}
              <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Gestoría</span>
                <span className="text-lg font-bold text-teal-600">
                  {formatCurrency(gestorFee)}
                </span>
              </div>

              {/* Comisión Inmobiliaria (solo si > 0) */}
              {agencyCommission > 0 && (
                <div className="flex justify-between items-center p-3 bg-pink-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Comisión Inmobiliaria</span>
                  <span className="text-lg font-bold text-pink-600">
                    {formatCurrency(agencyCommission)}
                  </span>
                </div>
              )}

              {/* Total */}
              <div className="pt-3 border-t-2 border-gray-200">
                <div className="flex justify-between items-center p-4 bg-green-100 rounded-lg">
                  <span className="text-base font-bold text-gray-900">TOTAL GASTOS</span>
                  <span className="text-2xl font-bold text-green-600">
                    {formatCurrency(totalCosts)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-2">⚠️ Recuerda:</p>
                  <ul className="space-y-1 list-disc list-inside leading-relaxed">
                    <li>Estos gastos son orientativos y pueden variar</li>
                    <li>Los gastos de notaría y registro dependen del valor de la operación</li>
                    <li>En algunas comunidades pueden existir bonificaciones fiscales</li>
                    <li><strong>Solo el ITP/IPSI se calcula automáticamente</strong> según la comunidad seleccionada</li>
                    <li><strong>Ceuta y Melilla</strong>: ITP 3% bonificado (segunda mano) o IPSI 0.5% bonificado (obra nueva)</li>
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
