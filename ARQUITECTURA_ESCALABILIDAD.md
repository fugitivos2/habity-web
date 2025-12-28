# 🏗️ Arquitectura para Escalabilidad - tuHabity

## 📋 Índice
1. [Visión General](#visión-general)
2. [Estructura del Proyecto](#estructura-del-proyecto)
3. [Capas de la Aplicación](#capas-de-la-aplicación)
4. [Servicios](#servicios)
5. [Patrones de Diseño](#patrones-de-diseño)
6. [Roadmap de Escalabilidad](#roadmap-de-escalabilidad)

---

## 🎯 Visión General

tuHabity está diseñado para escalar desde MVP hasta una plataforma enterprise como **Holded**, siguiendo principios de:

- **Separación de responsabilidades** (Separation of Concerns)
- **Inyección de dependencias** (Dependency Injection)
- **Servicios reutilizables** (Service Layer Pattern)
- **API-first architecture**
- **Modularización** y **microservicios preparados**

---

## 📂 Estructura del Proyecto

```
webapp/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes (Backend)
│   │   ├── auth/                 # Autenticación
│   │   ├── simulations/          # Simulaciones
│   │   ├── properties/           # Propiedades (futuro)
│   │   ├── reports/              # Reportes PDF (futuro)
│   │   └── user/                 # Usuario y perfil
│   ├── dashboard/                # Dashboard principal
│   ├── simuladores/              # Página de simuladores
│   ├── pricing/                  # Pricing y planes
│   └── configuracion/            # Configuración de usuario
│
├── components/                   # Componentes React
│   ├── dashboard/                # Componentes del dashboard
│   ├── layout/                   # Layout components
│   ├── simulations/              # Componentes de simulaciones
│   ├── simulators/               # Simuladores específicos
│   └── ui/                       # UI components (shadcn)
│
├── lib/                          # Lógica de negocio
│   ├── services/                 # ⭐ SERVICIOS (Capa de negocio)
│   │   ├── user.service.ts       # Operaciones de usuario
│   │   ├── simulation.service.ts # Operaciones de simulaciones
│   │   ├── subscription.service.ts (próximamente)
│   │   ├── property.service.ts   (próximamente)
│   │   └── report.service.ts     (próximamente)
│   │
│   ├── utils/                    # Utilidades reutilizables
│   │   ├── validation.ts         # Validaciones
│   │   ├── formatting.ts         # Formateo de datos
│   │   └── calculations.ts       # Cálculos financieros
│   │
│   ├── constants/                # Constantes del sistema
│   │   ├── plans.ts              # Configuración de planes
│   │   ├── simulator-types.ts    # Tipos de simuladores
│   │   └── error-messages.ts     # Mensajes de error
│   │
│   ├── auth.ts                   # NextAuth configuration
│   └── prisma.ts                 # Prisma client
│
├── prisma/
│   ├── schema.prisma             # Schema de base de datos
│   ├── migrations/               # Migraciones
│   └── seed.ts                   # Datos de prueba
│
├── hooks/                        # Custom React Hooks
│   ├── useSimulations.ts
│   ├── useSimulationUsage.ts
│   └── useUser.ts
│
└── middleware.ts                 # Middleware de Next.js
```

---

## 🎨 Capas de la Aplicación

### 1. **Capa de Presentación** (Frontend)
- **Tecnología**: React, Next.js 14, TailwindCSS
- **Responsabilidad**: UI/UX, interacciones del usuario
- **Componentes**: `app/`, `components/`

### 2. **Capa de API** (Backend)
- **Tecnología**: Next.js API Routes
- **Responsabilidad**: Endpoints HTTP, validación de entrada
- **Ubicación**: `app/api/`

### 3. **Capa de Servicios** (Business Logic) ⭐
- **Tecnología**: TypeScript Classes
- **Responsabilidad**: Lógica de negocio, operaciones complejas
- **Ubicación**: `lib/services/`
- **Ventajas**:
  - Reutilización de código
  - Fácil testing
  - Separación de responsabilidades
  - Preparado para microservicios

### 4. **Capa de Datos** (Database)
- **Tecnología**: Prisma ORM + PostgreSQL (Supabase)
- **Responsabilidad**: Acceso a datos, queries
- **Ubicación**: `lib/prisma.ts`, `prisma/schema.prisma`

---

## 🔧 Servicios

### `UserService` (`lib/services/user.service.ts`)

**Responsabilidades:**
- Gestión de usuarios
- Actualización de perfiles
- Cambio de contraseñas
- Preferencias de usuario

**Métodos principales:**
```typescript
UserService.getUserById(userId)
UserService.updateProfile(userId, data)
UserService.changePassword(userId, currentPassword, newPassword)
UserService.updatePreferences(userId, preferences)
```

### `SimulationService` (`lib/services/simulation.service.ts`)

**Responsabilidades:**
- CRUD de simulaciones
- Control de uso mensual
- Límites por plan
- Estadísticas

**Métodos principales:**
```typescript
SimulationService.createSimulation(data)
SimulationService.getUserSimulations(userId, filters)
SimulationService.getMonthlyUsage(userId)
SimulationService.canCreateSimulation(userId)
```

### Servicios Futuros (Roadmap)

#### `SubscriptionService`
- Gestión de suscripciones
- Integración con Stripe
- Renovaciones automáticas
- Cambios de plan

#### `PropertyService`
- Gestión de propiedades inmobiliarias
- Análisis de mercado
- Comparativas
- Alertas de precio

#### `ReportService`
- Generación de PDFs
- Dossiers bancarios
- Análisis de inversión
- Exportación de datos

#### `NotificationService`
- Emails transaccionales
- Push notifications
- Notificaciones in-app
- Webhooks

---

## 🎯 Patrones de Diseño Implementados

### 1. **Service Layer Pattern**
Separación de la lógica de negocio en servicios reutilizables.

```typescript
// ❌ MAL: Lógica en el API route
export async function POST(request: Request) {
  const user = await prisma.user.findUnique(...)
  const subscription = await prisma.subscription.findUnique(...)
  // 50 líneas de lógica compleja...
}

// ✅ BIEN: Usar servicio
export async function POST(request: Request) {
  const data = await request.json()
  const result = await SimulationService.createSimulation(data)
  return NextResponse.json(result)
}
```

### 2. **Repository Pattern** (Preparado)
Abstracción del acceso a datos.

```typescript
// Futuro: lib/repositories/user.repository.ts
export class UserRepository {
  static async findById(id: string) {
    return await prisma.user.findUnique({ where: { id } })
  }
}
```

### 3. **Dependency Injection** (Preparado)
Para testing y flexibilidad.

```typescript
// Futuro: Inyección de dependencias
class SimulationService {
  constructor(private db: PrismaClient) {}
}
```

### 4. **Factory Pattern**
Para creación de objetos complejos.

```typescript
// lib/factories/simulation.factory.ts
export class SimulationFactory {
  static createHipotecaSimulation(data) { /* ... */ }
  static createGastosCompraSimulation(data) { /* ... */ }
}
```

---

## 🚀 Roadmap de Escalabilidad

### **Fase 1: MVP Actual** ✅
- [x] Autenticación
- [x] 5 Simuladores
- [x] Sistema de planes
- [x] Dashboard básico
- [x] Servicios base (User, Simulation)

### **Fase 2: Consolidación** (Próximos 3 meses)
- [ ] Integración con Stripe para pagos
- [ ] Generación de PDFs
- [ ] Comparador de propiedades
- [ ] Analytics y métricas
- [ ] Tests unitarios y e2e
- [ ] CI/CD pipeline

### **Fase 3: Expansión** (6-12 meses)
- [ ] Multi-propiedad
- [ ] CRM básico
- [ ] Integraciones con portales inmobiliarios
- [ ] API pública
- [ ] Webhooks
- [ ] Panel de admin

### **Fase 4: Enterprise** (12-24 meses)
- [ ] Multi-tenant
- [ ] White label
- [ ] Microservicios (separación en servicios independientes)
- [ ] Sistema de permisos avanzado (RBAC)
- [ ] Auditoría completa
- [ ] SSO (Single Sign-On)

---

## 🏢 Migración a Microservicios (Futuro)

Cuando la aplicación crezca, se puede separar en microservicios:

```
┌─────────────────────────────────────────────────────────┐
│                      Frontend (Next.js)                  │
└─────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────┐
│                    API Gateway (Next.js)                 │
└─────────────────────────────────────────────────────────┘
                            ↓
        ┌──────────────────┬───────────────────┬──────────────────┐
        ↓                  ↓                   ↓                  ↓
┌───────────────┐  ┌───────────────┐  ┌───────────────┐  ┌───────────────┐
│   Auth Service│  │Simulation Svc │  │Property Service│  │Report Service │
│   (Node.js)   │  │  (Node.js)    │  │   (Node.js)   │  │  (Node.js)    │
└───────────────┘  └───────────────┘  └───────────────┘  └───────────────┘
        ↓                  ↓                   ↓                  ↓
┌───────────────────────────────────────────────────────────────────────────┐
│                      PostgreSQL (Supabase)                                │
└───────────────────────────────────────────────────────────────────────────┘
```

**Ventajas:**
- Escalado independiente por servicio
- Deploy independiente
- Tecnologías diferentes por servicio si es necesario
- Mejor tolerancia a fallos

---

## 📊 Métricas de Éxito

### KPIs Técnicos
- **Response Time**: < 200ms (p95)
- **Uptime**: > 99.9%
- **Code Coverage**: > 80%
- **Lighthouse Score**: > 90

### KPIs de Negocio
- **MAU** (Monthly Active Users)
- **Retention Rate**: > 40%
- **Conversion Rate** (Free → Paid): > 5%
- **Churn Rate**: < 5%

---

## 🔐 Seguridad

- **Autenticación**: NextAuth.js con JWT
- **Rate Limiting**: Implementar en Fase 2
- **SQL Injection**: Protegido por Prisma ORM
- **XSS**: React escapa por defecto
- **CORS**: Configurado en API routes
- **Environment Variables**: Nunca exponer en frontend

---

## 📚 Recursos

- [Next.js Docs](https://nextjs.org/docs)
- [Prisma Best Practices](https://www.prisma.io/docs/guides/performance-and-optimization)
- [Supabase Docs](https://supabase.com/docs)
- [Clean Architecture](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)

---

**Última actualización:** Diciembre 2024
**Versión:** 1.0.0
