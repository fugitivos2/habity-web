/**
 * Simulation Service
 * Servicio centralizado para operaciones de simulaciones
 */

import { prisma } from '@/lib/prisma'
import { SimulationType } from '@prisma/client'

export class SimulationService {
  /**
   * Crear nueva simulación
   */
  static async createSimulation(data: {
    userId: string
    type: SimulationType
    name: string
    inputData: any
    results: any
    propertyId?: string
  }) {
    // Incrementar contador de uso mensual
    await this.incrementMonthlyUsage(data.userId)

    return await prisma.simulation.create({
      data,
      include: {
        property: true
      }
    })
  }

  /**
   * Obtener simulaciones del usuario
   */
  static async getUserSimulations(
    userId: string,
    filters?: {
      type?: SimulationType
      search?: string
      limit?: number
      offset?: number
    }
  ) {
    const where: any = { userId }

    if (filters?.type) {
      where.type = filters.type
    }

    if (filters?.search) {
      where.name = {
        contains: filters.search,
        mode: 'insensitive'
      }
    }

    return await prisma.simulation.findMany({
      where,
      include: {
        property: {
          select: {
            title: true,
            address: true,
            price: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: filters?.limit || 50,
      skip: filters?.offset || 0
    })
  }

  /**
   * Obtener simulación por ID
   */
  static async getSimulationById(simulationId: string, userId: string) {
    return await prisma.simulation.findFirst({
      where: {
        id: simulationId,
        userId
      },
      include: {
        property: true
      }
    })
  }

  /**
   * Actualizar simulación
   */
  static async updateSimulation(
    simulationId: string,
    userId: string,
    data: {
      name?: string
      inputData?: any
      results?: any
      notes?: string
      isFavorite?: boolean
    }
  ) {
    return await prisma.simulation.update({
      where: {
        id: simulationId,
        userId
      },
      data
    })
  }

  /**
   * Eliminar simulación
   */
  static async deleteSimulation(simulationId: string, userId: string) {
    return await prisma.simulation.delete({
      where: {
        id: simulationId,
        userId
      }
    })
  }

  /**
   * Obtener uso mensual de simulaciones
   */
  static async getMonthlyUsage(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId },
      select: {
        simulationsUsed: true,
        usageReset: true,
        plan: true
      }
    })

    if (!subscription) {
      return { used: 0, limit: 5, plan: 'LLAVE' }
    }

    // Límites por plan
    const limits = {
      LLAVE: 5,
      ESCRITURA: 50,
      NOTARIA: Infinity,
      ENTERPRISE: Infinity
    }

    return {
      used: subscription.simulationsUsed,
      limit: limits[subscription.plan],
      plan: subscription.plan,
      resetDate: subscription.usageReset
    }
  }

  /**
   * Incrementar uso mensual
   */
  static async incrementMonthlyUsage(userId: string) {
    const subscription = await prisma.subscription.findUnique({
      where: { userId }
    })

    if (!subscription) {
      // Crear suscripción gratuita si no existe
      await prisma.subscription.create({
        data: {
          userId,
          plan: 'LLAVE',
          status: 'ACTIVE',
          simulationsUsed: 1
        }
      })
      return
    }

    // Verificar si hay que resetear el contador mensual
    const now = new Date()
    const resetDate = new Date(subscription.usageReset)
    
    if (now > resetDate) {
      // Resetear contador y establecer nueva fecha
      const nextMonth = new Date(now)
      nextMonth.setMonth(nextMonth.getMonth() + 1)
      
      await prisma.subscription.update({
        where: { userId },
        data: {
          simulationsUsed: 1,
          usageReset: nextMonth
        }
      })
    } else {
      // Incrementar contador
      await prisma.subscription.update({
        where: { userId },
        data: {
          simulationsUsed: { increment: 1 }
        }
      })
    }
  }

  /**
   * Verificar si puede crear más simulaciones
   */
  static async canCreateSimulation(userId: string): Promise<boolean> {
    const usage = await this.getMonthlyUsage(userId)
    return usage.used < usage.limit
  }
}
