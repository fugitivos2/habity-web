import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"
import { compare } from "bcryptjs"
import type { NextAuthOptions } from "next-auth"

// Extender tipos de NextAuth
declare module "next-auth" {
  interface Session {
    user: {
      id: string
      role: string
      emailVerified: Date | null
      isActive: boolean
      onboardingCompleted: boolean
      email: string
      name?: string | null
      image?: string | null
      subscription?: {
        plan: string
        status: string
        expiresAt: Date | null
      }
    }
  }

  interface User {
    id: string
    role: string
    emailVerified: Date | null
    isActive: boolean
    onboardingCompleted: boolean
    subscription?: {
      plan: string
      status: string
      expiresAt: Date | null
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
    emailVerified: Date | null
    isActive: boolean
    onboardingCompleted: boolean
    subscription?: {
      plan: string
      status: string
      expiresAt: Date | null
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 días
  },
  pages: {
    signIn: "/auth/login",
    signUp: "/auth/register",
    verifyRequest: "/auth/verify-email",
    error: "/auth/error",
  },
  providers: [
    // Proveedor de Google
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
      allowDangerousEmailAccountLinking: true,
    }),
    
    // Proveedor de credenciales (email/password)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Email y contraseña requeridos")
        }

        // Buscar usuario por email
        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email.toLowerCase()
          },
          include: {
            subscription: true,
          }
        })

        if (!user || !user.password) {
          throw new Error("Credenciales inválidas")
        }

        // Verificar si el usuario está activo
        if (!user.isActive) {
          throw new Error("Cuenta desactivada. Contacta soporte.")
        }

        // Verificar contraseña
        const isPasswordValid = await compare(credentials.password, user.password)
        
        if (!isPasswordValid) {
          throw new Error("Credenciales inválidas")
        }

        // Actualizar último login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLoginAt: new Date() }
        })

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          image: user.image,
          role: user.role,
          emailVerified: user.emailVerified,
          isActive: user.isActive,
          onboardingCompleted: user.onboardingCompleted,
          subscription: user.subscription ? {
            plan: user.subscription.plan,
            status: user.subscription.status,
            expiresAt: user.subscription.expiresAt,
          } : undefined,
        }
      }
    })
  ],
  callbacks: {
    async signIn({ user, account }) {
      // Permitir login con Google
      if (account?.provider === "google") {
        // Verificar si el usuario ya existe
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        if (existingUser && !existingUser.isActive) {
          return false // Cuenta desactivada
        }

        // Si no existe, se creará automáticamente por el adapter
        return true
      }

      return true
    },
    
    async jwt({ token, user, trigger }) {
      // Primera vez que se crea el token
      if (user) {
        token.id = user.id
        token.role = user.role
        token.emailVerified = user.emailVerified
        token.isActive = user.isActive
        token.onboardingCompleted = user.onboardingCompleted
        token.subscription = user.subscription
      }

      // Verificar si el usuario sigue activo en cada request
      if (token.id) {
        const dbUser = await prisma.user.findUnique({
          where: { id: token.id },
          include: { subscription: true }
        })

        if (!dbUser || !dbUser.isActive) {
          return {} as any // Forzar logout
        }

        // Actualizar datos del token si han cambiado
        token.role = dbUser.role
        token.emailVerified = dbUser.emailVerified
        token.isActive = dbUser.isActive
        token.onboardingCompleted = dbUser.onboardingCompleted
        token.subscription = dbUser.subscription ? {
          plan: dbUser.subscription.plan,
          status: dbUser.subscription.status,
          expiresAt: dbUser.subscription.expiresAt,
        } : undefined
      }

      return token
    },
    
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.emailVerified = token.emailVerified
        session.user.isActive = token.isActive
        session.user.onboardingCompleted = token.onboardingCompleted
        session.user.subscription = token.subscription
      }
      
      return session
    },
    
    async redirect({ url, baseUrl }) {
      // Redirect después del login
      if (url.startsWith("/")) return `${baseUrl}${url}`
      else if (new URL(url).origin === baseUrl) return url
      return `${baseUrl}/dashboard`
    }
  },
  events: {
    async signIn({ user, account, isNewUser }) {
      console.log(`✅ Login exitoso: ${user.email} via ${account?.provider}`)
      
      // Si es un usuario nuevo de Google, configurar valores por defecto
      if (isNewUser && account?.provider === "google") {
        await prisma.user.update({
          where: { id: user.id },
          data: {
            role: "USER",
            isActive: true,
            emailVerified: new Date(),
            onboardingCompleted: false,
          }
        })
      }
      
      // Log de auditoría
      if (user.id) {
        await prisma.auditLog.create({
          data: {
            userId: user.id,
            action: "LOGIN",
            details: {
              provider: account?.provider,
              ip: "unknown",
            }
          }
        }).catch(console.error)
      }
    },
  },
  debug: process.env.NODE_ENV === "development",
}

export default NextAuth(authOptions)