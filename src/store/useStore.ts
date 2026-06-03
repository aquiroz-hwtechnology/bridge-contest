import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { BridgeProject, Vote, AppConfig, ProjectResults } from '@/types';
import { initialBridges } from '@/data/bridges';

interface AppState {
  // Data
  projects: BridgeProject[];
  votes: Vote[];
  config: AppConfig;
  isAdmin: boolean;

  // Actions - Projects
  addProject: (project: BridgeProject) => void;
  updateProject: (id: string, data: Partial<BridgeProject>) => void;
  deleteProject: (id: string) => void;

  // Actions - Votes
  addVote: (vote: Vote) => void;
  deleteVote: (voteId: string) => void;
  deleteVotesForProject: (projectId: string) => void;
  hasVoted: (judgeId: string, projectId: string) => boolean;
  getVotesForProject: (projectId: string) => Vote[];

  // Actions - Admin
  login: (password: string) => boolean;
  logout: () => void;
  updateConfig: (config: Partial<AppConfig>) => void;

  // Calculations
  getProjectResults: () => ProjectResults[];
  resetVotes: () => void;
}

const defaultConfig: AppConfig = {
  weights: {
    loadWeight: 70,
    aesthetic: 10,
    video: 10,
    technicalSheet: 10,
  },
  adminPassword: 'unipaz2026',
  contestName: 'Primer Concurso de Puentes - Programas de Tecnologia en Obras Civiles e Ingenieria Civil',
  contestDate: '2026-06-15',
  institution: 'Instituto Universitario de la Paz - UNIPAZ - IAS',
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      projects: initialBridges,
      votes: [],
      config: defaultConfig,
      isAdmin: false,

      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),

      updateProject: (id, data) => {
        console.log('[STORE] updateProject called:', id, data);
        set((state) => {
          const newProjects = state.projects.map((p) =>
            p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
          );
          console.log('[STORE] Project updated. New value:', newProjects.find(p => p.id === id));
          return { projects: newProjects };
        });
      },

      deleteProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
          votes: state.votes.filter((v) => v.projectId !== id),
        })),

      addVote: (vote) =>
        set((state) => ({ votes: [...state.votes, vote] })),

      deleteVote: (voteId) =>
        set((state) => ({ votes: state.votes.filter((v) => v.id !== voteId) })),

      deleteVotesForProject: (projectId) =>
        set((state) => ({ votes: state.votes.filter((v) => v.projectId !== projectId) })),

      hasVoted: (judgeId, projectId) => {
        return get().votes.some(
          (v) => v.judgeId === judgeId && v.projectId === projectId
        );
      },

      getVotesForProject: (projectId) => {
        return get().votes.filter((v) => v.projectId === projectId);
      },

      login: (password) => {
        const isValid = password === get().config.adminPassword;
        if (isValid) set({ isAdmin: true });
        return isValid;
      },

      logout: () => set({ isAdmin: false }),

      updateConfig: (newConfig) =>
        set((state) => ({
          config: { ...state.config, ...newConfig },
        })),

      getProjectResults: () => {
        const { projects, votes, config } = get();
        const { weights } = config;

        const projectData = projects.map((project) => {
          const ratio = (project.ownWeight && project.ownWeight > 0 && project.failureLoad)
            ? project.failureLoad / project.ownWeight
            : 0;
          return { project, ratio };
        });

        const maxRatio = Math.max(...projectData.map((d) => d.ratio), 0.001);
        const maxVideo = Math.max(...projects.map((p) => p.videoScore || 0), 0.001);

        const maxPointsCarga = weights.loadWeight / 10;
        const maxPointsEstetica = weights.aesthetic / 10;
        const maxPointsVideo = weights.video / 10;
        const maxPointsFicha = weights.technicalSheet / 10;

        const results: ProjectResults[] = projectData.map(({ project, ratio }) => {
          const projectVotes = votes.filter((v) => v.projectId === project.id);
          const totalVotes = projectVotes.length;

          const aestheticAverage = totalVotes > 0
            ? projectVotes.reduce((sum, v) => sum + v.aestheticScore, 0) / totalVotes
            : 0;

          const technicalSheetAverage = totalVotes > 0
            ? projectVotes.reduce((sum, v) => sum + v.technicalSheetScore, 0) / totalVotes
            : 0;

          const loadWeightPoints = (ratio / maxRatio) * maxPointsCarga;
          const aestheticPoints = (aestheticAverage / 10) * maxPointsEstetica;
          const videoScore = project.videoScore || 0;
          const videoPoints = (videoScore / maxVideo) * maxPointsVideo;
          const technicalSheetPoints = (technicalSheetAverage / 10) * maxPointsFicha;

          const totalScore = loadWeightPoints + aestheticPoints + videoPoints + technicalSheetPoints;

          return {
            projectId: project.id,
            projectName: project.name,
            totalVotes,
            ownWeight: project.ownWeight || 0,
            failureLoad: project.failureLoad || 0,
            loadWeightRatio: ratio,
            loadWeightPoints,
            aestheticAverage,
            aestheticPoints,
            videoScore,
            videoPoints,
            technicalSheetAverage,
            technicalSheetPoints,
            totalScore,
            rank: 0,
          };
        });

        results.sort((a, b) => b.totalScore - a.totalScore);
        results.forEach((r, i) => {
          r.rank = i + 1;
        });

        return results;
      },

      resetVotes: () => set({ votes: [] }),
    }),
    {
      name: 'bridge-contest-storage',
      // NO version - evita problemas de migracion
    }
  )
);

// ============================================================
// SINCRONIZACION ENTRE PESTANAS
// Cuando el admin guarda datos en una pestana, la otra pestana
// (dashboard) detecta el cambio en localStorage y recarga el estado
// ============================================================
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (event) => {
    if (event.key === 'bridge-contest-storage' && event.newValue) {
      console.log('[SYNC] localStorage changed from another tab, rehydrating...');
      try {
        const parsed = JSON.parse(event.newValue);
        if (parsed?.state) {
          useStore.setState({
            projects: parsed.state.projects || initialBridges,
            votes: parsed.state.votes || [],
            config: parsed.state.config || defaultConfig,
          });
          console.log('[SYNC] State rehydrated from other tab');
        }
      } catch (e) {
        console.error('[SYNC] Failed to parse storage event', e);
      }
    }
  });
}
