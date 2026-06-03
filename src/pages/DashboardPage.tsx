import { useStore } from '@/store/useStore';
import { KPICards } from '@/components/dashboard/KPICards';
import { ResultsTable } from '@/components/dashboard/ResultsTable';
import { BarChart3, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { useState, useEffect } from 'react';

export function DashboardPage() {
  const { votes } = useStore();
  const [lastUpdate, setLastUpdate] = useState(new Date());

  useEffect(() => {
    setLastUpdate(new Date());
  }, [votes.length]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="gradient-hero text-white py-6 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img
                src="/bridge-contest/images/unipaz-identidad.svg"
                alt="UNIPAZ"
                className="h-12 brightness-0 invert hidden sm:block"
              />
              <div className="hidden sm:block unipaz-separator bg-white/30 h-8"></div>
              <div>
                <h1 className="text-lg md:text-xl font-bold">Resultados en Tiempo Real</h1>
                <p className="text-indigo-300 text-xs md:text-sm">Primer Concurso de Puentes &bull; IAS UNIPAZ 2026</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right text-xs">
                <p className="text-indigo-300">Ultima actualizacion</p>
                <p className="font-medium">{lastUpdate.toLocaleTimeString('es-CO')}</p>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:bg-white/10"
                onClick={() => setLastUpdate(new Date())}
              >
                <RefreshCw className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* KPIs */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="w-5 h-5" style={{ color: '#273475' }} />
            <h2 className="text-lg font-bold text-gray-800">Indicadores Clave</h2>
          </div>
          <KPICards />
        </section>

        {/* Results Table */}
        <ResultsTable />
      </main>
    </div>
  );
}
