// API para gestionar simulación individual
// GET: Obtener simulación por ID
// PUT: Actualizar simulación
// DELETE: Eliminar simulación

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

// GET /api/simulations/[id] - Obtener simulación por ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const simulation = await prisma.simulation.findUnique({
      where: {
        id: params.id,
      },
      include: {
        property: {
          select: {
            id: true,
            title: true,
            price: true,
            address: true,
            city: true,
            province: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!simulation) {
      return NextResponse.json(
        { error: 'Simulación no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que el usuario sea el propietario o la simulación sea pública
    if (simulation.userId !== session.user.id && !simulation.isPublic) {
      return NextResponse.json(
        { error: 'No tienes permiso para ver esta simulación' },
        { status: 403 }
      );
    }

    return NextResponse.json({ simulation });
  } catch (error) {
    console.error('Error al obtener simulación:', error);
    return NextResponse.json(
      { error: 'Error al obtener simulación' },
      { status: 500 }
    );
  }
}

// PUT /api/simulations/[id] - Actualizar simulación
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { name, inputData, results, notes, isFavorite, isPublic } = body;

    // Verificar que la simulación existe y pertenece al usuario
    const existingSimulation = await prisma.simulation.findUnique({
      where: { id: params.id },
    });

    if (!existingSimulation) {
      return NextResponse.json(
        { error: 'Simulación no encontrada' },
        { status: 404 }
      );
    }

    if (existingSimulation.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para modificar esta simulación' },
        { status: 403 }
      );
    }

    // Actualizar simulación
    const simulation = await prisma.simulation.update({
      where: { id: params.id },
      data: {
        ...(name && { name }),
        ...(inputData && { inputData }),
        ...(results && { results }),
        ...(notes !== undefined && { notes }),
        ...(isFavorite !== undefined && { isFavorite }),
        ...(isPublic !== undefined && { isPublic }),
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

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'SIMULATION_UPDATE',
        resource: 'Simulation',
        resourceId: simulation.id,
        details: {
          changes: body,
        },
      },
    }).catch(console.error);

    return NextResponse.json({
      simulation,
      message: 'Simulación actualizada correctamente',
    });
  } catch (error) {
    console.error('Error al actualizar simulación:', error);
    return NextResponse.json(
      { error: 'Error al actualizar simulación' },
      { status: 500 }
    );
  }
}

// DELETE /api/simulations/[id] - Eliminar simulación
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      );
    }

    // Verificar que la simulación existe y pertenece al usuario
    const existingSimulation = await prisma.simulation.findUnique({
      where: { id: params.id },
    });

    if (!existingSimulation) {
      return NextResponse.json(
        { error: 'Simulación no encontrada' },
        { status: 404 }
      );
    }

    if (existingSimulation.userId !== session.user.id) {
      return NextResponse.json(
        { error: 'No tienes permiso para eliminar esta simulación' },
        { status: 403 }
      );
    }

    // Eliminar simulación
    await prisma.simulation.delete({
      where: { id: params.id },
    });

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'SIMULATION_DELETE',
        resource: 'Simulation',
        resourceId: params.id,
        details: {
          type: existingSimulation.type,
          name: existingSimulation.name,
        },
      },
    }).catch(console.error);

    return NextResponse.json({
      message: 'Simulación eliminada correctamente',
    });
  } catch (error) {
    console.error('Error al eliminar simulación:', error);
    return NextResponse.json(
      { error: 'Error al eliminar simulación' },
      { status: 500 }
    );
  }
}
