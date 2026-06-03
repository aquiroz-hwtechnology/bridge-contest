export interface BridgeProject {
  id: string;
  name: string;
  code: string;
  teamName: string;
  imageUrl: string;
  videoUrl?: string;
  technicalSheet?: string;
  description?: string;
  // Manual data (entered by admin)
  ownWeight?: number;       // Peso propio del puente (gr) - MANUAL
  failureLoad?: number;     // Carga de falla (gr) - MANUAL
  videoScore?: number;      // Votacion del video - MANUAL (ej: 5200, 10000)
  createdAt: string;
  updatedAt: string;
}

export interface Vote {
  id: string;
  projectId: string;
  judgeId: string;
  judgeName: string;
  judgeOrganization: string;
  judgeType: 'empresarial' | 'academico' | 'institucional';
  aestheticScore: number;        // 1-10
  technicalSheetScore: number;   // 1-10
  timestamp: string;
}

export interface JudgeInfo {
  id: string;
  name: string;
  organization: string;
  type: 'empresarial' | 'academico' | 'institucional';
}

export interface ProjectResults {
  projectId: string;
  projectName: string;
  totalVotes: number;
  // Raw / intermediate values (like Excel columns)
  ownWeight: number;               // Peso propio (gr) - manual
  failureLoad: number;             // Carga de falla (gr) - manual
  loadWeightRatio: number;         // CALCULATED: failureLoad / ownWeight
  loadWeightPoints: number;        // CALCULATED: (ratio / maxRatio) * 7
  aestheticAverage: number;        // FROM VOTES: promedio estetica (1-10)
  aestheticPoints: number;         // CALCULATED: promedio / 10
  videoScore: number;              // MANUAL: votacion del video
  videoPoints: number;             // CALCULATED: (video / maxVideo) * 1
  technicalSheetAverage: number;   // FROM VOTES: promedio ficha tecnica (1-10)
  technicalSheetPoints: number;    // CALCULATED: promedio / 10
  totalScore: number;              // SUM of all points (max 10)
  rank: number;
}

export interface AppConfig {
  weights: {
    loadWeight: number;     // default 70
    aesthetic: number;      // default 10
    video: number;          // default 10
    technicalSheet: number; // default 10
  };
  adminPassword: string;
  contestName: string;
  contestDate: string;
  institution: string;
}
