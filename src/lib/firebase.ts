import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyA_5eXsWA4LRZGqYl5_oO0MUloPqCFJoEI",
  authDomain: "concurso-puentes-unipaz.firebaseapp.com",
  projectId: "concurso-puentes-unipaz",
  storageBucket: "concurso-puentes-unipaz.firebasestorage.app",
  messagingSenderId: "92294175261",
  appId: "1:92294175261:web:dfe4491037186c0b34c4f4"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export default app;
