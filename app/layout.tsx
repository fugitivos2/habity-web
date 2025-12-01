import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'HABITY - Tu hogar en números | tuhabity.com',
  description: 'La plataforma integral que conecta compradores, vendedores, profesionales e inversores del sector inmobiliario con herramientas financieras avanzadas.',
  keywords: 'inmobiliaria, hipoteca, simulador, calculadora, inversión, ROI, gastos compra vivienda',
  authors: [{ name: 'HABITY' }],
  openGraph: {
    title: 'HABITY - Tu hogar en números',
    description: 'Plataforma integral inmobiliaria y financiera con simuladores inteligentes',
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
      <body>{children}</body>
    </html>
  )
}
