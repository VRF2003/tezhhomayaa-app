export interface AuditTrail {
  createdAt: string;
  updatedAt: string;
  createdBy: string;
  updatedBy: string;
}

export interface SoftDelete {
  deletedAt: string | null;
  deletedBy: string | null;
}

export interface PublishAudit {
  publishedAt?: string;
  publishedBy?: string;
  version?: number;
}

export type SeoStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export interface SeoMetadata extends AuditTrail, Partial<PublishAudit>, SoftDelete {
  id: string;
  slug: string;           // The route this SEO data applies to (e.g. "homepage", "collection/fall")
  
  // Resolution Targeting
  marketId: string;       // e.g. "GLOBAL", "REGION", "mkt_bh"
  regionId?: string;      // e.g. "Middle East"
  languageId?: string;    // Future-ready
  priority: number;
  status: SeoStatus;
  validFrom?: string | null;
  validUntil?: string | null;

  // Metadata Core
  title?: string;
  description?: string;
  keywords?: string;
  canonicalUrl?: string;
  robots?: string;
  
  // Open Graph
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  
  // Twitter
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  
  // Advanced
  structuredData?: Record<string, any>;
  hreflang?: Record<string, string>; // Future-ready: { "en-BH": "url", "ar-AE": "url" }
}
