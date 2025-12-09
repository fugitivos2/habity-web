// API para obtener el uso de simulaciones del usuario
// GET: Devuelve simulaciones usadas este mes y límite del plan

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// Marcar como ruta dinámica
export const dynamic = 'force-dynamic'

// Límites por plan
const PLAN_LIMITS = {
  LLAVE: 5,
  ESCRITURA: 50,
  NOTARIA: -1, // -1 = ilimitado
}

// GET /api/simulations/usage - Obtener uso actual
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Obtener usuario con suscripción
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      include: {
        subscription: true,
      },
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Determinar plan actual (por defecto LLAVE si no tiene suscripción)
    const currentPlan = user.subscription?.plan || 'LLAVE'
    const planLimit = PLAN_LIMITS[currentPlan as keyof typeof PLAN_LIMITS]

    // Calcular inicio del mes actual
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59)

    // Contar simulaciones creadas este mes
    const simulationsThisMonth = await prisma.simulation.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: startOfMonth,
          lte: endOfMonth,
        },
      },
    })

    // Calcular si puede guardar más
    const canSave = planLimit === -1 || simulationsThisMonth < planLimit
    const remaining = planLimit === -1 ? -1 : Math.max(0, planLimit - simulationsThisMonth)

    return NextResponse.json({
      success: true,
      usage: {
        used: simulationsThisMonth,
        limit: planLimit,
        remaining: remaining,
        canSave: canSave,
        plan: currentPlan,
        isUnlimited: planLimit === -1,
        periodStart: startOfMonth.toISOString(),
        periodEnd: endOfMonth.toISOString(),
      },
    })
  } catch (error: any) {
    console.error('Error al obtener uso de simulaciones:', error)
    return NextResponse.json(
      { 
        error: 'Error al obtener uso de simulaciones',
        details: error.message 
      },
      { status: 500 }
    )
  }
}
