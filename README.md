# tuHabity - Tu hogar en números 🏠

**Plataforma integral de simuladores inmobiliarios y financieros.**

> 🎉 **Estado**: MVP 100% COMPLETO - Listo para producción

[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.7-brightgreen)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE)

---

## 📋 Tabla de Contenidos

- [Descripción](#descripción)
- [Funcionalidades](#funcionalidades)
- [Stack Tecnológico](#stack-tecnológico)
- [Instalación](#instalación)
- [Configuración](#configuración)
- [Deployment](#deployment)
- [Arquitectura](#arquitectura)
- [Roadmap](#roadmap)

---

## 🎯 Descripción

**tuHabity** es una plataforma SaaS de simuladores inmobiliarios y financieros que permite a usuarios:
- Calcular hipotecas y gastos de compraventa
- Simular rentabilidad de inversiones inmobiliarias
- Gestionar múltiples simulaciones
- Exportar informes en PDF (próximamente)
- Comparar propiedades (próximamente)

**Público objetivo**: Compradores de primera vivienda, inversores inmobiliarios, asesores financieros.

---

## ✨ Funcionalidades

### ✅ Autenticación
- [x] Registro con email/password
- [x] Login con Google OAuth
- [x] Sesión persistente (30 días)
- [x] Roles (USER, ADMIN)
- [x] Recuperación de contraseña

### ✅ Dashboard Profesional
- [x] Estadísticas de uso
- [x] Actividad reciente
- [x] Acceso rápido a simuladores
- [x] Badge de suscripción
- [x] Barra de progreso de uso

### ✅ 5 Simuladores Completos
1. **Hipoteca**: Cuota mensual, intereses totales, LTV
2. **Gastos de Compra**: ITP/IVA, notaría, registro, gestoría
3. **Capacidad de Endeudamiento**: Cuánto puedes pedir prestado
4. **Impuestos (Plusvalía)**: Ganancia patrimonial + plusvalía municipal
5. **Reforma**: Estimación de costes por partidas

### ✅ Gestión de Simulaciones
- [x] Guardar simulaciones con nombre personalizado
- [x] Cargar simulaciones previas
- [x] Editar nombre de simulaciones
- [x] Marcar como favorito
- [x] Eliminar con confirmación
- [x] Búsqueda por nombre
- [x] Filtros por tipo de simulador

### ✅ Sistema de Suscripciones
- **Plan LLAVE** (Gratis): 5 simulaciones/mes
- **Plan ESCRITURA** (9.99€/mes): 50 simulaciones/mes + PDF + Comparador
- **Plan NOTARÍA** (19.99€/mes): Ilimitado + Multi-propiedad + Rentabilidad

### ✅ Límites de Uso
- [x] Contador mensual de simulaciones
- [x] Badge de uso con barra de progreso
- [x] Modal de upgrade automático
- [x] Bloqueo al alcanzar límite

### ✅ Mi Cuenta
- [x] Actualizar perfil (nombre, apellidos, teléfono, bio)
- [x] Cambios en tiempo real

### ✅ Suscripción
- [x] Detalles del plan actual
- [x] Uso mensual con barra de progreso
- [x] Fecha de renovación
- [x] Botón "Cambiar Plan"

### ✨ **Configuración** (NUEVO)
- [x] **Preferencias**: Tema (claro/oscuro/sistema), idioma, zona horaria
- [x] **Notificaciones**: Emails de marketing, actualizaciones, resumen semanal
- [x] **Seguridad**: Cambio de contraseña con validaciones

### ✨ **Arquitectura Escalable** (NUEVO)
- [x] **Servicios modulares**: UserService, SimulationService
- [x] **Constantes centralizadas**: Planes, límites, configuración
- [x] **Utilidades de validación**: Email, contraseña, teléfono, precios
- [x] **Documentación de arquitectura**: Roadmap a nivel enterprise

---

## 🛠️ Stack Tecnológico

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Componentes UI**: Shadcn/ui + Radix UI
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React

### Backend
- **API**: Next.js API Routes
- **ORM**: Prisma 5.7.1
- **Base de Datos**: PostgreSQL (Supabase)
- **Autenticación**: NextAuth.js

### DevOps
- **Hosting**: Vercel
- **Control de versiones**: Git + GitHub
- **CI/CD**: Vercel Auto-Deploy

---

## 📦 Instalación

### Requisitos Previos
- Node.js 18+ 
- npm o yarn
- Cuenta en Supabase (o PostgreSQL local)

### Pasos

```bash
# 1. Clonar repositorio
git clone https://github.com/fugitivos2/habity-web.git
cd habity-web

# 2. Instalar dependencias
npm install

# 3. Copiar archivo de entorno
cp .env.example .env

# 4. Configurar .env con tus credenciales (ver abajo)

# 5. Generar cliente de Prisma
npx prisma generate

# 6. Aplicar migraciones
npx prisma db push

# 7. (Opcional) Poblar con datos de prueba
npm run db:seed

# 8. Iniciar servidor de desarrollo
npm run dev
```

**Abrir**: http://localhost:3000

---

## ⚙️ Configuración

### Variables de Entorno (`.env`)

```bash
# ========================================
# DATABASE - Supabase PostgreSQL
# ========================================
POSTGRES_PRISMA_URL="postgresql://..."
POSTGRES_URL_NON_POOLING="postgresql://..."

# ========================================
# SUPABASE
# ========================================
SUPABASE_URL="https://..."
SUPABASE_ANON_KEY="..."

# ========================================
# NEXTAUTH
# ========================================
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-here"

# ========================================
# GOOGLE OAUTH (Opcional)
# ========================================
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""
```

### Obtener Credenciales de Supabase

1. Crear cuenta en [Supabase](https://supabase.com)
2. Crear nuevo proyecto
3. Ve a **Settings → Database**
4. Copiar **Connection Pooling** (para `POSTGRES_PRISMA_URL`)
5. Copiar **Direct Connection** (para `POSTGRES_URL_NON_POOLING`)

### Generar NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

---

## 🚀 Deployment

### Deploy en Vercel (Recomendado)

1. **Push a GitHub**:
```bash
git add .
git commit -m "Deploy to production"
git push origin main
```

2. **Conectar en Vercel**:
   - Ve a [vercel.com](https://vercel.com)
   - Import repository: `fugitivos2/habity-web`
   - Configurar variables de entorno (mismas que `.env`)
   - Deploy

3. **Configurar Variables de Entorno en Vercel**:
   - Settings → Environment Variables
   - Agregar todas las variables de `.env`
   - Marcar para Production, Preview y Development

4. **Ejecutar Migraciones en Producción**:
```bash
npx prisma db push
```

5. **Verificar Deployment**:
   - Production: https://tuhabity.com
   - Preview: https://habity-web-git-main-fugitivos2s-projects.vercel.app

### Dominio Personalizado

En Vercel Dashboard:
1. Settings → Domains
2. Add Domain: `tuhabity.com`
3. Configurar DNS en tu proveedor:
   - Type: A, Name: @, Value: 76.76.21.21
   - Type: CNAME, Name: www, Value: cname.vercel-dns.com

---

## 🏗️ Arquitectura

### Estructura del Proyecto

```
webapp/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Autenticación
│   │   ├── simulations/          # Simulaciones
│   │   └── user/                 # Usuario y perfil
│   ├── dashboard/                # Dashboard
│   ├── simuladores/              # Simuladores
│   ├── pricing/                  # Pricing
│   ├── mi-cuenta/                # Mi Cuenta
│   ├── suscripcion/              # Suscripción
│   └── configuracion/            # Configuración ✨ NUEVO
│
├── components/                   # Componentes React
│   ├── dashboard/                # Dashboard components
│   ├── layout/                   # Layout (Header, UserMenu)
│   ├── simulations/              # Simulaciones
│   └── ui/                       # UI components (shadcn)
│
├── lib/                          # Lógica de negocio
│   ├── services/                 # ⭐ Servicios (capa de negocio)
│   │   ├── user.service.ts       # ✨ NUEVO
│   │   └── simulation.service.ts # ✨ NUEVO
│   ├── utils/                    # Utilidades
│   │   └── validation.ts         # ✨ NUEVO
│   ├── constants/                # Constantes
│   │   └── plans.ts              # ✨ NUEVO
│   ├── auth.ts                   # NextAuth config
│   └── prisma.ts                 # Prisma client
│
├── prisma/
│   ├── schema.prisma             # Schema de BD
│   └── migrations/               # Migraciones
│
└── hooks/                        # Custom React Hooks
    ├── useSimulations.ts
    └── useSimulationUsage.ts
```

### Patrones de Diseño

- **Service Layer Pattern**: Lógica de negocio en servicios reutilizables
- **Repository Pattern**: Abstracción de acceso a datos (preparado)
- **Factory Pattern**: Creación de objetos complejos (futuro)

📖 **Ver**: [ARQUITECTURA_ESCALABILIDAD.md](ARQUITECTURA_ESCALABILIDAD.md) para más detalles.

---

## 🗺️ Roadmap

### ✅ Fase 1: MVP (COMPLETADO)
- [x] Autenticación
- [x] 5 Simuladores
- [x] Sistema de planes
- [x] Dashboard
- [x] Gestión de simulaciones
- [x] Configuración de usuario
- [x] Servicios modulares

### 🚧 Fase 2: Consolidación (Próximos 3 meses)
- [ ] Integración con Stripe (pagos)
- [ ] Generación de PDFs
- [ ] Comparador de propiedades
- [ ] Analytics y métricas
- [ ] Tests unitarios y e2e

### 📅 Fase 3: Expansión (6-12 meses)
- [ ] Multi-propiedad
- [ ] CRM básico
- [ ] Integraciones con portales inmobiliarios
- [ ] API pública
- [ ] Panel de admin

### 🌟 Fase 4: Enterprise (12-24 meses)
- [ ] Multi-tenant
- [ ] White label
- [ ] Microservicios
- [ ] Sistema RBAC avanzado
- [ ] SSO (Single Sign-On)

---

## 📚 Documentación

- [Guía de Deployment Completa](GUIA_DEPLOYMENT_COMPLETA.md)
- [Arquitectura de Escalabilidad](ARQUITECTURA_ESCALABILIDAD.md)
- [Deploy Config](DEPLOY_CONFIG.md)
- [Comandos Rápidos](COMANDOS_RAPIDOS.txt)

---

## 🧪 Testing

```bash
# Tests unitarios (cuando estén implementados)
npm run test

# Tests e2e (cuando estén implementados)
npm run test:e2e

# Lighthouse (performance)
npm run lighthouse
```

---

## 🐛 Troubleshooting

### Error: "Tenant or user not found"
**Solución**: Verificar variables de entorno en Vercel y asegurarse de que las contraseñas estén URL-encoded.

### Error: "NextAuth session undefined"
**Solución**: Configurar `NEXTAUTH_SECRET` en variables de entorno.

📖 **Ver**: [GUIA_DEPLOYMENT_COMPLETA.md](GUIA_DEPLOYMENT_COMPLETA.md) para más soluciones.

---

## 🤝 Contribuir

1. Fork el proyecto
2. Crea una rama (`git checkout -b feature/nueva-funcionalidad`)
3. Commit cambios (`git commit -m 'Agregar nueva funcionalidad'`)
4. Push a la rama (`git push origin feature/nueva-funcionalidad`)
5. Abre un Pull Request

---

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver [LICENSE](LICENSE) para más detalles.

---

## 📞 Soporte

- **Email**: hola@tuhabity.com
- **Web**: https://tuhabity.com
- **GitHub**: https://github.com/fugitivos2/habity-web
- **Vercel**: https://vercel.com/fugitivos2s-projects/habity-web

---

## 🌟 Estado del Proyecto

```
🎉 MVP 100% COMPLETO
✅ Listo para producción
✅ Listo para usuarios reales
✅ Listo para escalamiento
```

**Último commit**: `1e7ff09` - "✨ Completar MVP al 100%"  
**Última actualización**: Diciembre 2024  
**Versión**: 1.0.0

---

**Desarrollado con ❤️ para tuHabity**
