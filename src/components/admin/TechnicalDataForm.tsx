import { useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useStore } from '@/store/useStore';
import { Save, Calculator, Check, AlertCircle } from 'lucide-react';

export function TechnicalDataForm() {
  const { projects, updateProject, getProjectResults } = useStore();
  const [editData, setEditData] = useState<Record<string, Record<string, number | undefined>>>({});
  const [savedRows, setSavedRows] = useState<Set<string>>(new Set());
  const [errorMsg, setErrorMsg] = useState('');

  const results = getProjectResults();

  const handleFieldChange = (projectId: string, field: string, value: string) => {
    setEditData((prev) => ({
      ...prev,
      [projectId]: {
        ...prev[projectId],
        [field]: value === '' ? undefined : Number(value),
      },
    }));
    // Remove saved indicator when editing again
    setSavedRows((prev) => { const n = new Set(prev); n.delete(projectId); return n; });
    setErrorMsg('');
  };

  const handleSaveRow = (projectId: string) => {
    const data = editData[projectId];
    if (!data || Object.keys(data).length === 0) return;

    // Filter out undefined values to avoid overwriting with undefined
    const cleanData: Record<string, number> = {};
    for (const [key, val] of Object.entries(data)) {
      if (val !== undefined && !isNaN(val)) {
        cleanData[key] = val;
      }
    }

    if (Object.keys(cleanData).length === 0) return;

    console.log('[SAVE] Saving project', projectId, cleanData);

    // Call store update
    updateProject(projectId, cleanData);

    // Verify it saved by reading back from store
    const updated = useStore.getState().projects.find((p) => p.id === projectId);
    console.log('[SAVE] Verified stored value:', updated);

    // Clear edit data for this row
    setEditData((prev) => {
      const copy = { ...prev };
      delete copy[projectId];
      return copy;
    });

    // Show saved indicator
    setSavedRows((prev) => new Set(prev).add(projectId));
    setTimeout(() => {
      setSavedRows((prev) => { const n = new Set(prev); n.delete(projectId); return n; });
    }, 3000);
  };

  const handleSaveAll = () => {
    const projectIds = Object.keys(editData).filter(
      (id) => editData[id] && Object.keys(editData[id]).length > 0
    );

    if (projectIds.length === 0) return;

    projectIds.forEach((id) => handleSaveRow(id));
  };

  // Get displayed value: edit buffer first, then stored value
  const getDisplayValue = (projectId: string, field: string, storedValue: number | undefined): string => {
    if (editData[projectId]?.[field] !== undefined) {
      return String(editData[projectId][field]);
    }
    return storedValue !== undefined ? String(storedValue) : '';
  };

  const hasChanges = Object.keys(editData).some(
    (id) => editData[id] && Object.keys(editData[id]).length > 0
  );

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
                Edite los campos y presione el boton <Save className="w-3 h-3 inline" /> de cada fila para guardar.
                Los cambios se sincronizan automaticamente con el dashboard (incluso en otra pestana).
              </p>
            </div>
          </div>
          {hasChanges && (
            <Button size="sm" onClick={handleSaveAll}>
              <Save className="w-3.5 h-3.5" /> Guardar Todo ({Object.keys(editData).filter(id => editData[id] && Object.keys(editData[id]).length > 0).length})
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {/* Status bar */}
        {hasChanges && (
          <div className="mb-3 p-2 bg-amber-50 border border-amber-200 rounded-lg flex items-center gap-2 text-xs text-amber-700">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Hay cambios sin guardar. Presione <b>Guardar</b> en cada fila o <b>Guardar Todo</b>.</span>
          </div>
        )}

        {errorMsg && (
          <div className="mb-3 p-2 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700">
            {errorMsg}
          </div>
        )}

        {/* Formulas reference */}
        <div className="mb-3 flex flex-wrap gap-4 text-xs text-gray-500">
          <span><b className="text-red-700">Rojo</b> = Entrada manual</span>
          <span><b className="text-amber-700">Amarillo</b> = Video manual</span>
          <span><b className="text-gray-500">Gris</b> = Calculado</span>
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
              <th className="py-1 px-1 text-center text-xs font-bold text-gray-600 border-b-2" rowSpan={2} style={{ width: '70px' }}>Accion</th>
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
              const rowHasEdits = editData[project.id] && Object.keys(editData[project.id]).length > 0;

              return (
                <tr
                  key={project.id}
                  className={`border-b border-gray-100 transition-all duration-300 ${
                    isSaved ? 'bg-green-50 border-green-200' : rowHasEdits ? 'bg-amber-50/50 border-amber-200' : 'hover:bg-gray-50/50'
                  }`}
                >
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
                      value={getDisplayValue(project.id, 'ownWeight', project.ownWeight)}
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
                      value={getDisplayValue(project.id, 'failureLoad', project.failureLoad)}
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
                      value={getDisplayValue(project.id, 'videoScore', project.videoScore)}
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
                      <span className="inline-flex items-center gap-1 text-green-600 text-xs font-bold">
                        <Check className="w-4 h-4" /> OK
                      </span>
                    ) : rowHasEdits ? (
                      <button
                        onClick={() => handleSaveRow(project.id)}
                        className="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-white text-xs font-bold transition-colors hover:opacity-90"
                        style={{ backgroundColor: '#273475' }}
                        title="Guardar cambios"
                      >
                        <Save className="w-3 h-3" /> Guardar
                      </button>
                    ) : (
                      <span className="text-gray-300 text-xs">-</span>
                    )}
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
