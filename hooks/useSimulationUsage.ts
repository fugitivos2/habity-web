import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface SimulationUsage {
  used: number
  limit: number
  remaining: number
  canSave: boolean
  plan: string
  isUnlimited: boolean
  periodStart: string
  periodEnd: string
}

interface UseSimulationUsageResult {
  usage: SimulationUsage | null
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function useSimulationUsage(): UseSimulationUsageResult {
  const { data: session } = useSession()
  const [usage, setUsage] = useState<SimulationUsage | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchUsage = async () => {
    if (!session?.user) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const response = await fetch('/api/simulations/usage')
      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Error al cargar uso de simulaciones')
      }

      setUsage(data.usage)
    } catch (err: any) {
      console.error('Error fetching simulation usage:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsage()
  }, [session])

  return {
    usage,
    loading,
    error,
    refetch: fetchUsage,
  }
}
