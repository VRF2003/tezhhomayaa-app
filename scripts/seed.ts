import { FirestoreCampaignRepository } from "@/lib/lep/repositories/FirestoreCampaignRepository";
import { FirestoreContentItemRepository } from "@/lib/lep/repositories/FirestoreContentItemRepository";
import { Campaign } from "@/lib/lep/campaigns/types";
import { ContentItem } from "@/lib/lep/core/types";

async function seed() {
  try {
    console.log("Starting seed process...");
    const campaignRepo = new FirestoreCampaignRepository();
    const contentRepo = new FirestoreContentItemRepository();

    const indianSummerHeroContent: ContentItem = {
      id: "ci-indian-summer-hero",
      name: "Indian Summer Hero Banner",
      slug: "indian-summer-hero",
      contentType: "HERO",
      createdBy: "admin",
      updatedBy: "admin",
      createdAt: "2026-07-17T08:44:00.000Z",
      updatedAt: "2026-07-17T14:00:00.000Z",
      deletedAt: null,
      deletedBy: null,
      payload: {
        title: "Indian Summer",
        subtitle: "A Season of Luxury",
        description: "Discover the finest pieces curated for the Indian Summer season.",
        primaryCta: "Explore Collection",
        primaryCtaUrl: "/collections/indian-summer",
        desktopImage: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=2070&auto=format&fit=crop",
        mobileImage: "https://images.unsplash.com/photo-1549439602-43ebca2327af?q=80&w=1000&auto=format&fit=crop"
      }
    };

    const indianSummerCampaign: Campaign = {
      id: "camp-indian-summer",
      name: "Indian Summer",
      slug: "indian-summer",
      description: "Indian summer default campaign",
      status: "PUBLISHED",
      campaignType: "PROMOTIONAL",
      marketId: "GLOBAL",
      validFrom: "2026-07-17T00:00:00.000Z",
      validUntil: "2026-07-30T23:59:59.000Z",
      createdBy: "admin",
      updatedBy: "admin",
      publishedBy: "admin",
      publishedAt: "2026-07-17T14:00:00.000Z",
      version: 1,
      createdAt: "2026-07-17T08:44:00.000Z",
      updatedAt: "2026-07-17T14:00:00.000Z",
      deletedAt: null,
      deletedBy: null,
      sections: [
        {
          id: "sec-indian-summer-hero",
          campaignId: "camp-indian-summer",
          slug: "home-hero-banner",
          sectionType: "HERO_BANNER",
          contentItemId: "ci-indian-summer-hero"
        }
      ]
    };

    console.log("Checking for existing campaign...");
    // First, verify if they already exist
    const existingCampaign = await campaignRepo.findById(indianSummerCampaign.id);
    const existingContent = await contentRepo.findById(indianSummerHeroContent.id);

    if (!existingCampaign) {
      console.log("Creating campaign...");
      await campaignRepo.create(indianSummerCampaign);
    } else {
      console.log("Updating campaign...");
      await campaignRepo.update(indianSummerCampaign);
    }

    if (!existingContent) {
      console.log("Creating content...");
      await contentRepo.create(indianSummerHeroContent);
    } else {
      console.log("Updating content...");
      await contentRepo.update(indianSummerHeroContent);
    }

    console.log("Firestore seeded successfully.");
    process.exit(0);
  } catch (error: any) {
    console.error("Seed error:", error);
    process.exit(1);
  }
}

seed();
