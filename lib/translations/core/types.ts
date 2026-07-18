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

export type TranslationStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";

export type TranslationHealthStatus = "HEALTHY" | "WARNING" | "INVALID";

export interface TranslationHealth {
  status: TranslationHealthStatus;
  messages: string[];
}

export interface TranslationEntry extends AuditTrail, SoftDelete {
  id: string;
  namespace: string;       // e.g. "homepage", "checkout", "common"
  translationKey: string;  // e.g. "hero.title", "button.save"
  
  // Resolution Targeting
  languageCode: string;    // e.g. "en", "ar", "fr"
  marketId?: string;       // e.g. "GLOBAL", "mkt_bh"
  regionId?: string;       // e.g. "Middle East"
  
  value: string;           // e.g. "Hello {name}", "Bienvenue"
}

export interface TranslationSet extends AuditTrail, Partial<PublishAudit>, SoftDelete {
  id: string;
  name: string;
  description?: string;
  
  status: TranslationStatus;
  priority: number;
  
  validFrom?: string | null;
  validUntil?: string | null;

  entries: TranslationEntry[];
  health?: TranslationHealth; // Computed before publish
}
