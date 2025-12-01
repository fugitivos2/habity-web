import type { Metadata } from 'next'
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
      <body>{children}</body>
    </html>
  )
}
