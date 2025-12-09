// Componente compartido para guardar/cargar simulaciones
// Se usa en todos los simuladores para mantener consistencia

'use client';

import { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useSimulations } from '@/hooks/useSimulations';
import { useSimulationUsage } from '@/hooks/useSimulationUsage';
import { Button } from '@/components/ui/button';
import UpgradeModal from '@/components/simulations/UpgradeModal';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Save, FolderOpen, LogIn, Check, Loader2 } from 'lucide-react';

// Tipos de simulación válidos
type SimulationType = 
  | 'HIPOTECA'
  | 'GASTOS_COMPRA'
  | 'RENTABILIDAD'
  | 'RATIO_ENDEUDAMIENTO'
  | 'AHORRO_OBJETIVO'
  | 'COMPARADOR'
  | 'FISCAL'
  | 'REFORMA';

interface SaveLoadButtonsProps {
  simulationType: SimulationType;
  simulationData: {
    inputData: Record<string, any>;
    results: Record<string, any>;
  };
  onLoadSimulation?: (data: { inputData: Record<string, any>; results: Record<string, any> }) => void;
  className?: string;
}

export default function SaveLoadButtons({
  simulationType,
  simulationData,
  onLoadSimulation,
  className = '',
}: SaveLoadButtonsProps) {
  const { data: session } = useSession();
  const { saveSimulation, loadSimulations, simulations, loading, error, clearError, isAuthenticated } = useSimulations();
  const { usage, refetch: refetchUsage } = useSimulationUsage();

  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [showLoadDialog, setShowLoadDialog] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [simulationName, setSimulationName] = useState('');
  const [selectedSimulation, setSelectedSimulation] = useState('');
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Abrir diálogo de guardado (verificar límites primero)
  const handleOpenSaveDialog = () => {
    clearError(); // Limpiar errores anteriores
    
    // Verificar si puede guardar más simulaciones
    if (usage && !usage.canSave) {
      setShowUpgradeModal(true);
      return;
    }
    
    setShowSaveDialog(true);
  };

  // Manejar guardado
  const handleSave = async () => {
    if (!simulationName.trim()) return;

    const result = await saveSimulation({
      type: simulationType,
      name: simulationName.trim(),
      inputData: simulationData.inputData,
      results: simulationData.results,
    });

    if (result) {
      setSaveSuccess(true);
      // Actualizar contador de uso
      await refetchUsage();
      setTimeout(() => {
        setShowSaveDialog(false);
        setSaveSuccess(false);
        setSimulationName('');
      }, 1500);
    }
  };

  // Manejar carga de simulaciones
  const handleOpenLoadDialog = async () => {
    clearError(); // Limpiar errores anteriores
    setShowLoadDialog(true);
    await loadSimulations(simulationType);
  };

  // Cargar simulación seleccionada
  const handleLoad = () => {
    const selected = simulations.find((sim) => sim.id === selectedSimulation);
    if (selected && onLoadSimulation) {
      onLoadSimulation({
        inputData: selected.inputData as Record<string, any>,
        results: selected.results as Record<string, any>,
      });
      setShowLoadDialog(false);
      setSelectedSimulation('');
    }
  };

  // Si no está autenticado, mostrar mensaje
  if (!isAuthenticated) {
    return (
      <div className={`flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg ${className}`}>
        <LogIn className="w-4 h-4 text-blue-600" />
        <span className="text-sm text-blue-700">
          <a href="/auth/login" className="font-semibold underline">Inicia sesión</a> para guardar tus simulaciones
        </span>
      </div>
    );
  }

  return (
    <>
      <div className={`flex flex-wrap gap-2 ${className}`}>
        <Button
          onClick={handleOpenSaveDialog}
          variant="default"
          className="flex items-center gap-2"
        >
          <Save className="w-4 h-4" />
          Guardar simulación
        </Button>

        <Button
          onClick={handleOpenLoadDialog}
          variant="outline"
          className="flex items-center gap-2"
        >
          <FolderOpen className="w-4 h-4" />
          Cargar simulación
        </Button>
      </div>

      {/* Dialog: Guardar simulación */}
      <Dialog open={showSaveDialog} onOpenChange={setShowSaveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Guardar Simulación</DialogTitle>
            <DialogDescription>
              Dale un nombre a tu simulación para encontrarla fácilmente después
            </DialogDescription>
          </DialogHeader>

          {!saveSuccess ? (
            <>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="simulation-name">Nombre de la simulación</Label>
                  <Input
                    id="simulation-name"
                    placeholder="Ej: Hipoteca piso Madrid 250k"
                    value={simulationName}
                    onChange={(e) => setSimulationName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  />
                </div>

                {error && (
                  <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                    {error}
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setShowSaveDialog(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleSave}
                  disabled={!simulationName.trim() || loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Guardando...
                    </>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar
                    </>
                  )}
                </Button>
              </DialogFooter>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 space-y-4">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <Check className="w-8 h-8 text-green-600" />
              </div>
              <p className="text-lg font-semibold text-green-700">¡Simulación guardada!</p>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog: Cargar simulación */}
      <Dialog open={showLoadDialog} onOpenChange={setShowLoadDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cargar Simulación</DialogTitle>
            <DialogDescription>
              Selecciona una simulación guardada anteriormente
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="w-6 h-6 animate-spin text-gray-400" />
              </div>
            ) : simulations.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <FolderOpen className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No tienes simulaciones guardadas de este tipo</p>
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="simulation-select">Selecciona una simulación</Label>
                <Select value={selectedSimulation} onValueChange={setSelectedSimulation}>
                  <SelectTrigger>
                    <SelectValue placeholder="Elige una simulación..." />
                  </SelectTrigger>
                  <SelectContent>
                    {simulations.map((sim) => (
                      <SelectItem key={sim.id} value={sim.id!}>
                        <div className="flex flex-col">
                          <span className="font-medium">{sim.name}</span>
                          <span className="text-xs text-gray-500">
                            {new Date(sim.updatedAt!).toLocaleDateString('es-ES')}
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {error && (
              <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                {error}
              </div>
            )}
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowLoadDialog(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleLoad}
              disabled={!selectedSimulation}
            >
              <FolderOpen className="w-4 h-4 mr-2" />
              Cargar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal de Upgrade cuando se alcanza el límite */}
      {usage && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          currentUsage={usage.used}
          currentLimit={usage.limit}
        />
      )}
    </>
  );
}
