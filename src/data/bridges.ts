import type { BridgeProject } from '@/types';

const b = (id: string, num: string, name: string, team: string, weight = 1, load = 1, video = 1): BridgeProject => ({
  id, name, code: `PTE-${num}`, teamName: team,
  imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
  ownWeight: weight, failureLoad: load, videoScore: video,
  createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
});

export const initialBridges: BridgeProject[] = [
  b('bridge-001', '001', 'Puente Nowen', 'Equipo Nowen'),
  b('bridge-002', '002', 'Los Panitos De Juanito', 'Equipo Juanito'),
  b('bridge-003', '003', 'Maria La Baja', 'Equipo Maria La Baja'),
  b('bridge-004', '004', 'Fullyundecided', 'Equipo Fullyundecided'),
  b('bridge-005', '005', 'Hercules', 'Equipo Hercules'),
  b('bridge-006', '006', 'Puente La Salvacion', 'Equipo La Salvacion'),
  b('bridge-007', '007', 'Nexus', 'Equipo Nexus'),
  b('bridge-008', '008', 'Innova Civil', 'Equipo Innova Civil'),
  b('bridge-009', '009', 'Axial Prime', 'Equipo Axial Prime'),
  b('bridge-010', '010', 'Zafiro', 'Equipo Zafiro'),
  b('bridge-011', '011', 'Haki Estructural Avanzado', 'Equipo Haki'),
  b('bridge-012', '012', 'The Recoch', 'Equipo The Recoch'),
  b('bridge-013', '013', 'Ponte Silva', 'Equipo Ponte Silva'),
  b('bridge-014', '014', 'Pandora', 'Equipo Pandora'),
  b('bridge-015', '015', 'Atlas', 'Equipo Atlas'),
  b('bridge-016', '016', 'Cruza Y Reza', 'Equipo Cruza Y Reza'),
  b('bridge-017', '017', 'Puente La Aurora', 'Equipo La Aurora'),
  b('bridge-018', '018', 'Concreto Y Fe', 'Equipo Concreto Y Fe'),
  b('bridge-019', '019', 'Puente Barrancabermeja', 'Equipo Barrancabermeja'),
  b('bridge-020', '020', 'Puente De Toc 2', 'Equipo Toc 2'),
  b('bridge-021', '021', 'Puente Las Auroras', 'Equipo Las Auroras'),
  b('bridge-022', '022', 'Puente Linda', 'Equipo Linda'),
];
