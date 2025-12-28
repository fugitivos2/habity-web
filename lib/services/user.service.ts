/**
 * User Service
 * Servicio centralizado para operaciones de usuario
 * Facilita el escalado y mantenimiento del código
 */

import { prisma } from '@/lib/prisma'
import { hash, compare } from 'bcryptjs'

export class UserService {
  /**
   * Obtener usuario por ID con relaciones opcionales
   */
  static async getUserById(userId: string, includeRelations = false) {
    return await prisma.user.findUnique({
      where: { id: userId },
      include: includeRelations ? {
        subscription: true,
        simulations: {
          take: 10,
          orderBy: { createdAt: 'desc' }
        },
      } : undefined
    })
  }

  /**
   * Obtener usuario por email
   */
  static async getUserByEmail(email: string) {
    return await prisma.user.findUnique({
      where: { email: email.toLowerCase() },
      include: { subscription: true }
    })
  }

  /**
   * Actualizar perfil de usuario
   */
  static async updateProfile(
    userId: string, 
    data: {
      name?: string
      firstName?: string
      lastName?: string
      phone?: string
      bio?: string
    }
  ) {
    return await prisma.user.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        firstName: true,
        lastName: true,
        phone: true,
        bio: true,
        email: true,
      }
    })
  }

  /**
   * Actualizar preferencias de usuario
   */
  static async updatePreferences(
    userId: string,
    preferences: {
      theme?: string
      language?: string
      timezone?: string
      notificationsEnabled?: boolean
      marketingEmails?: boolean
      productUpdates?: boolean
      weeklyDigest?: boolean
    }
  ) {
    return await prisma.user.update({
      where: { id: userId },
      data: preferences,
    })
  }

  /**
   * Cambiar contraseña de usuario
   */
  static async changePassword(
    userId: string,
    currentPassword: string,
    newPassword: string
  ) {
    // Obtener usuario con contraseña
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { password: true }
    })

    if (!user?.password) {
      throw new Error('Usuario no tiene contraseña configurada')
    }

    // Verificar contraseña actual
    const isValid = await compare(currentPassword, user.password)
    if (!isValid) {
      throw new Error('Contraseña actual incorrecta')
    }

    // Hashear nueva contraseña
    const hashedPassword = await hash(newPassword, 12)

    // Actualizar contraseña
    return await prisma.user.update({
      where: { id: userId },
      data: {
        password: hashedPassword,
        passwordChangedAt: new Date()
      }
    })
  }

  /**
   * Verificar si el usuario está activo
   */
  static async isUserActive(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { isActive: true, status: true }
    })

    return user?.isActive && user?.status === 'ACTIVE'
  }

  /**
   * Actualizar último login
   */
  static async updateLastLogin(userId: string) {
    return await prisma.user.update({
      where: { id: userId },
      data: { 
        lastLoginAt: new Date(),
        lastActiveAt: new Date()
      }
    })
  }

  /**
   * Obtener estadísticas del usuario
   */
  static async getUserStats(userId: string) {
    const [simulationsCount, propertiesCount, subscription] = await Promise.all([
      prisma.simulation.count({ where: { userId } }),
      prisma.property.count({ where: { userId } }),
      prisma.subscription.findUnique({ where: { userId } })
    ])

    return {
      simulationsCount,
      propertiesCount,
      subscription,
      simulationsUsed: subscription?.simulationsUsed || 0,
      plan: subscription?.plan || 'LLAVE'
    }
  }
}
