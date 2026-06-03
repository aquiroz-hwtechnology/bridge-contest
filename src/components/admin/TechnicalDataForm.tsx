import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { Save, Calculator, Check } from 'lucide-react';

export function TechnicalDataForm() {
  const { projects, updateProject, getProjectResults } = useStore();
  const [editData, setEditData] = useState<Record<string, Record<string, number | undefined>>>({});
  const [savedRows, setSavedRows] = useState<Set<string>>(new Set());

  const results = getProjectResults();

  const handleFieldChange = (projectId: string, field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value === '' ? undefined : Number(value),
      },
    }));
    setSavedRows((prev) => { const n = new Set(prev); n.delete(projectId); return n; });
  };

  const handleSave = (projectId: string) => {
    const data = editData[projectId];
    if (data) {
      updateProject(projectId, data);
      setEditData((prev) => { const u = { ...prev }; delete u[projectId]; return u; });
      setSavedRows((prev) => new Set(prev).add(projectId));
      setTimeout(() => setSavedRows((prev) => { const n = new Set(prev); n.delete(projectId); return n; }), 2000);
    }
  };

  const handleSaveAll = () => {
    Object.keys(editData).forEach((id) => {
      const data = editData[id];
      if (data && Object.keys(data).length > 0) {
        updateProject(id, data);
      }
    });
    setEditData({});
    setSavedRows(new Set(projects.map((p) => p.id)));
    setTimeout(() => setSavedRows(new Set()), 2000);
  };

  const getValue = (projectId: string, field: string, current: number | undefined) => {
    return editData[projectId]?.[field] !== undefined
      ? editData[projectId][field]
      : current;
  };

  const hasChanges = Object.keys(editData).some((id) => Object.keys(editData[id]).length > 0);

  // Get result for a project
  const getResult = (projectId: string) => results.find((r) => r.projectId === projectId);

  const inputClass = "w-full px-2 py-1.5 text-sm text-center border rounded-lg outline-none font-medium tabular-nums";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div className="flex items-center gap-3">
            <Calculator className="w-5 h-5" style={{ color: '#273475' }} />
            <div>
              <h3 className="text-lg font-bold text-gray-800">Datos Tecnicos - Tabla General</h3>
              <p className="text-xs text-gray-500">
                Edite directamente en la tabla. Los campos con fondo rojo son manuales, los grises se calculan automaticamente.
              </p>
            </div>
          </div>
          {hasChanges && (
            <Button size="sm" onClick={handleSaveAll}>
              <Save className="w-3.5 h-3.5" /> Guardar Todo
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {/* Formulas reference */}
        <div className="mb-3 flex flex-wrap gap-4 text-xs text-gray-500">
          <span><b className="text-red-700">Manual</b> = Ingreso directo</span>
          <span>Rel. C/P = Carga / Peso</span>
          <span>Pts(70%) = (Rel / Max) x 7</span>
          <span>Pts Video = (Video / Max) x 1</span>
        </div>

        <table className="w-full text-sm border-collapse">
          <thead>
            <tr>
              <th className="py-2 px-1 text-left text-xs font-bold text-gray-600 border-b-2" rowSpan={2}>Puente</th>
              <th className="py-1 px-1 text-center text-xs font-bold text-white rounded-t-md" style={{ backgroundColor: '#c0392b' }} colSpan={2}>
                ENTRADA MANUAL
              </th>
              <th className="py-1 px-1 text-center text-xs font-bold text-white rounded-t-md" style={{ backgroundColor: '#7f8c8d' }} colSpan={2}>
                CALCULADO
              </th>
              <th className="py-1 px-1 text-center text-xs font-bold text-white rounded-t-md" style={{ backgroundColor: '#d4a017' }}>
                MANUAL
              </th>
              <th className="py-1 px-1 text-center text-xs font-bold text-white rounded-t-md" style={{ backgroundColor: '#7f8c8d' }}>
                CALC.
              </th>
              <th className="py-1 px-1" rowSpan={2}></th>
            </tr>
            <tr className="border-b-2 border-gray-300">
              <th className="py-1.5 px-1 text-center text-xs font-semibold" style={{ backgroundColor: '#fde8e8', color: '#c0392b' }}>Peso (gr)</th>
              <th className="py-1.5 px-1 text-center text-xs font-semibold" style={{ backgroundColor: '#fde8e8', color: '#c0392b' }}>Carga (gr)</th>
              <th className="py-1.5 px-1 text-center text-xs font-semibold bg-gray-100 text-gray-600">Rel. C/P</th>
              <th className="py-1.5 px-1 text-center text-xs font-semibold bg-gray-100 text-gray-600">Pts (70%)</th>
              <th className="py-1.5 px-1 text-center text-xs font-semibold" style={{ backgroundColor: '#fef9e7', color: '#9a7d0a' }}>Video</th>
              <th className="py-1.5 px-1 text-center text-xs font-semibold bg-gray-100 text-gray-600">Pts (10%)</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => {
              const r = getResult(project.id);
              const isSaved = savedRows.has(project.id);
              const hasEdit = editData[project.id] && Object.keys(editData[project.id]).length > 0;

              return (
                <tr key={project.id} className={`border-b border-gray-100 ${hasEdit ? 'bg-amber-50/40' : ''} ${isSaved ? 'bg-green-50' : ''}`}>
                  {/* Project name */}
                  <td className="py-2 px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ color: '#273475', backgroundColor: '#273475' + '15' }}>
                        {project.code}
                      </span>
                      <span className="font-medium text-gray-800 text-xs whitespace-nowrap">{project.name}</span>
                    </div>
                  </td>
                  {/* Peso Propio - MANUAL */}
                  <td className="py-1 px-1" style={{ backgroundColor: '#fdf2f2' }}>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={getValue(project.id, 'ownWeight', project.ownWeight) ?? ''}
                      onChange={(e) => handleFieldChange(project.id, 'ownWeight', e.target.value)}
                      className={`${inputClass} border-red-200 focus:ring-2 focus:ring-red-300/50 bg-white w-20`}
                      placeholder="-"
                    />
                  </td>
                  {/* Carga Falla - MANUAL */}
                  <td className="py-1 px-1" style={{ backgroundColor: '#fdf2f2' }}>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={getValue(project.id, 'failureLoad', project.failureLoad) ?? ''}
                      onChange={(e) => handleFieldChange(project.id, 'failureLoad', e.target.value)}
                      className={`${inputClass} border-red-200 focus:ring-2 focus:ring-red-300/50 bg-white w-20`}
                      placeholder="-"
                    />
                  </td>
                  {/* Relacion - CALCULATED */}
                  <td className="py-1 px-1 text-center text-xs font-medium text-gray-600 bg-gray-50">
                    {r && r.loadWeightRatio > 0 ? r.loadWeightRatio.toFixed(1) : '-'}
                  </td>
                  {/* Puntos 70% - CALCULATED */}
                  <td className="py-1 px-1 text-center text-xs font-bold bg-gray-50" style={{ color: '#c0392b' }}>
                    {r && r.loadWeightRatio > 0 ? r.loadWeightPoints.toFixed(3) : '-'}
                  </td>
                  {/* Video - MANUAL */}
                  <td className="py-1 px-1" style={{ backgroundColor: '#fffdf0' }}>
                    <input
                      type="number"
                      step="1"
                      min="0"
                      value={getValue(project.id, 'videoScore', project.videoScore) ?? ''}
                      onChange={(e) => handleFieldChange(project.id, 'videoScore', e.target.value)}
                      className={`${inputClass} border-amber-200 focus:ring-2 focus:ring-amber-300/50 bg-white w-20`}
                      placeholder="-"
                    />
                  </td>
                  {/* Puntos Video - CALCULATED */}
                  <td className="py-1 px-1 text-center text-xs font-bold bg-gray-50" style={{ color: '#9a7d0a' }}>
                    {r && r.videoScore > 0 ? r.videoPoints.toFixed(2) : '-'}
                  </td>
                  {/* Save button */}
                  <td className="py-1 px-1 text-center">
                    {isSaved ? (
                      <Check className="w-4 h-4 text-green-500 mx-auto" />
                    ) : hasEdit ? (
                      <button
                        onClick={() => handleSave(project.id)}
                        className="p-1 rounded hover:bg-blue-100 transition-colors"
                        title="Guardar"
                      >
                        <Save className="w-3.5 h-3.5" style={{ color: '#273475' }} />
                      </button>
                    ) : null}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
