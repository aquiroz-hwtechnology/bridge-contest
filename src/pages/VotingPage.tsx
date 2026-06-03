import { useState, useEffect } from 'react';
import { useStore } from '@/store/useStore';
import { VotingCard } from '@/components/voting/VotingCard';
import { JudgeRegistration } from '@/components/voting/JudgeRegistration';
import { CheckCircle2 } from 'lucide-react';

interface VotingPageProps {
  projectId?: string;
}

export function VotingPage({ projectId }: VotingPageProps) {
  const { projects } = useStore();
  const [judgeId, setJudgeId] = useState<string | null>(null);

  useEffect(() => {
    const storedId = localStorage.getItem('judge_id');
    if (storedId) setJudgeId(storedId);
  }, []);

  if (!judgeId) {
    return <JudgeRegistration onRegister={setJudgeId} />;
  }

  const projectsToShow = projectId
    ? projects.filter((p) => p.id === projectId)
    : projects;

  if (projectId && projectsToShow.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="text-center">
          <p className="text-gray-500 text-lg">Proyecto no encontrado</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="gradient-hero text-white py-4 px-4 sticky top-0 z-40 shadow-lg">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src="/bridge-contest/images/unipaz-identidad.svg"
              alt="UNIPAZ"
              className="h-10 brightness-0 invert"
            />
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold leading-tight">Primer Concurso de Puentes</h1>
              <p className="text-indigo-300 text-xs">Tec. Obras Civiles e Ing. Civil &bull; IAS UNIPAZ</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-xs bg-white/10 px-3 py-1.5 rounded-full">
            <CheckCircle2 className="w-3.5 h-3.5 text-green-400" />
            <span>Evaluador activo</span>
          </div>
        </div>
      </header>

      {/* Projects Grid */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {!projectId && (
          <div className="mb-8 text-center">
            <h2 className="text-2xl font-bold text-gray-800">Evaluar Prototipos</h2>
            <p className="text-gray-500 mt-1">
              Califique cada puente en los criterios de estetica y ficha tecnica
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projectsToShow.map((project) => (
            <VotingCard key={project.id} project={project} judgeId={judgeId} />
          ))}
        </div>
      </main>
    </div>
  );
}
