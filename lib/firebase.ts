import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  type User,
} from "firebase/auth";
import {
  getFirestore,
  collection,
  addDoc,
  doc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const googleProvider = new GoogleAuthProvider();

export type ChatMode = "study" | "news" | "general";

export type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type ChatRecord = {
  id?: string;
  userId: string;
  userName: string;
  userEmail: string;
  title: string;
  mode: ChatMode;
  messages: ChatMessage[];
  createdAt?: Timestamp | null;
  updatedAt?: Timestamp | null;
};

export async function signInWithGoogle() {
  return signInWithPopup(auth, googleProvider);
}

export async function logOut() {
  return signOut(auth);
}

export function watchAuth(callback: (user: User | null) => void) {
  return onAuthStateChanged(auth, callback);
}

export async function createChat(record: Omit<ChatRecord, "id" | "createdAt" | "updatedAt">) {
  const docRef = await addDoc(collection(db, "chats"), {
    ...record,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });

  return docRef.id;
}

export async function updateChat(chatId: string, updates: Partial<ChatRecord>) {
  const ref = doc(db, "chats", chatId);
  await updateDoc(ref, {
    ...updates,
    updatedAt: serverTimestamp(),
  });
}

export async function getChat(chatId: string) {
  const ref = doc(db, "chats", chatId);
  const snapshot = await getDoc(ref);

  if (!snapshot.exists()) return null;

  return {
    id: snapshot.id,
    ...(snapshot.data() as Omit<ChatRecord, "id">),
  };
}

export async function getUserChats(userId: string) {
  const q = query(
    collection(db, "chats"),
    where("userId", "==", userId)
  );

  const snapshot = await getDocs(q);

  const chats = snapshot.docs.map((item) => ({
    id: item.id,
    ...(item.data() as Omit<ChatRecord, "id">),
  }));

  return chats.sort((a, b) => {
    const aTime = a.updatedAt?.seconds || 0;
    const bTime = b.updatedAt?.seconds || 0;
    return bTime - aTime;
  });
}

export async function removeChat(chatId: string) {
  await deleteDoc(doc(db, "chats", chatId));
}