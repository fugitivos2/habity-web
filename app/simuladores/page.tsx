import { Metadata } from 'next';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MortgageSimulator from '@/components/simulators/MortgageSimulator';
import PurchaseCostsSimulator from '@/components/simulators/PurchaseCostsSimulator';
import { Calculator, FileText, TrendingUp } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Simuladores Financieros | HABITY',
  description: 'Calcula tu hipoteca, gastos de compraventa y rentabilidad de inversión inmobiliaria',
};

export default function SimulatorsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-4 shadow-lg">
            <Calculator className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Simuladores Financieros
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Herramientas profesionales para tomar decisiones informadas sobre tu inversión inmobiliaria
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="mortgage" className="w-full">
          <TabsList className="grid w-full max-w-3xl mx-auto grid-cols-2 mb-8 h-auto p-1">
            <TabsTrigger
              value="mortgage"
              className="flex items-center gap-2 py-3 text-base data-[state=active]:bg-blue-500 data-[state=active]:text-white"
            >
              <TrendingUp className="w-5 h-5" />
              <span className="hidden sm:inline">Simulador de</span> Hipoteca
            </TabsTrigger>
            <TabsTrigger
              value="costs"
              className="flex items-center gap-2 py-3 text-base data-[state=active]:bg-green-500 data-[state=active]:text-white"
            >
              <FileText className="w-5 h-5" />
              <span className="hidden sm:inline">Gastos de</span> Compraventa
            </TabsTrigger>
          </TabsList>

          <TabsContent value="mortgage" className="mt-0">
            <MortgageSimulator />
          </TabsContent>

          <TabsContent value="costs" className="mt-0">
            <PurchaseCostsSimulator />
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <div className="mt-12 text-center text-sm text-gray-500">
          <p>
            Los resultados son orientativos y pueden variar según cada caso específico.
          </p>
          <p className="mt-1">
            Consulta con un profesional para obtener asesoramiento personalizado.
          </p>
        </div>
      </div>
    </div>
  );
}
