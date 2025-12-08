// Hook personalizado para gestionar simulaciones
// Facilita guardar, cargar, listar y eliminar simulaciones desde cualquier simulador

import { useState, useCallback } from 'react';
import { useSession } from 'next-auth/react';

// Tipos de simulación (replicados del schema de Prisma)
type SimulationType = 
  | 'HIPOTECA'
  | 'GASTOS_COMPRA'
  | 'RENTABILIDAD'
  | 'RATIO_ENDEUDAMIENTO'
  | 'AHORRO_OBJETIVO'
  | 'COMPARADOR'
  | 'FISCAL'
  | 'REFORMA';

export interface SimulationData {
  id?: string;
  type: SimulationType;
  name: string;
  inputData: Record<string, any>;
  results: Record<string, any>;
  propertyId?: string;
  notes?: string;
  isFavorite?: boolean;
  isPublic?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface UseSimulationsReturn {
  // Estado
  simulations: SimulationData[];
  loading: boolean;
  error: string | null;
  
  // Funciones
  saveSimulation: (data: Omit<SimulationData, 'id'>) => Promise<SimulationData | null>;
  loadSimulations: (type?: SimulationType) => Promise<void>;
  updateSimulation: (id: string, data: Partial<SimulationData>) => Promise<boolean>;
  deleteSimulation: (id: string) => Promise<boolean>;
  getSimulation: (id: string) => Promise<SimulationData | null>;
  clearError: () => void;
  
  // Utilidades
  isAuthenticated: boolean;
}

export function useSimulations(): UseSimulationsReturn {
  const { data: session, status } = useSession();
  const [simulations, setSimulations] = useState<SimulationData[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isAuthenticated = status === 'authenticated' && !!session?.user;

  // Guardar nueva simulación
  const saveSimulation = useCallback(async (
    data: Omit<SimulationData, 'id'>
  ): Promise<SimulationData | null> => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión para guardar simulaciones');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/simulations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.error || 'Error al guardar simulación';
        const details = result.details ? ` (${result.details})` : '';
        throw new Error(errorMsg + details);
      }

      // Actualizar lista local
      setSimulations((prev) => [result.simulation, ...prev]);

      return result.simulation;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Cargar simulaciones del usuario
  const loadSimulations = useCallback(async (type?: SimulationType) => {
    if (!isAuthenticated) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      if (type) params.append('type', type);

      const response = await fetch(`/api/simulations?${params.toString()}`);
      const result = await response.json();

      if (!response.ok) {
        const errorMsg = result.error || 'Error al cargar simulaciones';
        const details = result.details ? ` (${result.details})` : '';
        throw new Error(errorMsg + details);
      }

      setSimulations(result.simulations);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Obtener una simulación específica
  const getSimulation = useCallback(async (id: string): Promise<SimulationData | null> => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión');
      return null;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/simulations/${id}`);
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al obtener simulación');
      }

      return result.simulation;
    } catch (err: any) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Actualizar simulación existente
  const updateSimulation = useCallback(async (
    id: string,
    data: Partial<SimulationData>
  ): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/simulations/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al actualizar simulación');
      }

      // Actualizar lista local
      setSimulations((prev) =>
        prev.map((sim) => (sim.id === id ? { ...sim, ...result.simulation } : sim))
      );

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Eliminar simulación
  const deleteSimulation = useCallback(async (id: string): Promise<boolean> => {
    if (!isAuthenticated) {
      setError('Debes iniciar sesión');
      return false;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/simulations/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || 'Error al eliminar simulación');
      }

      // Actualizar lista local
      setSimulations((prev) => prev.filter((sim) => sim.id !== id));

      return true;
    } catch (err: any) {
      setError(err.message);
      return false;
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  // Limpiar errores manualmente
  const clearError = useCallback(() => {
    setError(null);
  }, []);

  return {
    simulations,
    loading,
    error,
    saveSimulation,
    loadSimulations,
    updateSimulation,
    deleteSimulation,
    getSimulation,
    clearError,
    isAuthenticated,
  };
}
