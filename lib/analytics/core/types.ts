export type EventType = "PAGE_VIEW" | "SECTION_VIEW" | "CAMPAIGN_VIEW" | "PREVIEW_VIEW";

export interface AnalyticsEvent {
  eventId: string;
  eventType: EventType;
  eventVersion: string; // e.g., "1.0"
  timestamp: string; // ISO-8601
  experienceId: string; // Composite ID of market + language + campaign + layout
  marketId: string;
  regionId: string;
  languageCode: string;
  campaignId?: string;
  sectionId?: string;
  pageId?: string;
  sessionId: string;
  userType: "GUEST" | "AUTHENTICATED";
  deviceType: "DESKTOP" | "MOBILE" | "TABLET" | "UNKNOWN";
  source: string; // e.g., URL or referer
}

export interface AnalyticsDashboardReport {
  totalViews: number;
  viewsByMarket: Record<string, number>;
  viewsByLanguage: Record<string, number>;
  viewsByCampaign: Record<string, number>;
  viewsBySection: Record<string, number>;
  viewsByDevice: Record<string, number>;
  previewActivity: number; // Count of PREVIEW_VIEW events
}

export interface AggregationFilter {
  marketId?: string;
  languageCode?: string;
  campaignId?: string;
  startDate?: string;
  endDate?: string;
}
