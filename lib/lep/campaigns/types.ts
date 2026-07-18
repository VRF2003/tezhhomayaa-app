import { AuditTrail, PublishAudit, SoftDelete, ContentItem } from "../core/types";

export type CampaignStatus = "DRAFT" | "SCHEDULED" | "PUBLISHED" | "PAUSED" | "EXPIRED" | "ARCHIVED";

export type CampaignHealth = "HEALTHY" | "WARNING" | "INVALID";

export interface CampaignHealthStatus {
  status: CampaignHealth;
  messages: string[];
}

export interface Campaign extends AuditTrail, Partial<PublishAudit>, SoftDelete {
  id: string;
  name: string;
  slug: string;
  description: string;
  
  status: CampaignStatus;
  campaignType: string;
  
  // Targeting
  marketId: string;
  regionId?: string;
  languageId?: string;
  
  // Scheduling
  validFrom?: string | null;
  validUntil?: string | null;
  
  // Relationships
  sections: CampaignSection[];
}

export interface CampaignSection {
  id: string;
  campaignId: string;
  slug: string; // The UI placement slug, e.g., "hero-banner-summer"
  sectionType: string; // "HERO", "EDITORIAL", etc.
  contentItemId: string; // Reference to the actual payload
}


