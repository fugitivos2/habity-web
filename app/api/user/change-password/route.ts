import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { hash, compare } from 'bcryptjs'

// POST: Cambiar contraseña del usuario
export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const { currentPassword, newPassword } = await request.json()

    // Validaciones
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Contraseña actual y nueva contraseña requeridas' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    // Obtener usuario con contraseña
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { id: true, password: true, email: true }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    // Verificar si el usuario tiene contraseña (puede ser login con Google)
    if (!user.password) {
      return NextResponse.json(
        { error: 'Esta cuenta usa autenticación externa (Google). No puedes cambiar la contraseña.' },
        { status: 400 }
      )
    }

    // Verificar contraseña actual
    const isPasswordValid = await compare(currentPassword, user.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        { error: 'Contraseña actual incorrecta' },
        { status: 401 }
      )
    }

    // Hash de la nueva contraseña
    const hashedPassword = await hash(newPassword, 12)

    // Actualizar contraseña
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date(),
      }
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: user.id,
        action: 'PASSWORD_CHANGE',
        resource: 'user',
        resourceId: user.id,
        details: { email: user.email },
        success: true,
      }
    }).catch(console.error)

    return NextResponse.json({
      success: true,
      message: 'Contraseña actualizada correctamente'
    })
  } catch (error) {
    console.error('Error al cambiar contraseña:', error)
    return NextResponse.json(
      { error: 'Error al cambiar contraseña' },
      { status: 500 }
    )
  }
}
