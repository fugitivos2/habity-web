import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed de la base de datos...')

  // Crear administrador inicial: Alfredo Fuentes
  const adminEmail = 'alfredo.fuentes1994@gmail.com'
  const adminPassword = await hash('Habity2024!', 12) // Password temporal

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      role: 'ADMIN',
      isActive: true,
      emailVerified: new Date(),
      onboardingCompleted: true,
    },
    create: {
      email: adminEmail,
      name: 'Alfredo Fuentes',
      firstName: 'Alfredo',
      lastName: 'Fuentes',
      role: 'ADMIN',
      isActive: true,
      emailVerified: new Date(),
      onboardingCompleted: true,
      password: adminPassword,
      subscription: {
        create: {
          plan: 'NOTARIA', // Plan máximo para admin
          status: 'ACTIVE',
          startedAt: new Date(),
          // Sin fecha de expiración para admin
        }
      }
    },
    include: {
      subscription: true,
    }
  })

  console.log('✅ Admin creado:', {
    id: admin.id,
    email: admin.email,
    role: admin.role,
    subscription: admin.subscription?.plan
  })

  // Crear configuraciones del sistema
  const systemConfigs = [
    {
      key: 'app_name',
      value: 'tuHabity',
      description: 'Nombre de la aplicación'
    },
    {
      key: 'maintenance_mode',
      value: false,
      description: 'Modo mantenimiento'
    },
    {
      key: 'max_free_properties',
      value: 5,
      description: 'Máximo de propiedades para plan gratuito'
    },
    {
      key: 'max_free_simulations',
      value: 10,
      description: 'Máximo de simulaciones para plan gratuito'
    },
    {
      key: 'email_notifications_enabled',
      value: true,
      description: 'Notificaciones por email habilitadas'
    }
  ]

  for (const config of systemConfigs) {
    await prisma.systemConfig.upsert({
      where: { key: config.key },
      update: { value: config.value },
      create: config
    })
  }

  console.log('✅ Configuraciones del sistema creadas')

  // Crear log de auditoría
  await prisma.auditLog.create({
    data: {
      userId: admin.id,
      action: 'REGISTER',
      resource: 'USER',
      resourceId: admin.id,
      details: {
        type: 'ADMIN_SEED',
        description: 'Admin inicial creado durante seed'
      },
      success: true
    }
  })

  console.log('✅ Log de auditoría creado')
  console.log('')
  console.log('🎉 Seed completado exitosamente!')
  console.log('')
  console.log('📧 Credenciales del admin:')
  console.log(`   Email: ${adminEmail}`)
  console.log(`   Password: Habity2024!`)
  console.log('')
  console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer login')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Error en seed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })