import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyA1tyHbTMzw-kxd-z5RBugt1Wt9kABnpDs",
  authDomain: "tezhhomayaa-9dcaa.firebaseapp.com",
  projectId: "tezhhomayaa-9dcaa",
  storageBucket: "tezhhomayaa-9dcaa.firebasestorage.app",
  messagingSenderId: "28962444668",
  appId: "1:28962444668:web:d4eef13a14a20a2576c0f9"
};

// Initialize Firebase only if it hasn't been initialized already (critical for Next.js SSR)
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
