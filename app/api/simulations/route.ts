// API para gestionar simulaciones guardadas
// GET: Listar simulaciones del usuario
// POST: Crear nueva simulación

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { SimulationType } from '@prisma/client';

// GET /api/simulations - Listar simulaciones del usuario
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type') as SimulationType | null;
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const where: any = {
      userId: session.user.id,
    };

    if (type) {
      where.type = type;
    }

    const [simulations, total] = await Promise.all([
      prisma.simulation.findMany({
        where,
        orderBy: {
          updatedAt: 'desc',
        },
        take: limit,
        skip: offset,
        include: {
          property: {
            select: {
              id: true,
              title: true,
              price: true,
              address: true,
            },
          },
        },
      }),
      prisma.simulation.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      simulations,
      total,
      limit,
      offset,
    });
  } catch (error: any) {
    console.error('Error al listar simulaciones:', error);
    return NextResponse.json(
      { 
        error: 'Error al listar simulaciones', 
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined 
      },
      { status: 500 }
    );
  }
}

// POST /api/simulations - Crear nueva simulación
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { type, name, inputData, results, propertyId, notes, isFavorite } = body;

    // Validaciones
    if (!type || !name || !inputData || !results) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios: type, name, inputData, results' },
        { status: 400 }
      );
    }

    // Verificar tipo válido
    const validTypes: SimulationType[] = [
      'HIPOTECA',
      'GASTOS_COMPRA',
      'RENTABILIDAD',
      'RATIO_ENDEUDAMIENTO',
      'AHORRO_OBJETIVO',
      'COMPARADOR',
    ];

    if (!validTypes.includes(type)) {
      return NextResponse.json(
        { error: `Tipo de simulación inválido. Debe ser uno de: ${validTypes.join(', ')}` },
        { status: 400 }
      );
    }

    // Verificar límites de suscripción
    const subscription = await prisma.subscription.findUnique({
      where: { userId: session.user.id },
    });

    const currentMonth = new Date();
    currentMonth.setHours(0, 0, 0, 0);
    currentMonth.setDate(1);

    const simulationsThisMonth = await prisma.simulation.count({
      where: {
        userId: session.user.id,
        createdAt: {
          gte: currentMonth,
        },
      },
    });

    // Límites por plan
    const limits: Record<string, number> = {
      LLAVE: 5,        // Plan gratuito: 5 simulaciones/mes
      ESCRITURA: 50,   // Plan básico: 50 simulaciones/mes
      NOTARIA: -1,     // Plan premium: ilimitado
      ENTERPRISE: -1,  // Plan enterprise: ilimitado
    };

    const userLimit = limits[subscription?.plan || 'LLAVE'];

    if (userLimit !== -1 && simulationsThisMonth >= userLimit) {
      return NextResponse.json(
        { 
          error: `Has alcanzado el límite de ${userLimit} simulaciones este mes. Mejora tu plan para guardar más.`,
          limitReached: true,
        },
        { status: 403 }
      );
    }

    // Crear simulación
    const simulation = await prisma.simulation.create({
      data: {
        userId: session.user.id,
        type,
        name,
        inputData,
        results,
        propertyId: propertyId || null,
        notes: notes || null,
        isFavorite: isFavorite || false,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
          },
        },
      },
    });

    // Actualizar contador de suscripción
    if (subscription) {
      await prisma.subscription.update({
        where: { userId: session.user.id },
        data: {
          simulationsUsed: {
            increment: 1,
          },
        },
      });
    }

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'SIMULATION_CREATE',
        resource: 'Simulation',
        resourceId: simulation.id,
        details: {
          type,
          name,
        },
      },
    }).catch(console.error);

    return NextResponse.json({
      success: true,
      simulation,
      message: 'Simulación guardada correctamente',
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error al crear simulación:', error);
    return NextResponse.json(
      { 
        error: 'Error al crear simulación',
        details: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}
