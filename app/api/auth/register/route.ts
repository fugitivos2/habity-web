import { NextResponse } from 'next/server'
import { prisma } from '../../../../lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
  try {
    console.log('=== REGISTRO: Inicio ===')
    const body = await request.json()
    console.log('Body recibido:', { ...body, password: '***' })
    const { name, email, password } = body

    // Validaciones
    if (!name || !email || !password) {
      return NextResponse.json(
        { error: 'Todos los campos son obligatorios' },
        { status: 400 }
      )
    }

    if (password.length < 8) {
      return NextResponse.json(
        { error: 'La contraseña debe tener al menos 8 caracteres' },
        { status: 400 }
      )
    }

    // Verificar si el usuario ya existe
    const existingUser = await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'Este email ya está registrado' },
        { status: 400 }
      )
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10)

    // Crear usuario
    const user = await prisma.user.create({
      data: {
        name,
        email: email.toLowerCase(),
        password: hashedPassword,
        role: 'USER', // Por defecto USER, luego se puede cambiar a ADMIN desde SQL
        status: 'ACTIVE',
        isActive: true,
        onboardingCompleted: false,
      },
    })

    // Crear suscripción gratuita
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'LLAVE', // Plan gratuito
        status: 'ACTIVE',
      },
    })

    return NextResponse.json(
      {
        success: true,
        message: 'Usuario creado exitosamente',
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('=== REGISTRO ERROR ===' )
    console.error('Error completo:', error)
    console.error('Stack:', error.stack)
    return NextResponse.json(
      { error: error.message || 'Error interno del servidor' },
      { status: 500 }
    )
  }
}
