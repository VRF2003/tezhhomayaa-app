/**
 * Abstract context defining the temporal and visibility state of the runtime.
 * All platform services (Campaigns, SEO, Translations) must consume this
 * instead of hardcoding `new Date()` or `status === 'PUBLISHED'`.
 */
export interface RuntimeContext {
  /** The current simulated or actual date of the system. */
  readonly currentDate: Date;
  
  /** Indicates if DRAFT content should be resolved (Preview Mode). */
  readonly draftContentEnabled: boolean;
  
  /** True if this context was generated via the Experience Preview Platform. */
  readonly isPreview: boolean;
  
  /** The unique ID of the preview session, if applicable. */
  readonly previewSessionId?: string;

  /** Check if a specific status is allowed by this runtime. */
  isStatusAllowed(status: string): boolean;
}

export class ProductionRuntimeContext implements RuntimeContext {
  get currentDate(): Date {
    return new Date();
  }

  get draftContentEnabled(): boolean {
    return false;
  }

  get isPreview(): boolean {
    return false;
  }

  isStatusAllowed(status: string): boolean {
    // Production strictly allows only PUBLISHED
    return status === "PUBLISHED";
  }
}

export class PreviewRuntimeContext implements RuntimeContext {
  constructor(
    public readonly currentDate: Date,
    public readonly draftContentEnabled: boolean,
    public readonly previewSessionId: string
  ) {}

  get isPreview(): boolean {
    return true;
  }

  isStatusAllowed(status: string): boolean {
    if (status === "PUBLISHED") return true;
    if (status === "DRAFT" && this.draftContentEnabled) return true;
    // ARCHIVED, PAUSED, etc. remain hidden even in preview for now unless explicitly added later.
    return false;
  }
}

/**
 * The raw JWT payload structure embedded in the signed URL.
 */
export interface PreviewJwtPayload {
  previewSessionId: string;
  marketId?: string;       // Overrides MarketCookie
  languageCode?: string;   // Overrides Language preference
  previewDate?: string;    // ISO Date string for Time Travel
  draftContentEnabled: boolean;
  exp: number;             // Expiration timestamp
}
