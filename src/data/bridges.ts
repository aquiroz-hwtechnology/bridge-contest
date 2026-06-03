import type { BridgeProject } from '@/types';

// Datos del Excel: CONCURSO DE PUENTES DE UNIPAZ
// Solo campos manuales: ownWeight (peso propio), failureLoad (carga falla), videoScore (votacion video)
// La relacion carga/peso y los puntos se calculan automaticamente

export const initialBridges: BridgeProject[] = [
  {
    id: 'bridge-001', name: 'Puente Nowen', code: 'PTE-001', teamName: 'Equipo Nowen',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 1, failureLoad: 400, videoScore: 5200,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-002', name: 'Los Panitos De Juanito', code: 'PTE-002', teamName: 'Equipo Juanito',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 1, failureLoad: 350, videoScore: 3100,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-003', name: 'Maria La Baja', code: 'PTE-003', teamName: 'Equipo Maria La Baja',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 1, failureLoad: 300, videoScore: 2540,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-004', name: 'Fullyundecided', code: 'PTE-004', teamName: 'Equipo Fullyundecided',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 1, failureLoad: 85, videoScore: 1600,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-005', name: 'Hercules', code: 'PTE-005', teamName: 'Equipo Hercules',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 1, failureLoad: 52, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-006', name: 'Puente La Salvacion', code: 'PTE-006', teamName: 'Equipo La Salvacion',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 2, failureLoad: 219, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-007', name: 'Nexus', code: 'PTE-007', teamName: 'Equipo Nexus',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 1, failureLoad: 298, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-008', name: 'Innova Civil', code: 'PTE-008', teamName: 'Equipo Innova Civil',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 2, failureLoad: 133, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-009', name: 'Axial Prime', code: 'PTE-009', teamName: 'Equipo Axial Prime',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 2, failureLoad: 207, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-010', name: 'Zafiro', code: 'PTE-010', teamName: 'Equipo Zafiro',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 1, failureLoad: 155, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-011', name: 'Haki Estructural Avanzado', code: 'PTE-011', teamName: 'Equipo Haki',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 1, failureLoad: 198, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-012', name: 'The Recoch', code: 'PTE-012', teamName: 'Equipo The Recoch',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 1, failureLoad: 194, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-013', name: 'Ponte Silva', code: 'PTE-013', teamName: 'Equipo Ponte Silva',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 1, failureLoad: 209, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-014', name: 'Pandora', code: 'PTE-014', teamName: 'Equipo Pandora',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 2, failureLoad: 300, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-015', name: 'Atlas', code: 'PTE-015', teamName: 'Equipo Atlas',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 2, failureLoad: 58, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-016', name: 'Cruza Y Reza', code: 'PTE-016', teamName: 'Equipo Cruza Y Reza',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 2, failureLoad: 197, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-017', name: 'Puente La Aurora', code: 'PTE-017', teamName: 'Equipo La Aurora',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 1, failureLoad: 15, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-018', name: 'Concreto Y Fe', code: 'PTE-018', teamName: 'Equipo Concreto Y Fe',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 2, failureLoad: 148, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-019', name: 'Puente Barrancabermeja', code: 'PTE-019', teamName: 'Equipo Barrancabermeja',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 2, failureLoad: 183, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-020', name: 'Puente De Toc 2', code: 'PTE-020', teamName: 'Equipo Toc 2',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 2, failureLoad: 183, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-021', name: 'Puente Las Auroras', code: 'PTE-021', teamName: 'Equipo Las Auroras',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 2, failureLoad: 183, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
  {
    id: 'bridge-022', name: 'Puente Linda', code: 'PTE-022', teamName: 'Equipo Linda',
    imageUrl: '/bridge-contest/images/bridge-placeholder.svg',
    ownWeight: 2, failureLoad: 183, videoScore: 10000,
    createdAt: '2026-06-01T00:00:00Z', updatedAt: '2026-06-01T00:00:00Z',
  },
];
