import { ContentItem } from "../core/types";
import { IContentItemRepository } from "./IContentItemRepository";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";

const COLLECTION_NAME = "lep_content_items";

export class FirestoreContentItemRepository implements IContentItemRepository {
  
  async findById(id: string): Promise<ContentItem | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const item = docSnap.data() as ContentItem;
        if (item.deletedAt) return null;
        return item;
      }
      return null;
    } catch (e) {
      console.error("Error finding content item by ID:", e);
      return null;
    }
  }

  async findAll(): Promise<ContentItem[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const items: ContentItem[] = [];
      querySnapshot.forEach((doc) => {
        const item = doc.data() as ContentItem;
        if (!item.deletedAt) {
          items.push(item);
        }
      });
      return items;
    } catch (e) {
      console.error("Error finding all content items:", e);
      return [];
    }
  }

  async create(item: ContentItem): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, item.id);
      await setDoc(docRef, item);
    } catch (e) {
      console.error("Error creating content item:", e);
      throw e;
    }
  }

  async update(item: ContentItem): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, item.id);
      await setDoc(docRef, item, { merge: true });
    } catch (e) {
      console.error("Error updating content item:", e);
      throw e;
    }
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      await updateDoc(docRef, {
        deletedAt: new Date().toISOString(),
        deletedBy: deletedBy
      });
    } catch (e) {
      console.error("Error soft deleting content item:", e);
      throw e;
    }
  }
}
