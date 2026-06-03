import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import { Trophy, Medal } from 'lucide-react';

function fmt(n: number, decimals = 2): string {
  if (n === 0) return '0';
  return n.toFixed(decimals).replace(/\.?0+$/, '') || '0';
}

export function ResultsTable() {
  const { getProjectResults } = useStore();
  const results = getProjectResults();

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-amber-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="text-sm text-gray-500 font-medium">#{rank}</span>;
  };

  // Column header styles
  const thBase = "py-3 px-2 font-semibold text-xs whitespace-nowrap";
  const tdBase = "py-3 px-2 text-center text-sm";

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-bold text-gray-800">Calificacion del Puente</h3>
        <p className="text-xs text-gray-500">Tabla de resultados identica al formato del concurso</p>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            {/* Group headers */}
            <tr>
              <th colSpan={2} className="py-2 px-2"></th>
              <th colSpan={4} className="py-2 px-2 text-center text-xs font-bold text-white rounded-t-lg" style={{ backgroundColor: '#c0392b' }}>
                CARGA / PESO (70%)
              </th>
              <th colSpan={2} className="py-2 px-2 text-center text-xs font-bold text-white rounded-t-lg" style={{ backgroundColor: '#2980b9' }}>
                ESTETICA (10%)
              </th>
              <th colSpan={2} className="py-2 px-2 text-center text-xs font-bold text-white rounded-t-lg" style={{ backgroundColor: '#d4a017' }}>
                VIDEO (10%)
              </th>
              <th colSpan={2} className="py-2 px-2 text-center text-xs font-bold text-white rounded-t-lg" style={{ backgroundColor: '#009738' }}>
                FICHA TECNICA (10%)
              </th>
              <th className="py-2 px-2"></th>
            </tr>
            {/* Column headers */}
            <tr className="border-b-2 border-gray-300">
              <th className={`${thBase} text-left text-gray-600`}>Pos</th>
              <th className={`${thBase} text-left text-gray-600`}>Nombre del Puente</th>
              <th className={`${thBase} text-center`} style={{ backgroundColor: '#fde8e8', color: '#c0392b' }}>Peso Propio (gr)</th>
              <th className={`${thBase} text-center`} style={{ backgroundColor: '#fde8e8', color: '#c0392b' }}>Carga Falla (gr)</th>
              <th className={`${thBase} text-center`} style={{ backgroundColor: '#fde8e8', color: '#c0392b' }}>Relacion C/P</th>
              <th className={`${thBase} text-center`} style={{ backgroundColor: '#fde8e8', color: '#c0392b' }}>Puntos (70%)</th>
              <th className={`${thBase} text-center`} style={{ backgroundColor: '#e8f0fe', color: '#2980b9' }}>Promedio</th>
              <th className={`${thBase} text-center`} style={{ backgroundColor: '#e8f0fe', color: '#2980b9' }}>Puntos (10%)</th>
              <th className={`${thBase} text-center`} style={{ backgroundColor: '#fef9e7', color: '#9a7d0a' }}>Votacion</th>
              <th className={`${thBase} text-center`} style={{ backgroundColor: '#fef9e7', color: '#9a7d0a' }}>Puntos (10%)</th>
              <th className={`${thBase} text-center`} style={{ backgroundColor: '#e8f8f0', color: '#007a2d' }}>Promedio</th>
              <th className={`${thBase} text-center`} style={{ backgroundColor: '#e8f8f0', color: '#007a2d' }}>Puntos (10%)</th>
              <th className={`${thBase} text-center font-bold`} style={{ backgroundColor: '#273475', color: 'white' }}>TOTAL</th>
            </tr>
          </thead>
          <tbody>
            {results.map((r) => (
              <tr
                key={r.projectId}
                className={`border-b border-gray-100 hover:bg-gray-50/80 transition-colors ${
                  r.rank <= 3 ? 'bg-amber-50/40 font-medium' : ''
                }`}
              >
                <td className="py-3 px-2">{getRankBadge(r.rank)}</td>
                <td className="py-3 px-2 font-medium text-gray-800 whitespace-nowrap">{r.projectName}</td>
                {/* Carga/Peso columns */}
                <td className={`${tdBase}`} style={{ backgroundColor: '#fdf2f2' }}>
                  {r.ownWeight || '-'}
                </td>
                <td className={`${tdBase}`} style={{ backgroundColor: '#fdf2f2' }}>
                  {r.failureLoad || '-'}
                </td>
                <td className={`${tdBase} font-medium`} style={{ backgroundColor: '#fdf2f2' }}>
                  {r.loadWeightRatio > 0 ? fmt(r.loadWeightRatio, 1) : '-'}
                </td>
                <td className={`${tdBase} font-bold`} style={{ backgroundColor: '#fde8e8', color: '#c0392b' }}>
                  {r.loadWeightRatio > 0 ? fmt(r.loadWeightPoints, 3) : '-'}
                </td>
                {/* Estetica columns */}
                <td className={`${tdBase}`} style={{ backgroundColor: '#f0f5ff' }}>
                  {r.totalVotes > 0 ? fmt(r.aestheticAverage, 2) : '-'}
                </td>
                <td className={`${tdBase} font-bold`} style={{ backgroundColor: '#e8f0fe', color: '#2980b9' }}>
                  {r.totalVotes > 0 ? fmt(r.aestheticPoints, 2) : '-'}
                </td>
                {/* Video columns */}
                <td className={`${tdBase}`} style={{ backgroundColor: '#fffdf0' }}>
                  {r.videoScore > 0 ? r.videoScore.toLocaleString() : '-'}
                </td>
                <td className={`${tdBase} font-bold`} style={{ backgroundColor: '#fef9e7', color: '#9a7d0a' }}>
                  {r.videoScore > 0 ? fmt(r.videoPoints, 2) : '-'}
                </td>
                {/* Ficha Tecnica columns */}
                <td className={`${tdBase}`} style={{ backgroundColor: '#f0faf5' }}>
                  {r.totalVotes > 0 ? fmt(r.technicalSheetAverage, 2) : '-'}
                </td>
                <td className={`${tdBase} font-bold`} style={{ backgroundColor: '#e8f8f0', color: '#007a2d' }}>
                  {r.totalVotes > 0 ? fmt(r.technicalSheetPoints, 2) : '-'}
                </td>
                {/* Total */}
                <td className={`${tdBase} font-bold text-base`} style={{ backgroundColor: '#273475', color: 'white' }}>
                  {fmt(r.totalScore, 1)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
