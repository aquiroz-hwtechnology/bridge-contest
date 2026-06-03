import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { Save, ChevronDown, ChevronUp, Calculator } from 'lucide-react';

export function TechnicalDataForm() {
  const { projects, updateProject } = useStore();
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Record<string, any>>({});

  const handleFieldChange = (projectId: string, field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value === '' ? undefined : Number(value),
      },
    }));
  };

  const handleSave = (projectId: string) => {
    const data = editData[projectId];
    if (data) {
      updateProject(projectId, data);
      setEditData((prev) => {
        const updated = { ...prev };
        delete updated[projectId];
        return updated;
      });
    }
  };

  // Preview calculated values
  const getPreview = (projectId: string) => {
    const project = projects.find((p) => p.id === projectId);
    if (!project) return null;

    const ownWeight = editData[projectId]?.ownWeight ?? project.ownWeight;
    const failureLoad = editData[projectId]?.failureLoad ?? project.failureLoad;

    if (ownWeight && ownWeight > 0 && failureLoad) {
      const ratio = failureLoad / ownWeight;
      return { ratio: ratio.toFixed(2) };
    }
    return null;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Calculator className="w-5 h-5" style={{ color: '#273475' }} />
          <div>
            <h3 className="text-lg font-bold text-gray-800">Datos Tecnicos de Proyectos</h3>
            <p className="text-sm text-gray-500">
              Ingrese manualmente: Peso Propio, Carga de Falla y Votacion del Video.
              La relacion carga/peso y los puntos se calculan automaticamente.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Legend */}
        <div className="mb-4 p-3 bg-gray-50 rounded-xl text-xs text-gray-600 space-y-1">
          <p><span className="font-bold text-red-700">Rojo:</span> Campos de entrada manual</p>
          <p><span className="font-bold text-gray-500">Gris:</span> Valores calculados automaticamente</p>
          <p className="mt-2 font-medium">Formulas:</p>
          <p>RELACION C/P = Carga de Falla / Peso Propio</p>
          <p>PUNTOS (70%) = (Relacion / MAX_Relacion) x 7</p>
          <p>PUNTOS Video (10%) = (Video / MAX_Video) x 1</p>
        </div>

        <div className="space-y-2">
          {projects.map((project) => {
            const preview = getPreview(project.id);

            return (
              <div key={project.id} className="border border-gray-100 rounded-xl overflow-hidden">
                <button
                  onClick={() => setExpandedId(expandedId === project.id ? null : project.id)}
                  className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold px-2 py-1 rounded" style={{ color: '#273475', backgroundColor: '#273475' + '15' }}>
                      {project.code}
                    </span>
                    <span className="font-medium text-gray-800">{project.name}</span>
                    {/* Status indicators */}
                    <div className="flex gap-1">
                      {project.ownWeight && project.failureLoad ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Carga OK</span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">Sin datos carga</span>
                      )}
                      {project.videoScore ? (
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">Video OK</span>
                      ) : (
                        <span className="text-xs bg-yellow-100 text-yellow-700 px-2 py-0.5 rounded-full">Sin video</span>
                      )}
                    </div>
                  </div>
                  {expandedId === project.id ? (
                    <ChevronUp className="w-4 h-4 text-gray-400" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400" />
                  )}
                </button>

                {expandedId === project.id && (
                  <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
                    {/* Manual inputs - RED background */}
                    <div>
                      <p className="text-xs font-bold text-red-700 mb-2 uppercase tracking-wide">Campos Manuales</p>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                        <div className="p-3 rounded-lg border-2 border-red-200 bg-red-50/50">
                          <label className="block text-xs font-semibold text-red-800 mb-1">
                            Peso Propio del Puente (gr)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={
                              editData[project.id]?.ownWeight !== undefined
                                ? editData[project.id].ownWeight
                                : project.ownWeight ?? ''
                            }
                            onChange={(e) => handleFieldChange(project.id, 'ownWeight', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400/40 outline-none bg-white font-medium"
                            placeholder="Ej: 1"
                          />
                        </div>
                        <div className="p-3 rounded-lg border-2 border-red-200 bg-red-50/50">
                          <label className="block text-xs font-semibold text-red-800 mb-1">
                            Carga de Falla (gr)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={
                              editData[project.id]?.failureLoad !== undefined
                                ? editData[project.id].failureLoad
                                : project.failureLoad ?? ''
                            }
                            onChange={(e) => handleFieldChange(project.id, 'failureLoad', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-red-200 rounded-lg focus:ring-2 focus:ring-red-400/40 outline-none bg-white font-medium"
                            placeholder="Ej: 400"
                          />
                        </div>
                        <div className="p-3 rounded-lg border-2 border-amber-300 bg-amber-50/50">
                          <label className="block text-xs font-semibold text-amber-800 mb-1">
                            Votacion del Video
                          </label>
                          <input
                            type="number"
                            step="1"
                            min="0"
                            value={
                              editData[project.id]?.videoScore !== undefined
                                ? editData[project.id].videoScore
                                : project.videoScore ?? ''
                            }
                            onChange={(e) => handleFieldChange(project.id, 'videoScore', e.target.value)}
                            className="w-full px-3 py-2 text-sm border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-400/40 outline-none bg-white font-medium"
                            placeholder="Ej: 5200"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Calculated preview */}
                    {preview && (
                      <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
                        <p className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-wide">Vista Previa - Valores Calculados</p>
                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <span className="text-xs text-gray-500">Relacion Carga/Peso:</span>
                            <p className="font-bold text-gray-800">{preview.ratio}</p>
                          </div>
                          <div>
                            <span className="text-xs text-gray-500">Los puntos se calculan al guardar</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Current values summary */}
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <span className="text-gray-500 block">Peso actual</span>
                        <span className="font-bold text-gray-700">{project.ownWeight ?? '-'} gr</span>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <span className="text-gray-500 block">Carga actual</span>
                        <span className="font-bold text-gray-700">{project.failureLoad ?? '-'} gr</span>
                      </div>
                      <div className="p-2 bg-gray-50 rounded text-center">
                        <span className="text-gray-500 block">Video actual</span>
                        <span className="font-bold text-gray-700">{project.videoScore?.toLocaleString() ?? '-'}</span>
                      </div>
                    </div>

                    <div className="flex justify-end pt-2">
                      <Button size="sm" onClick={() => handleSave(project.id)}>
                        <Save className="w-3 h-3" /> Guardar Datos
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
