import { useRef, useState } from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import { Calculator, Check } from 'lucide-react';

export function TechnicalDataForm() {
  const { projects, updateProject, getProjectResults } = useStore();
  const [savedRows, setSavedRows] = useState<Set<string>>(new Set());
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({});

  const results = getProjectResults();

  // Save DIRECTLY to the store on every change (with tiny debounce for typing)
  const handleChange = (projectId: string, field: string, value: string) => {
    const key = `${projectId}_${field}`;

    // Clear previous timer for this field
    if (debounceTimers.current[key]) {
      clearTimeout(debounceTimers.current[key]);
    }

    // Save after 300ms of no typing
    debounceTimers.current[key] = setTimeout(() => {
      const numValue = value === '' ? undefined : Number(value);
      updateProject(projectId, { [field]: numValue });

      // Show saved indicator
      setSavedRows((prev) => new Set(prev).add(projectId));
      setTimeout(() => {
        setSavedRows((prev) => { const n = new Set(prev); n.delete(projectId); return n; });
      }, 1500);
    }, 300);
  };

  const getResult = (projectId: string) => results.find((r) => r.projectId === projectId);

  const inputClass = "w-full px-2 py-1.5 text-sm text-center border rounded-lg outline-none font-medium tabular-nums";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-3">
          <Calculator className="w-5 h-5" style={{ color: '#273475' }} />
          <div>
            <h3 className="text-lg font-bold text-gray-800">Datos Tecnicos - Tabla General</h3>
            <p className="text-xs text-gray-500">
              Edite directamente en la tabla. <b>Los cambios se guardan automaticamente</b> y se reflejan al instante en el dashboard.
            </p>
          </div>
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        {/* Formulas reference */}
        <div className="mb-3 p-2 bg-green-50 border border-green-200 rounded-lg flex flex-wrap gap-4 text-xs text-gray-600">
          <span className="text-green-700 font-bold">Guardado automatico</span>
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
              <th className="py-1 px-1" rowSpan={2} style={{ width: '30px' }}></th>
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

              return (
                <tr key={project.id} className={`border-b border-gray-100 transition-colors ${isSaved ? 'bg-green-50' : 'hover:bg-gray-50/50'}`}>
                  {/* Project name */}
                  <td className="py-2 px-1">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0" style={{ color: '#273475', backgroundColor: '#273475' + '15' }}>
                        {project.code}
                      </span>
                      <span className="font-medium text-gray-800 text-xs whitespace-nowrap">{project.name}</span>
                    </div>
                  </td>
                  {/* Peso Propio - MANUAL - writes directly to store */}
                  <td className="py-1 px-1" style={{ backgroundColor: '#fdf2f2' }}>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      defaultValue={project.ownWeight ?? ''}
                      onChange={(e) => handleChange(project.id, 'ownWeight', e.target.value)}
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
                      defaultValue={project.failureLoad ?? ''}
                      onChange={(e) => handleChange(project.id, 'failureLoad', e.target.value)}
                      className={`${inputClass} border-red-200 focus:ring-2 focus:ring-red-300/50 bg-white w-20`}
                      placeholder="-"
                    />
                  </td>
                  {/* Relacion - CALCULATED (live from store) */}
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
                      defaultValue={project.videoScore ?? ''}
                      onChange={(e) => handleChange(project.id, 'videoScore', e.target.value)}
                      className={`${inputClass} border-amber-200 focus:ring-2 focus:ring-amber-300/50 bg-white w-20`}
                      placeholder="-"
                    />
                  </td>
                  {/* Puntos Video - CALCULATED */}
                  <td className="py-1 px-1 text-center text-xs font-bold bg-gray-50" style={{ color: '#9a7d0a' }}>
                    {r && r.videoScore > 0 ? r.videoPoints.toFixed(2) : '-'}
                  </td>
                  {/* Saved indicator */}
                  <td className="py-1 px-1 text-center">
                    {isSaved && <Check className="w-4 h-4 text-green-500 mx-auto" />}
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
