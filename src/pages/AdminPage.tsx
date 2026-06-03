import { useState } from 'react';
import { useStore } from '@/store/useStore';
import { AdminLogin } from '@/components/admin/AdminLogin';
import { ProjectManager } from '@/components/admin/ProjectManager';
import { TechnicalDataForm } from '@/components/admin/TechnicalDataForm';
import { ConfigPanel } from '@/components/admin/ConfigPanel';
import { KPICards } from '@/components/dashboard/KPICards';
import { ResultsTable } from '@/components/dashboard/ResultsTable';
import { ComparisonBarChart, CriteriaRadarChart, RankingChart } from '@/components/dashboard/Charts';
import { Button } from '@/components/ui/Button';
import {
  Shield,
  LayoutDashboard,
  FolderOpen,
  Wrench,
  Settings,
  LogOut,
  BarChart3,
} from 'lucide-react';

type Tab = 'dashboard' | 'projects' | 'technical' | 'charts' | 'config';

export function AdminPage() {
  const { isAdmin, logout } = useStore();
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');

  if (!isAdmin) {
    return <AdminLogin onSuccess={() => {}} />;
  }

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'projects' as Tab, label: 'Proyectos', icon: FolderOpen },
    { id: 'technical' as Tab, label: 'Datos Tecnicos', icon: Wrench },
    { id: 'charts' as Tab, label: 'Graficos', icon: BarChart3 },
    { id: 'config' as Tab, label: 'Configuracion', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="text-white py-4 px-4 sticky top-0 z-40" style={{ backgroundColor: '#1a2456' }}>
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/bridge-contest/images/unipaz-identidad.svg"
              alt="UNIPAZ"
              className="h-9 brightness-0 invert hidden sm:block"
            />
            <div className="hidden sm:block unipaz-separator bg-white/25 h-7"></div>
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-indigo-300" />
              <div>
                <h1 className="text-base font-bold">Panel Administrativo</h1>
                <p className="text-indigo-400 text-xs">Primer Concurso de Puentes &bull; IAS UNIPAZ</p>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" className="text-gray-300 hover:text-white hover:bg-white/10" onClick={logout}>
            <LogOut className="w-4 h-4" /> Salir
          </Button>
        </div>
      </header>

      {/* Tabs */}
      <nav className="bg-white border-b border-gray-200 sticky top-[60px] z-30">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex overflow-x-auto gap-1 -mb-px">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-[#273475] text-[#273475]'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            <KPICards />
            <ResultsTable />
          </div>
        )}

        {activeTab === 'projects' && <ProjectManager />}

        {activeTab === 'technical' && <TechnicalDataForm />}

        {activeTab === 'charts' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <ComparisonBarChart />
              <CriteriaRadarChart />
            </div>
            <RankingChart />
          </div>
        )}

        {activeTab === 'config' && <ConfigPanel />}
      </main>
    </div>
  );
}
