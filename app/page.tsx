'use client'

import Hero from '../components/Hero'
import Features from '../components/Features'
import HowItWorks from '../components/HowItWorks'
import Simulators from '../components/Simulators'
import Pricing from '../components/Pricing'
import CTA from '../components/CTA'
import FAQ from '../components/FAQ'
import Footer from '../components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      <Hero />
      <Features />
      <HowItWorks />
      <Simulators />
      <Pricing />
      <CTA />
      <FAQ />
      <Footer />
    </main>
  )
}
