import { create } from 'zustand';
import type { BridgeProject, Vote, AppConfig, ProjectResults } from '@/types';
import { initialBridges } from '@/data/bridges';

// ============================================================
// PERSISTENCIA MANUAL - Sin middleware persist de Zustand
// Lectura/escritura directa a localStorage con control total
// ============================================================

const STORAGE_KEY = 'bridge-contest-v3';

const defaultConfig: AppConfig = {
  weights: { loadWeight: 70, aesthetic: 10, video: 10, technicalSheet: 10 },
  adminPassword: 'unipaz2026',
  contestName: 'Primer Concurso de Puentes',
  contestDate: '2026-06-15',
  institution: 'IAS UNIPAZ',
};

// Leer estado guardado del localStorage
function loadFromStorage(): { projects: BridgeProject[]; votes: Vote[]; config: AppConfig } {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const data = JSON.parse(raw);
      return {
        projects: data.projects || initialBridges,
        votes: data.votes || [],
        config: data.config || defaultConfig,
      };
    }
  } catch (e) {
    console.error('Error loading from localStorage:', e);
  }
  return { projects: initialBridges, votes: [], config: defaultConfig };
}

// Guardar estado al localStorage
function saveToStorage(state: { projects: BridgeProject[]; votes: Vote[]; config: AppConfig }) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      projects: state.projects,
      votes: state.votes,
      config: state.config,
    }));
  } catch (e) {
    console.error('Error saving to localStorage:', e);
  }
}

// Estado inicial desde localStorage
const savedState = loadFromStorage();

interface AppState {
  projects: BridgeProject[];
  votes: Vote[];
  config: AppConfig;
  isAdmin: boolean;
  addProject: (project: BridgeProject) => void;
  updateProject: (id: string, data: Partial<BridgeProject>) => void;
  deleteProject: (id: string) => void;
  addVote: (vote: Vote) => void;
  deleteVote: (voteId: string) => void;
  deleteVotesForProject: (projectId: string) => void;
  hasVoted: (judgeId: string, projectId: string) => boolean;
  getVotesForProject: (projectId: string) => Vote[];
  login: (password: string) => boolean;
  logout: () => void;
  updateConfig: (config: Partial<AppConfig>) => void;
  getProjectResults: () => ProjectResults[];
  resetVotes: () => void;
}

export const useStore = create<AppState>()((set, get) => ({
  projects: savedState.projects,
  votes: savedState.votes,
  config: savedState.config,
  isAdmin: false,

  addProject: (project) => set((s) => ({ projects: [...s.projects, project] })),

  updateProject: (id, data) => set((s) => ({
    projects: s.projects.map((p) =>
      p.id === id ? { ...p, ...data, updatedAt: new Date().toISOString() } : p
    ),
  })),

  deleteProject: (id) => set((s) => ({
    projects: s.projects.filter((p) => p.id !== id),
    votes: s.votes.filter((v) => v.projectId !== id),
  })),

  addVote: (vote) => set((s) => ({ votes: [...s.votes, vote] })),

  deleteVote: (voteId) => set((s) => ({ votes: s.votes.filter((v) => v.id !== voteId) })),

  deleteVotesForProject: (pid) => set((s) => ({ votes: s.votes.filter((v) => v.projectId !== pid) })),

  hasVoted: (judgeId, projectId) => get().votes.some((v) => v.judgeId === judgeId && v.projectId === projectId),

  getVotesForProject: (pid) => get().votes.filter((v) => v.projectId === pid),

  login: (password) => {
    const ok = password === get().config.adminPassword;
    if (ok) set({ isAdmin: true });
    return ok;
  },

  logout: () => set({ isAdmin: false }),

  updateConfig: (c) => set((s) => ({ config: { ...s.config, ...c } })),

  getProjectResults: () => {
    const { projects, votes, config } = get();
    const { weights } = config;

    const projectData = projects.map((project) => {
      const ratio = (project.ownWeight && project.ownWeight > 0 && project.failureLoad)
        ? project.failureLoad / project.ownWeight : 0;
      return { project, ratio };
    });

    const maxRatio = Math.max(...projectData.map((d) => d.ratio), 0.001);
    const maxVideo = Math.max(...projects.map((p) => p.videoScore || 0), 0.001);
    const ptsCarga = weights.loadWeight / 10;
    const ptsEst = weights.aesthetic / 10;
    const ptsVid = weights.video / 10;
    const ptsFicha = weights.technicalSheet / 10;

    const results: ProjectResults[] = projectData.map(({ project, ratio }) => {
      const pv = votes.filter((v) => v.projectId === project.id);
      const n = pv.length;
      const avgEst = n > 0 ? pv.reduce((s, v) => s + v.aestheticScore, 0) / n : 0;
      const avgFicha = n > 0 ? pv.reduce((s, v) => s + v.technicalSheetScore, 0) / n : 0;
      const vs = project.videoScore || 0;

      return {
        projectId: project.id,
        projectName: project.name,
        totalVotes: n,
        ownWeight: project.ownWeight || 0,
        failureLoad: project.failureLoad || 0,
        loadWeightRatio: ratio,
        loadWeightPoints: (ratio / maxRatio) * ptsCarga,
        aestheticAverage: avgEst,
        aestheticPoints: (avgEst / 10) * ptsEst,
        videoScore: vs,
        videoPoints: (vs / maxVideo) * ptsVid,
        technicalSheetAverage: avgFicha,
        technicalSheetPoints: (avgFicha / 10) * ptsFicha,
        totalScore: (ratio / maxRatio) * ptsCarga + (avgEst / 10) * ptsEst + (vs / maxVideo) * ptsVid + (avgFicha / 10) * ptsFicha,
        rank: 0,
      };
    });

    results.sort((a, b) => b.totalScore - a.totalScore);
    results.forEach((r, i) => { r.rank = i + 1; });
    return results;
  },

  resetVotes: () => set({ votes: [] }),
}));

// ============================================================
// AUTO-SAVE: Cada vez que el estado cambia, guardar a localStorage
// ============================================================
useStore.subscribe((state) => {
  saveToStorage({ projects: state.projects, votes: state.votes, config: state.config });
});

// ============================================================
// CROSS-TAB SYNC: Cuando otra pestana/navegador modifica localStorage
// ============================================================
if (typeof window !== 'undefined') {
  window.addEventListener('storage', (e) => {
    if (e.key === STORAGE_KEY && e.newValue) {
      try {
        const data = JSON.parse(e.newValue);
        useStore.setState({
          projects: data.projects || initialBridges,
          votes: data.votes || [],
          config: data.config || defaultConfig,
        });
      } catch {}
    }
  });
}
