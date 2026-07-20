import { Campaign } from "../campaigns/types";
import { ICampaignRepository } from "./ICampaignRepository";
import { db } from "@/lib/firebase";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc } from "firebase/firestore";
import { Observability } from "@/lib/infrastructure/observability";

const COLLECTION_NAME = "lep_campaigns";

export class FirestoreCampaignRepository implements ICampaignRepository {
  
  async findById(id: string): Promise<Campaign | null> {
    try {
      const docRef = doc(db, COLLECTION_NAME, id);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const campaign = docSnap.data() as Campaign;
        if (campaign.deletedAt) return null;
        return campaign;
      }
      return null;
    } catch (e) {
      Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Error finding campaign by ID:", e);
      return null;
    }
  }

  async findAll(): Promise<Campaign[]> {
    try {
      const querySnapshot = await getDocs(collection(db, COLLECTION_NAME));
      const campaigns: Campaign[] = [];
      querySnapshot.forEach((doc) => {
        const campaign = doc.data() as Campaign;
        if (!campaign.deletedAt) {
          campaigns.push(campaign);
        }
      });
      return campaigns;
    } catch (e) {
      Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Error finding all campaigns:", e);
      return [];
    }
  }

  async create(campaign: Campaign): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, campaign.id);
      await setDoc(docRef, campaign);
    } catch (e) {
      Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Error creating campaign:", e);
      throw e;
    }
  }

  async update(campaign: Campaign): Promise<void> {
    try {
      const docRef = doc(db, COLLECTION_NAME, campaign.id);
      await setDoc(docRef, campaign, { merge: true });
    } catch (e) {
      Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Error updating campaign:", e);
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
      Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("Error soft deleting campaign:", e);
      throw e;
    }
  }
}
