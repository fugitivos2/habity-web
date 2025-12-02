import type { Metadata } from 'next'
import { SessionProvider } from 'next-auth/react'
import { Toaster } from 'react-hot-toast'
import './globals.css'

export const metadata: Metadata = {
  title: 'HABITY - Los números hablan, tú decides | tuhabity.com',
  description: 'Tu hogar en números. Plataforma integral que conecta compradores, vendedores, profesionales e inversores del sector inmobiliario con herramientas financieras avanzadas. Ahorra tiempo y toma decisiones informadas.',
  keywords: 'inmobiliaria, hipoteca, simulador, calculadora, inversión, ROI, gastos compra vivienda, ahorro tiempo',
  authors: [{ name: 'HABITY' }],
  openGraph: {
    title: 'HABITY - Los números hablan, tú decides',
    description: 'Tu hogar en números. Plataforma integral inmobiliaria y financiera con simuladores inteligentes',
    type: 'website',
    locale: 'es_ES',
    url: 'https://tuhabity.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>
        <SessionProvider>
          {children}
          <Toaster 
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#363636',
                color: '#fff',
              },
              success: {
                duration: 3000,
                iconTheme: {
                  primary: '#4ade80',
                  secondary: '#fff',
                },
              },
              error: {
                duration: 5000,
                iconTheme: {
                  primary: '#ef4444',
                  secondary: '#fff',
                },
              },
            }}
          />
        </SessionProvider>
      </body>
    </html>
  )
}