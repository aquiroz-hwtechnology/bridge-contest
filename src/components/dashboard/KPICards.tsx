import { Card, CardContent } from '@/components/ui/Card';
import { useStore } from '@/store/useStore';
import { Trophy, Palette, FileText, Weight, Users, BarChart3 } from 'lucide-react';

export function KPICards() {
  const { votes, projects, getProjectResults } = useStore();
  const results = getProjectResults();

  const uniqueJudges = new Set(votes.map((v) => v.judgeId)).size;
  const totalVotes = votes.length;

  const leader = results[0];
  const bestAesthetic = [...results].sort((a, b) => b.aestheticAverage - a.aestheticAverage)[0];
  const bestTechnicalSheet = [...results].sort((a, b) => b.technicalSheetAverage - a.technicalSheetAverage)[0];
  const bestLoadWeight = [...results].sort((a, b) => b.failureLoad - a.failureLoad)[0];

  const kpis = [
    {
      label: 'Total Evaluadores',
      value: uniqueJudges,
      icon: Users,
      color: 'from-[#273475] to-[#3a4a9a]',
      textColor: 'text-[#273475]',
    },
    {
      label: 'Votos Emitidos',
      value: totalVotes,
      icon: BarChart3,
      color: 'from-[#009738] to-[#00b344]',
      textColor: 'text-[#009738]',
    },
    {
      label: 'Proyecto Lider',
      value: leader?.projectName || '-',
      subtitle: leader ? `${leader.totalScore} pts` : '',
      icon: Trophy,
      color: 'from-amber-500 to-amber-600',
      textColor: 'text-amber-600',
    },
    {
      label: 'Mejor Estetica',
      value: bestAesthetic?.projectName || '-',
      subtitle: bestAesthetic ? `${bestAesthetic.aestheticAverage}/10` : '',
      icon: Palette,
      color: 'from-purple-500 to-purple-600',
      textColor: 'text-purple-600',
    },
    {
      label: 'Mejor Ficha Tecnica',
      value: bestTechnicalSheet?.projectName || '-',
      subtitle: bestTechnicalSheet ? `${bestTechnicalSheet.technicalSheetAverage}/10` : '',
      icon: FileText,
      color: 'from-rose-500 to-rose-600',
      textColor: 'text-rose-600',
    },
    {
      label: 'Mayor Carga Soportada',
      value: bestLoadWeight?.projectName || '-',
      subtitle: bestLoadWeight?.failureLoad ? `${bestLoadWeight.failureLoad} gr` : '',
      icon: Weight,
      color: 'from-indigo-500 to-indigo-600',
      textColor: 'text-indigo-600',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {kpis.map((kpi) => {
        const Icon = kpi.icon;
        return (
          <Card key={kpi.label} hover>
            <CardContent className="flex items-start gap-4">
              <div className={`p-3 rounded-xl bg-gradient-to-br ${kpi.color} text-white shrink-0`}>
                <Icon className="w-6 h-6" />
              </div>
              <div className="min-w-0">
                <p className="text-xs text-gray-500 font-medium uppercase tracking-wide">{kpi.label}</p>
                <p className={`text-lg font-bold ${kpi.textColor} truncate`}>
                  {typeof kpi.value === 'number' ? kpi.value.toLocaleString() : kpi.value}
                </p>
                {kpi.subtitle && (
                  <p className="text-sm text-gray-400">{kpi.subtitle}</p>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
