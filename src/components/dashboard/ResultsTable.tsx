import { useState } from 'react';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import { Trophy, Medal, ChevronRight, ChevronDown, FileSpreadsheet, FileText } from 'lucide-react';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

function fmt(n: number, decimals = 2): string {
  if (n === 0) return '0';
  return n.toFixed(decimals).replace(/\.?0+$/, '') || '0';
}

export function ResultsTable() {
  const { getProjectResults, config } = useStore();
  const results = getProjectResults();

  // Column visibility toggles
  const [showCarga, setShowCarga] = useState(true);
  const [showEstetica, setShowEstetica] = useState(true);
  const [showVideo, setShowVideo] = useState(true);
  const [showFicha, setShowFicha] = useState(true);
  const [showTotal, setShowTotal] = useState(true);

  const getRankBadge = (rank: number) => {
    if (rank === 1) return <Trophy className="w-5 h-5 text-amber-500" />;
    if (rank === 2) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 3) return <Medal className="w-5 h-5 text-amber-700" />;
    return <span className="text-sm text-gray-500 font-medium">#{rank}</span>;
  };

  // ============================================================
  // EXPORT TO EXCEL
  // ============================================================
  const exportToExcel = () => {
    const data = results.map((r) => ({
      'Posicion': r.rank,
      'Nombre del Puente': r.projectName,
      'Peso Propio (gr)': r.ownWeight,
      'Carga Falla (gr)': r.failureLoad,
      'Relacion C/P': Number(r.loadWeightRatio.toFixed(2)),
      'Puntos (70%)': Number(r.loadWeightPoints.toFixed(3)),
      'Estetica Promedio': Number(r.aestheticAverage.toFixed(2)),
      'Puntos Estetica (10%)': Number(r.aestheticPoints.toFixed(3)),
      'Votacion Video': r.videoScore,
      'Puntos Video (10%)': Number(r.videoPoints.toFixed(3)),
      'Ficha Tecnica Promedio': Number(r.technicalSheetAverage.toFixed(2)),
      'Puntos Ficha (10%)': Number(r.technicalSheetPoints.toFixed(3)),
      'TOTAL': Number(r.totalScore.toFixed(2)),
      'Votos': r.totalVotes,
    }));

    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Resultados');

    // Column widths
    ws['!cols'] = [
      { wch: 8 }, { wch: 28 }, { wch: 14 }, { wch: 14 }, { wch: 12 },
      { wch: 12 }, { wch: 14 }, { wch: 16 }, { wch: 14 }, { wch: 16 },
      { wch: 18 }, { wch: 16 }, { wch: 10 }, { wch: 8 },
    ];

    XLSX.writeFile(wb, `Resultados_Concurso_Puentes_UNIPAZ_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  // ============================================================
  // EXPORT TO PDF
  // ============================================================
  const exportToPDF = () => {
    try {
      const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'letter' });

      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('Primer Concurso de Puentes - IAS UNIPAZ 2026', 14, 15);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'normal');
      doc.text('Resultados generados el ' + new Date().toLocaleDateString('es-CO') + ' a las ' + new Date().toLocaleTimeString('es-CO'), 14, 22);

      const headers = [
        ['Pos', 'Puente', 'Peso(gr)', 'Carga(gr)', 'Rel C/P', 'Pts(70%)',
         'Est.Prom', 'Pts(10%)', 'Video', 'Pts(10%)', 'Ficha Prom', 'Pts(10%)', 'TOTAL']
      ];

      const body = results.map((r) => [
        String(r.rank),
        r.projectName,
        String(r.ownWeight),
        String(r.failureLoad),
        r.loadWeightRatio > 0 ? r.loadWeightRatio.toFixed(1) : '-',
        r.loadWeightRatio > 0 ? r.loadWeightPoints.toFixed(3) : '-',
        r.totalVotes > 0 ? r.aestheticAverage.toFixed(2) : '-',
        r.totalVotes > 0 ? r.aestheticPoints.toFixed(3) : '-',
        r.videoScore > 0 ? String(r.videoScore) : '-',
        r.videoScore > 0 ? r.videoPoints.toFixed(3) : '-',
        r.totalVotes > 0 ? r.technicalSheetAverage.toFixed(2) : '-',
        r.totalVotes > 0 ? r.technicalSheetPoints.toFixed(3) : '-',
        r.totalScore.toFixed(1),
      ]);

      autoTable(doc, {
        head: headers,
        body: body,
        startY: 28,
        theme: 'grid',
        styles: { fontSize: 7, cellPadding: 1.5 },
        headStyles: { fillColor: [39, 52, 117], textColor: 255, fontStyle: 'bold', fontSize: 7 },
        columnStyles: {
          0: { halign: 'center', cellWidth: 10 },
          1: { cellWidth: 35 },
          2: { halign: 'center' },
          3: { halign: 'center' },
          4: { halign: 'center' },
          5: { halign: 'center', fontStyle: 'bold' },
          6: { halign: 'center' },
          7: { halign: 'center', fontStyle: 'bold' },
          8: { halign: 'center' },
          9: { halign: 'center', fontStyle: 'bold' },
          10: { halign: 'center' },
          11: { halign: 'center', fontStyle: 'bold' },
          12: { halign: 'center', fontStyle: 'bold', fillColor: [39, 52, 117], textColor: 255 },
        },
        alternateRowStyles: { fillColor: [248, 249, 252] },
      });

      const pageCount = doc.getNumberOfPages();
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text('Instituto Universitario de la Paz - UNIPAZ | Concurso de Puentes 2026', 14, doc.internal.pageSize.height - 8);
        doc.text('Pagina ' + i + ' de ' + pageCount, doc.internal.pageSize.width - 35, doc.internal.pageSize.height - 8);
      }

      doc.save('Resultados_Concurso_Puentes_UNIPAZ_' + new Date().toISOString().slice(0, 10) + '.pdf');
    } catch (err) {
      console.error('Error generando PDF:', err);
      alert('Error al generar el PDF. Revise la consola para mas detalles.');
    }
  };

  // Toggle button component
  const ToggleBtn = ({ label, color, active, onClick }: { label: string; color: string; active: boolean; onClick: () => void }) => (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold transition-all border ${
        active ? 'text-white border-transparent' : 'bg-white border-gray-300 text-gray-500'
      }`}
      style={active ? { backgroundColor: color } : {}}
    >
      {active ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
      {label}
    </button>
  );

  const thBase = "py-3 px-2 font-semibold text-xs whitespace-nowrap";
  const tdBase = "py-3 px-2 text-center text-sm";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <h3 className="text-lg font-bold text-gray-800">Calificacion del Puente</h3>
            <p className="text-xs text-gray-500">Tabla de resultados &bull; Click en cada seccion para mostrar/ocultar columnas</p>
          </div>
          {/* Export buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={exportToExcel}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: '#1d6f42' }}
            >
              <FileSpreadsheet className="w-3.5 h-3.5" /> Excel
            </button>
            <button
              onClick={exportToPDF}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-colors hover:opacity-90"
              style={{ backgroundColor: '#c0392b' }}
            >
              <FileText className="w-3.5 h-3.5" /> PDF
            </button>
          </div>
        </div>
        {/* Section toggles */}
        <div className="flex flex-wrap gap-2 mt-3">
          <ToggleBtn label="Carga/Peso (70%)" color="#c0392b" active={showCarga} onClick={() => setShowCarga(!showCarga)} />
          <ToggleBtn label="Estetica (10%)" color="#2980b9" active={showEstetica} onClick={() => setShowEstetica(!showEstetica)} />
          <ToggleBtn label="Video (10%)" color="#d4a017" active={showVideo} onClick={() => setShowVideo(!showVideo)} />
          <ToggleBtn label="Ficha Tecnica (10%)" color="#009738" active={showFicha} onClick={() => setShowFicha(!showFicha)} />
          <ToggleBtn label="Total" color="#273475" active={showTotal} onClick={() => setShowTotal(!showTotal)} />
        </div>
      </CardHeader>
      <CardContent className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            {/* Group headers */}
            <tr>
              <th colSpan={2} className="py-2 px-2"></th>
              {showCarga && (
                <th colSpan={4} className="py-2 px-2 text-center text-xs font-bold text-white rounded-t-lg" style={{ backgroundColor: '#c0392b' }}>
                  CARGA / PESO (70%)
                </th>
              )}
              {showEstetica && (
                <th colSpan={2} className="py-2 px-2 text-center text-xs font-bold text-white rounded-t-lg" style={{ backgroundColor: '#2980b9' }}>
                  ESTETICA (10%)
                </th>
              )}
              {showVideo && (
                <th colSpan={2} className="py-2 px-2 text-center text-xs font-bold text-white rounded-t-lg" style={{ backgroundColor: '#d4a017' }}>
                  VIDEO (10%)
                </th>
              )}
              {showFicha && (
                <th colSpan={2} className="py-2 px-2 text-center text-xs font-bold text-white rounded-t-lg" style={{ backgroundColor: '#009738' }}>
                  FICHA TECNICA (10%)
                </th>
              )}
              {showTotal && <th className="py-2 px-2"></th>}
            </tr>
            {/* Column headers */}
            <tr className="border-b-2 border-gray-300">
              <th className={`${thBase} text-left text-gray-600`}>Pos</th>
              <th className={`${thBase} text-left text-gray-600`}>Nombre del Puente</th>
              {showCarga && <>
                <th className={`${thBase} text-center`} style={{ backgroundColor: '#fde8e8', color: '#c0392b' }}>Peso (gr)</th>
                <th className={`${thBase} text-center`} style={{ backgroundColor: '#fde8e8', color: '#c0392b' }}>Carga (gr)</th>
                <th className={`${thBase} text-center`} style={{ backgroundColor: '#fde8e8', color: '#c0392b' }}>Rel. C/P</th>
                <th className={`${thBase} text-center`} style={{ backgroundColor: '#fde8e8', color: '#c0392b' }}>Puntos</th>
              </>}
              {showEstetica && <>
                <th className={`${thBase} text-center`} style={{ backgroundColor: '#e8f0fe', color: '#2980b9' }}>Promedio</th>
                <th className={`${thBase} text-center`} style={{ backgroundColor: '#e8f0fe', color: '#2980b9' }}>Puntos</th>
              </>}
              {showVideo && <>
                <th className={`${thBase} text-center`} style={{ backgroundColor: '#fef9e7', color: '#9a7d0a' }}>Votacion</th>
                <th className={`${thBase} text-center`} style={{ backgroundColor: '#fef9e7', color: '#9a7d0a' }}>Puntos</th>
              </>}
              {showFicha && <>
                <th className={`${thBase} text-center`} style={{ backgroundColor: '#e8f8f0', color: '#007a2d' }}>Promedio</th>
                <th className={`${thBase} text-center`} style={{ backgroundColor: '#e8f8f0', color: '#007a2d' }}>Puntos</th>
              </>}
              {showTotal && <th className={`${thBase} text-center font-bold`} style={{ backgroundColor: '#273475', color: 'white' }}>TOTAL</th>}
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
                {showCarga && <>
                  <td className={tdBase} style={{ backgroundColor: '#fdf2f2' }}>{r.ownWeight || '-'}</td>
                  <td className={tdBase} style={{ backgroundColor: '#fdf2f2' }}>{r.failureLoad || '-'}</td>
                  <td className={`${tdBase} font-medium`} style={{ backgroundColor: '#fdf2f2' }}>
                    {r.loadWeightRatio > 0 ? fmt(r.loadWeightRatio, 1) : '-'}
                  </td>
                  <td className={`${tdBase} font-bold`} style={{ backgroundColor: '#fde8e8', color: '#c0392b' }}>
                    {r.loadWeightRatio > 0 ? fmt(r.loadWeightPoints, 3) : '-'}
                  </td>
                </>}
                {showEstetica && <>
                  <td className={tdBase} style={{ backgroundColor: '#f0f5ff' }}>
                    {r.totalVotes > 0 ? fmt(r.aestheticAverage, 2) : '-'}
                  </td>
                  <td className={`${tdBase} font-bold`} style={{ backgroundColor: '#e8f0fe', color: '#2980b9' }}>
                    {r.totalVotes > 0 ? fmt(r.aestheticPoints, 2) : '-'}
                  </td>
                </>}
                {showVideo && <>
                  <td className={tdBase} style={{ backgroundColor: '#fffdf0' }}>
                    {r.videoScore > 0 ? r.videoScore.toLocaleString() : '-'}
                  </td>
                  <td className={`${tdBase} font-bold`} style={{ backgroundColor: '#fef9e7', color: '#9a7d0a' }}>
                    {r.videoScore > 0 ? fmt(r.videoPoints, 2) : '-'}
                  </td>
                </>}
                {showFicha && <>
                  <td className={tdBase} style={{ backgroundColor: '#f0faf5' }}>
                    {r.totalVotes > 0 ? fmt(r.technicalSheetAverage, 2) : '-'}
                  </td>
                  <td className={`${tdBase} font-bold`} style={{ backgroundColor: '#e8f8f0', color: '#007a2d' }}>
                    {r.totalVotes > 0 ? fmt(r.technicalSheetPoints, 2) : '-'}
                  </td>
                </>}
                {showTotal && (
                  <td className={`${tdBase} font-bold text-base`} style={{ backgroundColor: '#273475', color: 'white' }}>
                    {fmt(r.totalScore, 1)}
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </CardContent>
    </Card>
  );
}
