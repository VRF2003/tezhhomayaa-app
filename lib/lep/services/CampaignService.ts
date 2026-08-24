import { Campaign, CampaignHealthStatus, CampaignStatus } from "../campaigns/types";
import { ContentVariant } from "../core/types";
import { ICampaignRepository } from "../repositories/ICampaignRepository";
import { IContentItemRepository } from "../repositories/IContentItemRepository";

export class CampaignService {
  constructor(
    private campaignRepo: ICampaignRepository,
    private contentItemRepo: IContentItemRepository
  ) {}

  /**
   * Health Check: Evaluates a campaign's readiness for publication.
   */
  async validateHealth(campaign: Campaign): Promise<CampaignHealthStatus> {
    const messages: string[] = [];
    let status: "HEALTHY" | "WARNING" | "INVALID" = "HEALTHY";

    if (campaign.validFrom && campaign.validUntil && campaign.validFrom > campaign.validUntil) {
      status = "INVALID";
      messages.push("End date cannot be before start date.");
    }

    if (!campaign.sections || campaign.sections.length === 0) {
      if (status !== "INVALID") status = "WARNING";
      messages.push("Campaign contains no sections. It will not render anything.");
    }

    for (const section of campaign.sections) {
      const item = await this.contentItemRepo.findById(section.contentItemId);
      if (!item) {
        status = "INVALID";
        messages.push(`Section '${section.slug}' references a missing or deleted ContentItem (${section.contentItemId}).`);
      }
    }

    if (campaign.marketId === "REGION" && !campaign.regionId) {
      status = "INVALID";
      messages.push("Market is set to Region, but no Region is specified.");
    }

    return { status, messages };
  }

  async publish(id: string, publishedBy: string): Promise<void> {
    const campaign = await this.campaignRepo.findById(id);
    if (!campaign) throw new Error("Campaign not found");
    if (campaign.status === "ARCHIVED") throw new Error("Cannot publish an archived campaign");

    const health = await this.validateHealth(campaign);
    if (health.status === "INVALID") {
      throw new Error(`Campaign is invalid and cannot be published: ${health.messages.join(", ")}`);
    }

    campaign.status = "PUBLISHED";
    campaign.publishedBy = publishedBy;
    campaign.publishedAt = new Date().toISOString();
    campaign.version = (campaign.version || 0) + 1;
    campaign.updatedBy = publishedBy;
    campaign.updatedAt = new Date().toISOString();

    await this.campaignRepo.update(campaign);
  }

  /**
   * Extracts and maps ContentVariants for the ContentResolver.
   * Applying tie-breaking sorts and mapping logic here keeps the repository pure.
   */
  async getMappedVariantsForSlug(slug: string): Promise<ContentVariant[]> {
    const campaigns = await this.campaignRepo.findAll();
    
    // No priority sorting — ContentResolver enforces strict Country > Region > Global hierarchy.
    // Within the same scope, most recently published wins (handled inside ContentResolver).

    const variants: ContentVariant[] = [];

    for (const campaign of campaigns) {
      // Find sections in this campaign that target the requested slug
      const matchingSections = campaign.sections.filter(s => s.slug === slug);
      
      for (const section of matchingSections) {
        const item = await this.contentItemRepo.findById(section.contentItemId);
        if (!item) continue; // Skip broken references

        // Ephemeral DTO mapping — pass marketId and regionId through as-is
        // ContentResolver uses these to bucket into Country / Region / Global
        variants.push({
          id: `variant-${campaign.id}-${section.id}`,
          contentItemId: item.id,
          marketId: campaign.marketId, // Pass through: "GLOBAL", "REGION", or "mkt_ae" etc.
          regionId: campaign.regionId ?? undefined, // Used by ContentResolver for region matching
          status: campaign.status as any,
          validFrom: campaign.validFrom,
          validUntil: campaign.validUntil,
          payload: item.payload,
          
          // Auditing fields
          createdAt: campaign.createdAt,
          updatedAt: campaign.updatedAt,
          createdBy: campaign.createdBy,
          updatedBy: campaign.updatedBy,
          publishedAt: campaign.publishedAt || campaign.updatedAt,
          publishedBy: campaign.publishedBy || campaign.updatedBy,
          version: campaign.version || 1,
          deletedAt: null,
          deletedBy: null
        });
      }
    }

    return variants;
  }
}
