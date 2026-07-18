export type ContentStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type ContentType = "BANNER" | "EDITORIAL" | "PRODUCT_INFO" | "HERO";

export interface AuditTrail {
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublishAudit {
  publishedBy: string;
  publishedAt: string;
  version: number;
}

export interface SoftDelete {
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface ContentItem extends AuditTrail, SoftDelete {
  id: string;
  name: string; // Added for Admin UI identification
  slug: string;
  contentType: ContentType;
  payload: Record<string, any>; // Moved payload here
}

export interface ContentVariant extends AuditTrail, PublishAudit, SoftDelete {
  id: string;
  contentItemId: string;
  
  // Market Targeting
  marketId: string; // e.g. "GLOBAL", or specific Market UUID (e.g. "mkt_bh")
  regionId?: string; // e.g. "Middle East"
  
  // Resolution controls
  status: ContentStatus;
  
  // Campaign Scheduling
  validFrom?: string | null; // ISO DateTime
  validUntil?: string | null; // ISO DateTime
  
  // Payload is now populated at runtime by CampaignService via mapping
  payload: Record<string, any>;
}
