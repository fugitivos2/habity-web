'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { 
  Hammer, 
  Paintbrush, 
  Lightbulb, 
  Droplet, 
  Grid3x3, 
  Armchair, 
  DoorOpen,
  Calculator,
  AlertCircle
} from 'lucide-react';

export default function RenovationCalculator() {
  // Estado para cada partida de reforma
  const [totalArea, setTotalArea] = useState(80); // m² totales para referencia

  // Suelo
  const [floorArea, setFloorArea] = useState(80); // m² de suelo
  const [floorPricePerM2, setFloorPricePerM2] = useState(40); // €/m²

  // Pintura
  const [paintArea, setPaintArea] = useState(200); // m² de pintura (paredes + techo)
  const [paintPricePerM2, setPaintPricePerM2] = useState(12); // €/m²

  // Ventanas
  const [windowsQuantity, setWindowsQuantity] = useState(4); // Número de ventanas
  const [windowPricePerUnit, setWindowPricePerUnit] = useState(800); // €/ventana

  // Electricidad
  const [electricityArea, setElectricityArea] = useState(80); // m² (suele ser total)
  const [electricityPricePerM2, setElectricityPricePerM2] = useState(35); // €/m²

  // Fontanería
  const [plumbingArea, setPlumbingArea] = useState(80); // m² (suele ser total)
  const [plumbingPricePerM2, setPlumbingPricePerM2] = useState(30); // €/m²

  // Mobiliario cocina
  const [kitchenBudget, setKitchenBudget] = useState(5000); // € presupuesto cocina

  // Mobiliario baño
  const [bathroomBudget, setBathroomBudget] = useState(3000); // € presupuesto baño

  // Puertas interiores
  const [doorsQuantity, setDoorsQuantity] = useState(5); // Número de puertas
  const [doorPricePerUnit, setDoorPricePerUnit] = useState(400); // €/puerta

  // Otros gastos
  const [otherCosts, setOtherCosts] = useState(2000); // € otros gastos

  // Cálculos
  const floorCost = floorArea * floorPricePerM2;
  const paintCost = paintArea * paintPricePerM2;
  const windowsCost = windowsQuantity * windowPricePerUnit;
  const electricityCost = electricityArea * electricityPricePerM2;
  const plumbingCost = plumbingArea * plumbingPricePerM2;
  const doorsCost = doorsQuantity * doorPricePerUnit;

  const totalCost = 
    floorCost + 
    paintCost + 
    windowsCost + 
    electricityCost + 
    plumbingCost + 
    kitchenBudget + 
    bathroomBudget + 
    doorsCost + 
    otherCosts;

  const costPerM2 = totalArea > 0 ? totalCost / totalArea : 0;

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
      <Card className="bg-gradient-to-br from-orange-50 to-white border-orange-200">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-2xl">
            <Hammer className="w-6 h-6 text-orange-600" />
            Calculadora de Reforma de Vivienda
          </CardTitle>
          <CardDescription className="text-base">
            Estima el coste total de reformar tu vivienda por partidas
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Panel de Parámetros */}
        <div className="space-y-4">
          {/* Superficie total (referencia) */}
          <Card className="border-2 border-gray-200 bg-gray-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-700 text-lg">
                <Grid3x3 className="w-5 h-5" />
                📐 Superficie Total (Referencia)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Label htmlFor="totalArea" className="font-semibold">
                  Metros cuadrados totales
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="totalArea"
                    type="number"
                    value={totalArea}
                    onChange={(e) => setTotalArea(Number(e.target.value))}
                    className="flex-1"
                    min={20}
                    max={500}
                    step={5}
                  />
                  <span className="flex items-center px-3 bg-white rounded-md text-sm font-medium border">m²</span>
                </div>
                <p className="text-xs text-gray-500">Solo para calcular el precio por m² final</p>
              </div>
            </CardContent>
          </Card>

          {/* SUELO */}
          <Card className="border-2 border-amber-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-700">
                <Grid3x3 className="w-5 h-5" />
                🟫 Suelo
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="floorArea" className="text-xs font-medium">
                    Superficie (m²)
                  </Label>
                  <Input
                    id="floorArea"
                    type="number"
                    value={floorArea}
                    onChange={(e) => setFloorArea(Number(e.target.value))}
                    className="text-sm"
                    min={0}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="floorPricePerM2" className="text-xs font-medium">
                    Precio €/m²
                  </Label>
                  <Input
                    id="floorPricePerM2"
                    type="number"
                    value={floorPricePerM2}
                    onChange={(e) => setFloorPricePerM2(Number(e.target.value))}
                    className="text-sm"
                    min={0}
                  />
                </div>
              </div>
              <div className="text-right text-sm font-bold text-amber-700">
                Total: {formatCurrency(floorCost)}
              </div>
            </CardContent>
          </Card>

          {/* PINTURA */}
          <Card className="border-2 border-blue-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-700">
                <Paintbrush className="w-5 h-5" />
                🎨 Pintura
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="paintArea" className="text-xs font-medium">
                    Superficie (m²)
                  </Label>
                  <Input
                    id="paintArea"
                    type="number"
                    value={paintArea}
                    onChange={(e) => setPaintArea(Number(e.target.value))}
                    className="text-sm"
                    min={0}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="paintPricePerM2" className="text-xs font-medium">
                    Precio €/m²
                  </Label>
                  <Input
                    id="paintPricePerM2"
                    type="number"
                    value={paintPricePerM2}
                    onChange={(e) => setPaintPricePerM2(Number(e.target.value))}
                    className="text-sm"
                    min={0}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">Incluye paredes y techos</p>
              <div className="text-right text-sm font-bold text-blue-700">
                Total: {formatCurrency(paintCost)}
              </div>
            </CardContent>
          </Card>

          {/* VENTANAS */}
          <Card className="border-2 border-cyan-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-cyan-700">
                <DoorOpen className="w-5 h-5" />
                🪟 Ventanas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="windowsQuantity" className="text-xs font-medium">
                    Cantidad
                  </Label>
                  <Input
                    id="windowsQuantity"
                    type="number"
                    value={windowsQuantity}
                    onChange={(e) => setWindowsQuantity(Number(e.target.value))}
                    className="text-sm"
                    min={0}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="windowPricePerUnit" className="text-xs font-medium">
                    Precio €/unidad
                  </Label>
                  <Input
                    id="windowPricePerUnit"
                    type="number"
                    value={windowPricePerUnit}
                    onChange={(e) => setWindowPricePerUnit(Number(e.target.value))}
                    className="text-sm"
                    min={0}
                  />
                </div>
              </div>
              <div className="text-right text-sm font-bold text-cyan-700">
                Total: {formatCurrency(windowsCost)}
              </div>
            </CardContent>
          </Card>

          {/* ELECTRICIDAD */}
          <Card className="border-2 border-yellow-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-yellow-700">
                <Lightbulb className="w-5 h-5" />
                ⚡ Electricidad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="electricityArea" className="text-xs font-medium">
                    Superficie (m²)
                  </Label>
                  <Input
                    id="electricityArea"
                    type="number"
                    value={electricityArea}
                    onChange={(e) => setElectricityArea(Number(e.target.value))}
                    className="text-sm"
                    min={0}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="electricityPricePerM2" className="text-xs font-medium">
                    Precio €/m²
                  </Label>
                  <Input
                    id="electricityPricePerM2"
                    type="number"
                    value={electricityPricePerM2}
                    onChange={(e) => setElectricityPricePerM2(Number(e.target.value))}
                    className="text-sm"
                    min={0}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">Instalación completa + puntos de luz</p>
              <div className="text-right text-sm font-bold text-yellow-700">
                Total: {formatCurrency(electricityCost)}
              </div>
            </CardContent>
          </Card>

          {/* FONTANERÍA */}
          <Card className="border-2 border-teal-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-teal-700">
                <Droplet className="w-5 h-5" />
                🚰 Fontanería
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="plumbingArea" className="text-xs font-medium">
                    Superficie (m²)
                  </Label>
                  <Input
                    id="plumbingArea"
                    type="number"
                    value={plumbingArea}
                    onChange={(e) => setPlumbingArea(Number(e.target.value))}
                    className="text-sm"
                    min={0}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="plumbingPricePerM2" className="text-xs font-medium">
                    Precio €/m²
                  </Label>
                  <Input
                    id="plumbingPricePerM2"
                    type="number"
                    value={plumbingPricePerM2}
                    onChange={(e) => setPlumbingPricePerM2(Number(e.target.value))}
                    className="text-sm"
                    min={0}
                  />
                </div>
              </div>
              <p className="text-xs text-gray-500">Tuberías, desagües, llaves</p>
              <div className="text-right text-sm font-bold text-teal-700">
                Total: {formatCurrency(plumbingCost)}
              </div>
            </CardContent>
          </Card>

          {/* MOBILIARIO COCINA */}
          <Card className="border-2 border-red-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-red-700">
                <Armchair className="w-5 h-5" />
                🍳 Mobiliario Cocina
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="kitchenBudget" className="text-xs font-medium">
                  Presupuesto total cocina
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="kitchenBudget"
                    type="number"
                    value={kitchenBudget}
                    onChange={(e) => setKitchenBudget(Number(e.target.value))}
                    className="flex-1"
                    min={0}
                    step={500}
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">€</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Muebles, encimera, electrodomésticos</p>
            </CardContent>
          </Card>

          {/* MOBILIARIO BAÑO */}
          <Card className="border-2 border-indigo-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-indigo-700">
                <Armchair className="w-5 h-5" />
                🚿 Mobiliario Baño
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="bathroomBudget" className="text-xs font-medium">
                  Presupuesto total baño
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="bathroomBudget"
                    type="number"
                    value={bathroomBudget}
                    onChange={(e) => setBathroomBudget(Number(e.target.value))}
                    className="flex-1"
                    min={0}
                    step={500}
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">€</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Sanitarios, mampara, muebles</p>
            </CardContent>
          </Card>

          {/* PUERTAS */}
          <Card className="border-2 border-purple-200">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-purple-700">
                <DoorOpen className="w-5 h-5" />
                🚪 Puertas Interiores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <Label htmlFor="doorsQuantity" className="text-xs font-medium">
                    Cantidad
                  </Label>
                  <Input
                    id="doorsQuantity"
                    type="number"
                    value={doorsQuantity}
                    onChange={(e) => setDoorsQuantity(Number(e.target.value))}
                    className="text-sm"
                    min={0}
                  />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="doorPricePerUnit" className="text-xs font-medium">
                    Precio €/unidad
                  </Label>
                  <Input
                    id="doorPricePerUnit"
                    type="number"
                    value={doorPricePerUnit}
                    onChange={(e) => setDoorPricePerUnit(Number(e.target.value))}
                    className="text-sm"
                    min={0}
                  />
                </div>
              </div>
              <div className="text-right text-sm font-bold text-purple-700">
                Total: {formatCurrency(doorsCost)}
              </div>
            </CardContent>
          </Card>

          {/* OTROS GASTOS */}
          <Card className="border-2 border-gray-300">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-gray-700">
                <Calculator className="w-5 h-5" />
                📦 Otros Gastos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-1">
                <Label htmlFor="otherCosts" className="text-xs font-medium">
                  Gastos adicionales
                </Label>
                <div className="flex gap-2">
                  <Input
                    id="otherCosts"
                    type="number"
                    value={otherCosts}
                    onChange={(e) => setOtherCosts(Number(e.target.value))}
                    className="flex-1"
                    min={0}
                    step={500}
                  />
                  <span className="flex items-center px-3 bg-gray-100 rounded-md text-sm font-medium">€</span>
                </div>
              </div>
              <p className="text-xs text-gray-500">Permisos, proyecto, imprevistos, etc.</p>
            </CardContent>
          </Card>
        </div>

        {/* Panel de Resultados */}
        <div className="space-y-4">
          {/* Total Reforma */}
          <Card className="border-2 border-orange-500 bg-gradient-to-br from-orange-50 to-white">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-700">
                <Hammer className="w-6 h-6" />
                🏗️ Coste Total Reforma
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-5xl font-bold text-orange-600 mb-2">
                {formatCurrency(totalCost)}
              </div>
              <div className="flex justify-between items-center text-sm text-gray-600">
                <span>Precio por m²</span>
                <span className="font-semibold text-lg text-orange-600">
                  {formatCurrency(costPerM2)}/m²
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Desglose por Partidas */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5 text-blue-600" />
                📋 Desglose por Partidas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Suelo */}
              <div className="flex justify-between items-center p-3 bg-amber-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">🟫 Suelo ({floorArea} m²)</span>
                <span className="text-base font-bold text-amber-600">
                  {formatCurrency(floorCost)}
                </span>
              </div>

              {/* Pintura */}
              <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">🎨 Pintura ({paintArea} m²)</span>
                <span className="text-base font-bold text-blue-600">
                  {formatCurrency(paintCost)}
                </span>
              </div>

              {/* Ventanas */}
              <div className="flex justify-between items-center p-3 bg-cyan-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">🪟 Ventanas ({windowsQuantity} uds)</span>
                <span className="text-base font-bold text-cyan-600">
                  {formatCurrency(windowsCost)}
                </span>
              </div>

              {/* Electricidad */}
              <div className="flex justify-between items-center p-3 bg-yellow-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">⚡ Electricidad ({electricityArea} m²)</span>
                <span className="text-base font-bold text-yellow-600">
                  {formatCurrency(electricityCost)}
                </span>
              </div>

              {/* Fontanería */}
              <div className="flex justify-between items-center p-3 bg-teal-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">🚰 Fontanería ({plumbingArea} m²)</span>
                <span className="text-base font-bold text-teal-600">
                  {formatCurrency(plumbingCost)}
                </span>
              </div>

              {/* Cocina */}
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">🍳 Cocina</span>
                <span className="text-base font-bold text-red-600">
                  {formatCurrency(kitchenBudget)}
                </span>
              </div>

              {/* Baño */}
              <div className="flex justify-between items-center p-3 bg-indigo-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">🚿 Baño</span>
                <span className="text-base font-bold text-indigo-600">
                  {formatCurrency(bathroomBudget)}
                </span>
              </div>

              {/* Puertas */}
              <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">🚪 Puertas ({doorsQuantity} uds)</span>
                <span className="text-base font-bold text-purple-600">
                  {formatCurrency(doorsCost)}
                </span>
              </div>

              {/* Otros */}
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">📦 Otros gastos</span>
                <span className="text-base font-bold text-gray-600">
                  {formatCurrency(otherCosts)}
                </span>
              </div>

              <Separator />

              {/* Total */}
              <div className="flex justify-between items-center p-4 bg-orange-100 rounded-lg">
                <span className="text-base font-bold text-gray-900">TOTAL REFORMA</span>
                <span className="text-2xl font-bold text-orange-600">
                  {formatCurrency(totalCost)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Información Adicional */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-amber-800">
                  <p className="font-semibold mb-2">💡 Consejos:</p>
                  <ul className="space-y-1 list-disc list-inside leading-relaxed">
                    <li>Los precios son orientativos y pueden variar según calidades</li>
                    <li>Añade un 10-15% de margen para imprevistos</li>
                    <li>Solicita varios presupuestos y compara</li>
                    <li>Los precios por m² de electricidad y fontanería incluyen mano de obra</li>
                    <li>Los plazos de obra suelen ser 2-4 meses para reformas integrales</li>
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
