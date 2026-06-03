import { create } from 'zustand';
import type { BridgeProject, Vote, AppConfig, ProjectResults } from '@/types';
import { initialBridges } from '@/data/bridges';
import * as fb from '@/lib/firebaseService';

// ============================================================
// Store con Firebase Firestore - datos en la nube
// Cualquier navegador/dispositivo ve los mismos datos en tiempo real
// ============================================================

const defaultConfig: AppConfig = {
  weights: { loadWeight: 70, aesthetic: 10, video: 10, technicalSheet: 10 },
  adminPassword: 'unipaz2026',
  contestName: 'Primer Concurso de Puentes',
  contestDate: '2026-06-15',
  institution: 'IAS UNIPAZ',
};

interface AppState {
  projects: BridgeProject[];
  votes: Vote[];
  config: AppConfig;
  isAdmin: boolean;
  loading: boolean;

  // Init
  init: () => Promise<void>;

  // Projects
  addProject: (project: BridgeProject) => Promise<void>;
  updateProject: (id: string, data: Partial<BridgeProject>) => Promise<void>;
  deleteProject: (id: string) => Promise<void>;

  // Votes
  addVote: (vote: Vote) => Promise<void>;
  deleteVote: (voteId: string) => Promise<void>;
  deleteVotesForProject: (projectId: string) => Promise<void>;
  hasVoted: (judgeId: string, projectId: string) => boolean;
  getVotesForProject: (projectId: string) => Vote[];
  resetVotes: () => Promise<void>;

  // Admin
  login: (password: string) => boolean;
  logout: () => void;
  updateConfig: (config: Partial<AppConfig>) => Promise<void>;

  // Calculations
  getProjectResults: () => ProjectResults[];
}

export const useStore = create<AppState>()((set, get) => ({
  projects: [],
  votes: [],
  config: defaultConfig,
  isAdmin: false,
  loading: true,

  // ============================================================
  // INIT: Carga datos de Firebase + activa listeners en tiempo real
  // ============================================================
  init: async () => {
    try {
      // Load config
      const config = await fb.loadConfig();
      if (config) {
        set({ config });
      } else {
        await fb.saveConfig(defaultConfig);
      }

      // Subscribe to real-time updates (projects)
      fb.subscribeProjects((projects) => {
        if (projects.length === 0) return; // skip empty (seed in progress)
        set({ projects, loading: false });
      });

      // Subscribe to real-time updates (votes)
      fb.subscribeVotes((votes) => {
        set({ votes });
      });

      // Initial load of projects (triggers seed if empty)
      const projects = await fb.loadProjects();
      set({ projects, loading: false });
    } catch (error) {
      console.error('Firebase init error:', error);
      // Fallback to initial data if Firebase fails
      set({ projects: initialBridges, loading: false });
    }
  },

  // ============================================================
  // PROJECTS - escriben a Firebase, los listeners actualizan el state
  // ============================================================
  addProject: async (project) => {
    await fb.saveProject(project);
    // No need to set state - the onSnapshot listener will update it
  },

  updateProject: async (id, data) => {
    const project = get().projects.find((p) => p.id === id);
    if (!project) return;
    const updated = { ...project, ...data, updatedAt: new Date().toISOString() };
    await fb.saveProject(updated);
    // Listener will update state automatically
  },

  deleteProject: async (id) => {
    await fb.removeProject(id);
    await fb.removeVotesForProject(id);
  },

  // ============================================================
  // VOTES - escriben a Firebase, los listeners actualizan el state
  // ============================================================
  addVote: async (vote) => {
    await fb.saveVote(vote);
  },

  deleteVote: async (voteId) => {
    await fb.removeVote(voteId);
  },

  deleteVotesForProject: async (projectId) => {
    await fb.removeVotesForProject(projectId);
  },

  hasVoted: (judgeId, projectId) => {
    return get().votes.some((v) => v.judgeId === judgeId && v.projectId === projectId);
  },

  getVotesForProject: (pid) => get().votes.filter((v) => v.projectId === pid),

  resetVotes: async () => {
    await fb.removeAllVotes();
  },

  // ============================================================
  // ADMIN
  // ============================================================
  login: (password) => {
    const ok = password === get().config.adminPassword;
    if (ok) set({ isAdmin: true });
    return ok;
  },

  logout: () => set({ isAdmin: false }),

  updateConfig: async (c) => {
    const newConfig = { ...get().config, ...c };
    set({ config: newConfig });
    await fb.saveConfig(newConfig);
  },

  // ============================================================
  // CALCULATIONS - mismas formulas del Excel
  // ============================================================
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
      const lwp = (ratio / maxRatio) * ptsCarga;
      const aep = (avgEst / 10) * ptsEst;
      const vp = (vs / maxVideo) * ptsVid;
      const tsp = (avgFicha / 10) * ptsFicha;

      return {
        projectId: project.id, projectName: project.name, totalVotes: n,
        ownWeight: project.ownWeight || 0, failureLoad: project.failureLoad || 0,
        loadWeightRatio: ratio, loadWeightPoints: lwp,
        aestheticAverage: avgEst, aestheticPoints: aep,
        videoScore: vs, videoPoints: vp,
        technicalSheetAverage: avgFicha, technicalSheetPoints: tsp,
        totalScore: lwp + aep + vp + tsp, rank: 0,
      };
    });

    results.sort((a, b) => b.totalScore - a.totalScore);
    results.forEach((r, i) => { r.rank = i + 1; });
    return results;
  },
}));
