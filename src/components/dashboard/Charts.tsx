import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import { Card, CardContent, CardHeader } from '@/components/ui/Card';
import { useStore } from '@/store/useStore';

// UNIPAZ institutional colors palette
const UNIPAZ_BLUE = '#273475';
const UNIPAZ_GREEN = '#009738';
const UNIPAZ_GOLD = '#d4a017';

export function ComparisonBarChart() {
  const { getProjectResults } = useStore();
  const results = getProjectResults();

  const data = results.slice(0, 10).map((r) => ({
    name: r.projectName.length > 12 ? r.projectName.substring(0, 12) + '...' : r.projectName,
    'Puntaje Total': r.totalScore,
    'Estetica': r.aestheticPoints,
    'Ficha Tecnica': r.technicalSheetPoints,
    'Carga/Peso': r.loadWeightPoints,
  }));

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-bold text-gray-800">Comparacion de Proyectos (Top 10)</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 70 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis dataKey="name" angle={-45} textAnchor="end" fontSize={11} height={80} />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="Carga/Peso" fill={UNIPAZ_BLUE} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Estetica" fill={UNIPAZ_GOLD} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Ficha Tecnica" fill={UNIPAZ_GREEN} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function CriteriaRadarChart() {
  const { getProjectResults } = useStore();
  const results = getProjectResults();

  const top5 = results.slice(0, 5);

  const data = [
    { criterion: 'Carga/Peso', ...Object.fromEntries(top5.map((r) => [r.projectName.substring(0, 10), r.loadWeightPoints])) },
    { criterion: 'Estetica', ...Object.fromEntries(top5.map((r) => [r.projectName.substring(0, 10), r.aestheticPoints])) },
    { criterion: 'Ficha Tecnica', ...Object.fromEntries(top5.map((r) => [r.projectName.substring(0, 10), r.technicalSheetPoints])) },
    { criterion: 'Video', ...Object.fromEntries(top5.map((r) => [r.projectName.substring(0, 10), r.videoPoints])) },
  ];

  const colors = [UNIPAZ_BLUE, UNIPAZ_GREEN, UNIPAZ_GOLD, '#8b5cf6', '#ef4444'];

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-bold text-gray-800">Comparacion por Criterios (Top 5)</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={350}>
          <RadarChart data={data}>
            <PolarGrid />
            <PolarAngleAxis dataKey="criterion" fontSize={12} />
            <PolarRadiusAxis />
            {top5.map((r, i) => (
              <Radar
                key={r.projectId}
                name={r.projectName.substring(0, 12)}
                dataKey={r.projectName.substring(0, 10)}
                stroke={colors[i]}
                fill={colors[i]}
                fillOpacity={0.15}
              />
            ))}
            <Legend />
            <Tooltip />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}

export function RankingChart() {
  const { getProjectResults } = useStore();
  const results = getProjectResults();

  const data = results.map((r) => ({
    name: r.projectName.length > 15 ? r.projectName.substring(0, 15) + '...' : r.projectName,
    puntaje: r.totalScore,
    fill: r.rank === 1 ? UNIPAZ_GOLD : r.rank === 2 ? '#94a3b8' : r.rank === 3 ? '#cd7f32' : UNIPAZ_BLUE,
  }));

  return (
    <Card>
      <CardHeader>
        <h3 className="text-lg font-bold text-gray-800">Ranking General</h3>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={Math.max(400, results.length * 35)}>
          <BarChart data={data} layout="vertical" margin={{ top: 5, right: 30, left: 100, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
            <XAxis type="number" />
            <YAxis type="category" dataKey="name" fontSize={11} width={95} />
            <Tooltip />
            <Bar dataKey="puntaje" radius={[0, 4, 4, 0]} fill={UNIPAZ_BLUE} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
