import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { ScoreSlider } from '@/components/ui/ScoreSlider';
import { Modal } from '@/components/ui/Modal';
import type { BridgeProject } from '@/types';
import { useStore } from '@/store/useStore';
import { checkIfVoted } from '@/lib/firebaseService';
import { CheckCircle, PlayCircle, FileText, AlertTriangle, Loader2 } from 'lucide-react';

interface VotingCardProps {
  project: BridgeProject;
  judgeId: string;
}

export function VotingCard({ project, judgeId }: VotingCardProps) {
  const { addVote, votes } = useStore();
  const [aestheticScore, setAestheticScore] = useState(5);
  const [technicalSheetScore, setTechnicalSheetScore] = useState(5);
  const [showConfirm, setShowConfirm] = useState(false);
  const [voted, setVoted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(true);

  // Check if already voted on mount AND when votes change (real-time)
  useEffect(() => {
    // Check local state first (fast)
    const localVoted = votes.some((v) => v.judgeId === judgeId && v.projectId === project.id);
    if (localVoted) {
      setVoted(true);
      setChecking(false);
      return;
    }

    // Then verify against Firebase (authoritative)
    checkIfVoted(judgeId, project.id).then((exists) => {
      setVoted(exists);
      setChecking(false);
    }).catch(() => {
      setChecking(false);
    });
  }, [judgeId, project.id, votes]);

  const handleSubmit = async () => {
    setSubmitting(true);
    setError('');

    try {
      // Double-check in Firebase before saving
      const alreadyVoted = await checkIfVoted(judgeId, project.id);
      if (alreadyVoted) {
        setVoted(true);
        setError('Ya registraste tu voto para este puente.');
        setSubmitting(false);
        return;
      }

      const judgeData = JSON.parse(localStorage.getItem('judge_info') || '{}');
      await addVote({
        id: `${judgeId}__${project.id}`, // ID determinista
        projectId: project.id,
        judgeId,
        judgeName: judgeData.name || 'Anonimo',
        judgeOrganization: judgeData.organization || 'Sin organizacion',
        judgeType: judgeData.type || 'empresarial',
        aestheticScore,
        technicalSheetScore,
        timestamp: new Date().toISOString(),
      });
      setVoted(true);
      setShowConfirm(false);
    } catch (e) {
      setError('Error al enviar el voto. Intente de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (checking) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center py-8 gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-gray-400" />
          <p className="text-sm text-gray-500">Verificando...</p>
        </CardContent>
      </Card>
    );
  }

  if (voted) {
    return (
      <Card className="border-green-200 bg-green-50">
        <CardContent className="flex flex-col items-center py-8 gap-3">
          <CheckCircle className="w-12 h-12 text-green-500" />
          <h3 className="font-bold text-green-700">{project.name}</h3>
          <p className="text-sm text-green-600">Voto registrado exitosamente</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card hover className="animate-fade-in">
        <div className="relative">
          <img
            src={project.imageUrl}
            alt={project.name}
            className="w-full h-48 object-cover bg-gray-100"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,' + encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 200"><rect fill="%23e2e8f0" width="400" height="200"/><text x="50%" y="50%" text-anchor="middle" fill="%2394a3b8" font-size="20">Puente</text></svg>');
            }}
          />
          <div className="absolute top-3 right-3 text-white px-3 py-1 rounded-full text-xs font-bold" style={{ backgroundColor: '#273475' }}>
            {project.code}
          </div>
        </div>

        <CardContent className="space-y-5">
          <div>
            <h3 className="text-lg font-bold text-gray-800">{project.name}</h3>
            <p className="text-sm text-gray-500">{project.teamName}</p>
          </div>

          {project.videoUrl && (
            <a href={project.videoUrl} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#273475] hover:text-[#1a2456]">
              <PlayCircle className="w-4 h-4" /> Ver video del proyecto
            </a>
          )}

          {project.technicalSheet && (
            <a href={project.technicalSheet} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-[#273475] hover:text-[#1a2456]">
              <FileText className="w-4 h-4" /> Ver ficha tecnica
            </a>
          )}

          <div className="space-y-6 pt-4 border-t border-gray-100">
            <ScoreSlider label="Estetica del Puente (10%)" value={aestheticScore} onChange={setAestheticScore} />
            <ScoreSlider label="Ficha Tecnica (10%)" value={technicalSheetScore} onChange={setTechnicalSheetScore} />
          </div>

          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 rounded-lg text-sm text-red-700">
              <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
            </div>
          )}

          <Button variant="primary" size="lg" className="w-full" onClick={() => setShowConfirm(true)}>
            Enviar Calificacion
          </Button>
        </CardContent>
      </Card>

      <Modal isOpen={showConfirm} onClose={() => setShowConfirm(false)} title="Confirmar Calificacion" size="sm">
        <div className="space-y-4">
          <div className="rounded-xl p-4" style={{ backgroundColor: '#273475' + '0d' }}>
            <h4 className="font-bold text-gray-800">{project.name}</h4>
            <p className="text-sm text-gray-600 mt-1">{project.teamName}</p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Estetica:</span>
              <span className="font-bold text-lg">{aestheticScore}/10</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b border-gray-100">
              <span className="text-gray-600">Ficha Tecnica:</span>
              <span className="font-bold text-lg">{technicalSheetScore}/10</span>
            </div>
          </div>

          <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
            Solo puede votar una vez por puente. Esta accion no se puede deshacer.
          </p>

          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowConfirm(false)} disabled={submitting}>
              Cancelar
            </Button>
            <Button variant="primary" className="flex-1" onClick={handleSubmit} loading={submitting} disabled={submitting}>
              Confirmar Voto
            </Button>
          </div>
        </div>
      </Modal>
    </>
  );
}
