import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

// GET: Obtener preferencias del usuario
export async function GET() {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        theme: true,
        language: true,
        timezone: true,
        notificationsEnabled: true,
        marketingEmails: true,
        productUpdates: true,
        weeklyDigest: true,
      }
    })

    if (!user) {
      return NextResponse.json(
        { error: 'Usuario no encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json(user)
  } catch (error) {
    console.error('Error al obtener preferencias:', error)
    return NextResponse.json(
      { error: 'Error al obtener preferencias' },
      { status: 500 }
    )
  }
}

// PUT: Actualizar preferencias del usuario
export async function PUT(request: Request) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    const body = await request.json()
    const {
      theme,
      language,
      timezone,
      notificationsEnabled,
      marketingEmails,
      productUpdates,
      weeklyDigest,
    } = body

    // Validaciones
    const validThemes = ['light', 'dark', 'system']
    const validLanguages = ['es', 'en', 'ca']

    if (theme && !validThemes.includes(theme)) {
      return NextResponse.json(
        { error: 'Tema inválido' },
        { status: 400 }
      )
    }

    if (language && !validLanguages.includes(language)) {
      return NextResponse.json(
        { error: 'Idioma inválido' },
        { status: 400 }
      )
    }

    // Actualizar usuario
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        theme,
        language,
        timezone,
        notificationsEnabled,
        marketingEmails,
        productUpdates,
        weeklyDigest,
      },
      select: {
        theme: true,
        language: true,
        timezone: true,
        notificationsEnabled: true,
        marketingEmails: true,
        productUpdates: true,
        weeklyDigest: true,
      }
    })

    // Log de auditoría
    await prisma.auditLog.create({
      data: {
        userId: session.user.id,
        action: 'PASSWORD_CHANGE',
        resource: 'user_preferences',
        resourceId: session.user.id,
        details: { updatedFields: Object.keys(body) },
        success: true,
      }
    }).catch(console.error)

    return NextResponse.json(updatedUser)
  } catch (error) {
    console.error('Error al actualizar preferencias:', error)
    return NextResponse.json(
      { error: 'Error al actualizar preferencias' },
      { status: 500 }
    )
  }
}
