"use server";

import { redirect } from "next/navigation";
import { FirestoreCampaignRepository } from "@/lib/lep/repositories/FirestoreCampaignRepository";
import { Campaign } from "@/lib/lep/campaigns/types";
import { randomUUID } from "crypto";

export async function createCampaignAction() {
  const repo = new FirestoreCampaignRepository();
  
  const id = `camp-${Date.now()}`;
  
  const newCampaign: Campaign = {
    id,
    name: "Untitled Campaign",
    slug: `untitled-campaign-${Date.now()}`,
    description: "",
    status: "DRAFT",
    campaignType: "STANDARD",
    marketId: "GLOBAL",
    sections: [],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: "admin",
    updatedBy: "admin",
    deletedAt: null,
    deletedBy: null
  };
  
  await repo.create(newCampaign);
  
  // Navigate to the edit page for the newly created campaign
  redirect(`/admin/campaigns/${id}`);
}
