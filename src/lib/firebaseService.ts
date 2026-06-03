import { db } from './firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  deleteDoc,
  onSnapshot,
  writeBatch,
  query,
  where,
  type Unsubscribe,
} from 'firebase/firestore';
import type { BridgeProject, Vote, AppConfig } from '@/types';
import { initialBridges } from '@/data/bridges';

const PROJECTS_COL = 'projects';
const VOTES_COL = 'votes';

// ============================================================
// PROJECTS
// ============================================================
export async function loadProjects(): Promise<BridgeProject[]> {
  const snap = await getDocs(collection(db, PROJECTS_COL));
  if (snap.empty) {
    await seedProjects();
    return initialBridges;
  }
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as BridgeProject));
}

export async function seedProjects() {
  const batch = writeBatch(db);
  for (const p of initialBridges) {
    batch.set(doc(db, PROJECTS_COL, p.id), p);
  }
  await batch.commit();
}

export async function saveProject(project: BridgeProject) {
  await setDoc(doc(db, PROJECTS_COL, project.id), project);
}

export async function removeProject(id: string) {
  await deleteDoc(doc(db, PROJECTS_COL, id));
}

export function subscribeProjects(callback: (projects: BridgeProject[]) => void): Unsubscribe {
  return onSnapshot(collection(db, PROJECTS_COL), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as BridgeProject)));
  });
}

// ============================================================
// VOTES - ID determinista: judgeId__projectId
// Esto hace IMPOSIBLE tener 2 votos del mismo jurado al mismo puente
// Si se intenta votar de nuevo, sobreescribe el anterior (setDoc)
// ============================================================

function makeVoteId(judgeId: string, projectId: string): string {
  return `${judgeId}__${projectId}`;
}

export async function saveVote(vote: Vote) {
  // Usar ID determinista para impedir duplicados
  const voteId = makeVoteId(vote.judgeId, vote.projectId);
  const voteWithId = { ...vote, id: voteId };
  await setDoc(doc(db, VOTES_COL, voteId), voteWithId);
}

export async function checkIfVoted(judgeId: string, projectId: string): Promise<boolean> {
  const voteId = makeVoteId(judgeId, projectId);
  const snap = await getDoc(doc(db, VOTES_COL, voteId));
  return snap.exists();
}

export async function loadVotes(): Promise<Vote[]> {
  const snap = await getDocs(collection(db, VOTES_COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Vote));
}

export async function removeVote(id: string) {
  await deleteDoc(doc(db, VOTES_COL, id));
}

export async function removeVotesForProject(projectId: string) {
  const snap = await getDocs(collection(db, VOTES_COL));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => {
    if ((d.data() as Vote).projectId === projectId) {
      batch.delete(d.ref);
    }
  });
  await batch.commit();
}

export async function removeAllVotes() {
  const snap = await getDocs(collection(db, VOTES_COL));
  const batch = writeBatch(db);
  snap.docs.forEach((d) => batch.delete(d.ref));
  await batch.commit();
}

// ============================================================
// LIMPIAR DUPLICADOS existentes en la base de datos
// Mantiene solo el ultimo voto de cada jurado por proyecto
// ============================================================
export async function cleanDuplicateVotes(): Promise<number> {
  const snap = await getDocs(collection(db, VOTES_COL));
  const allVotes = snap.docs.map((d) => ({ docId: d.id, ref: d.ref, ...(d.data() as Vote) }));

  // Agrupar por judgeId + projectId, mantener solo el mas reciente
  const grouped = new Map<string, typeof allVotes>();
  for (const v of allVotes) {
    const key = `${v.judgeId}__${v.projectId}`;
    if (!grouped.has(key)) grouped.set(key, []);
    grouped.get(key)!.push(v);
  }

  let deletedCount = 0;
  const batch = writeBatch(db);

  for (const [key, votes] of grouped) {
    if (votes.length <= 1) continue;

    // Ordenar por timestamp descendente, mantener el primero (mas reciente)
    votes.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    const keep = votes[0];

    // Guardar el que se queda con ID determinista
    const correctId = key; // judgeId__projectId
    const keepData: Vote = {
      id: correctId,
      projectId: keep.projectId,
      judgeId: keep.judgeId,
      judgeName: keep.judgeName,
      judgeOrganization: keep.judgeOrganization,
      judgeType: keep.judgeType,
      aestheticScore: keep.aestheticScore,
      technicalSheetScore: keep.technicalSheetScore,
      timestamp: keep.timestamp,
    };
    batch.set(doc(db, VOTES_COL, correctId), keepData);

    // Eliminar todos los duplicados (incluyendo el original si tiene ID diferente)
    for (const v of votes) {
      if (v.docId !== correctId) {
        batch.delete(v.ref);
        deletedCount++;
      }
    }
  }

  if (deletedCount > 0) {
    await batch.commit();
  }

  return deletedCount;
}

export function subscribeVotes(callback: (votes: Vote[]) => void): Unsubscribe {
  return onSnapshot(collection(db, VOTES_COL), (snap) => {
    callback(snap.docs.map((d) => ({ id: d.id, ...d.data() } as Vote)));
  });
}

// ============================================================
// CONFIG
// ============================================================
export async function loadConfig(): Promise<AppConfig | null> {
  const snap = await getDoc(doc(db, 'app', 'config'));
  return snap.exists() ? (snap.data() as AppConfig) : null;
}

export async function saveConfig(config: AppConfig) {
  await setDoc(doc(db, 'app', 'config'), config);
}
