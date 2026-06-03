import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { useStore } from '@/store/useStore';
import { Trash2, AlertTriangle, User, Building2, Clock } from 'lucide-react';

export function VoteManager() {
  const { votes, projects, deleteVote, deleteVotesForProject, resetVotes } = useStore();
  const [filterProject, setFilterProject] = useState<string>('all');
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [bulkDeleteProject, setBulkDeleteProject] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const filteredVotes = filterProject === 'all'
    ? votes
    : votes.filter((v) => v.projectId === filterProject);

  const getProjectName = (projectId: string) =>
    projects.find((p) => p.id === projectId)?.name || projectId;

  const handleDeleteVote = async (voteId: string) => {
    await deleteVote(voteId);
    setDeleteConfirm(null);
  };

  const handleBulkDelete = async (projectId: string) => {
    await deleteVotesForProject(projectId);
    setBulkDeleteProject(null);
  };

  // Group votes by project for summary
  const voteSummary = projects.map((p) => ({
    id: p.id,
    name: p.name,
    code: p.code,
    count: votes.filter((v) => v.projectId === p.id).length,
  })).filter((s) => s.count > 0);

  return (
    <div className="space-y-6">
      {/* Summary */}
      <Card>
        <CardHeader>
          <h3 className="text-lg font-bold text-gray-800">Resumen de Votos por Proyecto</h3>
          <p className="text-sm text-gray-500">Total: {votes.length} votos de {new Set(votes.map((v) => v.judgeId)).size} evaluadores</p>
        </CardHeader>
        <CardContent>
          {voteSummary.length === 0 ? (
            <p className="text-gray-400 text-center py-4">No hay votos registrados</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
              {voteSummary.map((s) => (
                <div key={s.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                  <div>
                    <span className="text-xs font-bold px-1.5 py-0.5 rounded mr-2" style={{ color: '#273475', backgroundColor: '#273475' + '15' }}>
                      {s.code}
                    </span>
                    <span className="text-sm font-medium text-gray-700">{s.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-bold" style={{ color: '#273475' }}>{s.count}</span>
                    <button
                      onClick={() => setBulkDeleteProject(s.id)}
                      className="p-1 hover:bg-red-100 rounded text-red-500 transition-colors"
                      title="Eliminar todos los votos de este proyecto"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed vote list */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between flex-wrap gap-3">
          <h3 className="text-lg font-bold text-gray-800">Registro de Votos</h3>
          <div className="flex items-center gap-3">
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg outline-none"
            >
              <option value="all">Todos los proyectos</option>
              {projects.map((p) => (
                <option key={p.id} value={p.id}>{p.code} - {p.name}</option>
              ))}
            </select>
            {votes.length > 0 && (
              <Button variant="danger" size="sm" onClick={() => setShowResetConfirm(true)}>
                <AlertTriangle className="w-3.5 h-3.5" /> Borrar Todos
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          {filteredVotes.length === 0 ? (
            <p className="text-gray-400 text-center py-8">No hay votos {filterProject !== 'all' ? 'para este proyecto' : 'registrados'}</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-gray-200">
                    <th className="py-2 px-2 text-left text-xs font-semibold text-gray-600">Evaluador</th>
                    <th className="py-2 px-2 text-left text-xs font-semibold text-gray-600">Organizacion</th>
                    <th className="py-2 px-2 text-left text-xs font-semibold text-gray-600">Proyecto</th>
                    <th className="py-2 px-2 text-center text-xs font-semibold text-gray-600">Estetica</th>
                    <th className="py-2 px-2 text-center text-xs font-semibold text-gray-600">Ficha</th>
                    <th className="py-2 px-2 text-left text-xs font-semibold text-gray-600">Fecha/Hora</th>
                    <th className="py-2 px-2 text-center text-xs font-semibold text-gray-600">Accion</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredVotes
                    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
                    .map((vote) => (
                    <tr key={vote.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-gray-400" />
                          <span className="font-medium text-gray-800">{vote.judgeName}</span>
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-1.5">
                          <Building2 className="w-3.5 h-3.5 text-gray-400" />
                          <span className="text-gray-600 text-xs">{vote.judgeOrganization}</span>
                        </div>
                      </td>
                      <td className="py-2 px-2">
                        <span className="text-xs font-medium text-gray-700">{getProjectName(vote.projectId)}</span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className="font-bold" style={{ color: '#2980b9' }}>{vote.aestheticScore}</span>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <span className="font-bold" style={{ color: '#009738' }}>{vote.technicalSheetScore}</span>
                      </td>
                      <td className="py-2 px-2">
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="w-3 h-3" />
                          {new Date(vote.timestamp).toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' })}
                        </div>
                      </td>
                      <td className="py-2 px-2 text-center">
                        <button
                          onClick={() => setDeleteConfirm(vote.id)}
                          className="p-1.5 hover:bg-red-100 rounded-lg text-red-500 transition-colors"
                          title="Eliminar voto"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Delete single vote confirm */}
      <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Eliminar Voto" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600">Esta seguro de eliminar este voto? Esta accion no se puede deshacer.</p>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setDeleteConfirm(null)}>Cancelar</Button>
            <Button variant="danger" className="flex-1" onClick={() => deleteConfirm && handleDeleteVote(deleteConfirm)}>Eliminar</Button>
          </div>
        </div>
      </Modal>

      {/* Delete project votes confirm */}
      <Modal isOpen={!!bulkDeleteProject} onClose={() => setBulkDeleteProject(null)} title="Eliminar Votos del Proyecto" size="sm">
        <div className="space-y-4">
          <p className="text-gray-600">
            Se eliminaran <b>todos los votos</b> del proyecto <b>{bulkDeleteProject && getProjectName(bulkDeleteProject)}</b>.
            Esta accion no se puede deshacer.
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setBulkDeleteProject(null)}>Cancelar</Button>
            <Button variant="danger" className="flex-1" onClick={() => bulkDeleteProject && handleBulkDelete(bulkDeleteProject)}>Eliminar Todos</Button>
          </div>
        </div>
      </Modal>

      {/* Reset all votes confirm */}
      <Modal isOpen={showResetConfirm} onClose={() => setShowResetConfirm(false)} title="Eliminar TODOS los Votos" size="sm">
        <div className="space-y-4">
          <div className="p-3 bg-red-50 rounded-lg text-sm text-red-700">
            <p className="font-bold">ATENCION: Se eliminaran los {votes.length} votos registrados.</p>
            <p className="mt-1">Esta accion es irreversible.</p>
          </div>
          <div className="flex gap-3">
            <Button variant="ghost" className="flex-1" onClick={() => setShowResetConfirm(false)}>Cancelar</Button>
            <Button variant="danger" className="flex-1" onClick={async () => { await resetVotes(); setShowResetConfirm(false); }}>Eliminar Todo</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
