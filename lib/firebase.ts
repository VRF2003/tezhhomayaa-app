import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyA1tyHbTMzw-kxd-z5RBugt1Wt9kABnpDs",
  authDomain: "tezhhomayaa-9dcaa.firebaseapp.com",
  projectId: "tezhhomayaa-9dcaa",
  storageBucket: "tezhhomayaa-9dcaa.firebasestorage.app",
  messagingSenderId: "28962444668",
  appId: "1:28962444668:web:d4eef13a14a20a2576c0f9"
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
