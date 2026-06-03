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
  type Unsubscribe,
} from 'firebase/firestore';
import type { BridgeProject, Vote, AppConfig } from '@/types';
import { initialBridges } from '@/data/bridges';

// ============================================================
// Colecciones en Firestore
// ============================================================
const PROJECTS_COL = 'projects';
const VOTES_COL = 'votes';
const CONFIG_DOC = 'app/config';

// ============================================================
// PROJECTS
// ============================================================
export async function loadProjects(): Promise<BridgeProject[]> {
  const snap = await getDocs(collection(db, PROJECTS_COL));
  if (snap.empty) {
    // Primera vez: cargar datos iniciales a Firestore
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
    const projects = snap.docs.map((d) => ({ id: d.id, ...d.data() } as BridgeProject));
    callback(projects);
  });
}

// ============================================================
// VOTES
// ============================================================
export async function loadVotes(): Promise<Vote[]> {
  const snap = await getDocs(collection(db, VOTES_COL));
  return snap.docs.map((d) => ({ id: d.id, ...d.data() } as Vote));
}

export async function saveVote(vote: Vote) {
  await setDoc(doc(db, VOTES_COL, vote.id), vote);
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

export function subscribeVotes(callback: (votes: Vote[]) => void): Unsubscribe {
  return onSnapshot(collection(db, VOTES_COL), (snap) => {
    const votes = snap.docs.map((d) => ({ id: d.id, ...d.data() } as Vote));
    callback(votes);
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
