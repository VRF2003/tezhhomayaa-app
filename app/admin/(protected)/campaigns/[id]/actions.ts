"use server";

import { redirect } from "next/navigation";
import { FirestoreCampaignRepository } from "@/lib/lep/repositories/FirestoreCampaignRepository";
import { FirestoreContentItemRepository } from "@/lib/lep/repositories/FirestoreContentItemRepository";
import { ContentItem } from "@/lib/lep/core/types";

export async function saveCampaignAction(formData: FormData) {
  const id = formData.get("id") as string;
  const name = formData.get("name") as string;
  const description = formData.get("description") as string;
  const marketId = formData.get("marketId") as string;
  const regionId = formData.get("regionId") as string | null;
  const status = formData.get("status") as any;
  
  const validFromStr = formData.get("validFrom") as string;
  const validUntilStr = formData.get("validUntil") as string;
  const validFrom = validFromStr ? new Date(validFromStr).toISOString() : null;
  const validUntil = validUntilStr ? new Date(validUntilStr).toISOString() : null;
  
  
  const repo = new FirestoreCampaignRepository();
  const campaign = await repo.findById(id);
  
  if (campaign) {
    campaign.name = name;
    campaign.description = description;
    campaign.marketId = marketId;
    campaign.regionId = (marketId === "REGION" && regionId) ? regionId : undefined;
    if (status) campaign.status = status;
    campaign.validFrom = validFrom;
    campaign.validUntil = validUntil;
    
    // Parse dynamic sections array
    const newSections = [];
    let i = 0;
    const contentRepo = new FirestoreContentItemRepository();
    
    while (formData.has(`sections[${i}].id`)) {
      const secId = formData.get(`sections[${i}].id`) as string;
      const secCampId = formData.get(`sections[${i}].campaignId`) as string;
      const secSlug = formData.get(`sections[${i}].slug`) as string;
      const secType = formData.get(`sections[${i}].sectionType`) as string;
      let contentItemId = formData.get(`sections[${i}].contentItemId`) as string;
      
      const newContentTitle = formData.get(`sections[${i}].newContentTitle`) as string;
      const newContentImageUrl = formData.get(`sections[${i}].newContentImageUrl`) as string;
      const newContentCta1Label = formData.get(`sections[${i}].newContentCta1Label`) as string;
      const newContentCta1Url = formData.get(`sections[${i}].newContentCta1Url`) as string;
      const newContentCta2Label = formData.get(`sections[${i}].newContentCta2Label`) as string;
      const newContentCta2Url = formData.get(`sections[${i}].newContentCta2Url`) as string;
      const newContentCta3Label = formData.get(`sections[${i}].newContentCta3Label`) as string;
      const newContentCta3Url = formData.get(`sections[${i}].newContentCta3Url`) as string;
      
      // If we passed new content payloads OR it's a new section from the UI, we actually need to create a ContentItem in the mock repository!
      if (contentItemId.startsWith("new-content-") || newContentTitle || newContentImageUrl) {
        const generatedContentId = `ci-auto-${Date.now()}-${i}`;
        const newContent: ContentItem = {
          id: generatedContentId,
          name: newContentTitle || "Auto-generated Banner",
          slug: `auto-gen-${Date.now()}-${i}`,
          contentType: secType as any,
          createdBy: "admin",
          updatedBy: "admin",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          deletedAt: null,
          deletedBy: null,
          payload: {
            title: newContentTitle || "",
            desktopImage: newContentImageUrl || "",
            mobileImage: newContentImageUrl || "",
            cta1Label: newContentCta1Label || "",
            cta1Url: newContentCta1Url || "",
            cta2Label: newContentCta2Label || "",
            cta2Url: newContentCta2Url || "",
            cta3Label: newContentCta3Label || "",
            cta3Url: newContentCta3Url || "",
          }
        };
        await contentRepo.create(newContent);
        contentItemId = generatedContentId; // Assign the real ID
      }
      
      newSections.push({
        id: secId,
        campaignId: secCampId,
        slug: secSlug,
        sectionType: secType,
        contentItemId,
      });
      i++;
    }
    
    campaign.sections = newSections;
    campaign.updatedAt = new Date().toISOString();
    
    await repo.update(campaign);
  }

  // Simulate network delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  redirect("/admin/campaigns");
}

export async function deleteCampaignAction(formData: FormData) {
  const id = formData.get("id") as string;
  const repo = new FirestoreCampaignRepository();
  
  // Soft delete
  await repo.softDelete(id, "admin");

  await new Promise(resolve => setTimeout(resolve, 500));
  redirect("/admin/campaigns");
}
