import { IDatabaseDriver } from "./IDatabaseDriver";
import { db } from "@/lib/firebase";
import { doc, getDoc, setDoc, deleteDoc, collection, query, where, getDocs, writeBatch } from "firebase/firestore";

export class FirestoreDriver implements IDatabaseDriver {
  private connected = true;

  public async connect(): Promise<void> {
    this.connected = true;
  }

  public async disconnect(): Promise<void> {
    this.connected = false;
  }

  public isConnected(): boolean {
    return this.connected;
  }

  public async healthCheck(): Promise<boolean> {
    try {
      // Just a simple ping to see if we can resolve a doc reference quickly
      await getDoc(doc(db, "health", "ping"));
      return true;
    } catch {
      return false;
    }
  }

  public async getLatency(): Promise<number> {
    const start = performance.now();
    try {
      await getDoc(doc(db, "health", "latency"));
    } catch {
      // ignore
    }
    return performance.now() - start;
  }

  public getName(): string {
    return "FirestoreDriver";
  }

  public async read(collectionName: string, id: string): Promise<any> {
    const docRef = doc(db, collectionName, id);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data();
  }

  public async write(collectionName: string, id: string, payload: any): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await setDoc(docRef, payload, { merge: true });
  }

  public async delete(collectionName: string, id: string): Promise<void> {
    const docRef = doc(db, collectionName, id);
    await deleteDoc(docRef);
  }

  public async query(collectionName: string, filters?: any): Promise<any[]> {
    const colRef = collection(db, collectionName);
    if (!filters) {
      const snap = await getDocs(colRef);
      return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }

    const constraints = Object.entries(filters).map(([k, v]) => where(k, "==", v));
    const q = query(colRef, ...constraints);
    const snap = await getDocs(q);
    return snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  }

  public async startTransaction(): Promise<any> {
    return writeBatch(db);
  }

  public async commitTransaction(tx: any): Promise<void> {
    if (tx && typeof tx.commit === 'function') {
      await tx.commit();
    }
  }

  public async rollbackTransaction(tx: any): Promise<void> {
    // Firestore batches do not support rollback after commit, and before commit they simply aren't committed.
  }
}
