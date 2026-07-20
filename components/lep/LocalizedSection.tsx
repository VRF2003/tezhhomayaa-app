import React from "react";
import { ContentService } from "@/lib/lep/services/ContentService";
import { Market } from "@/lib/market/types";
import { SectionRegistry } from "./SectionRegistry";
import { adaptPayload } from "./PayloadAdapters";
import { SectionErrorState, SectionEmptyState } from "./SectionErrorState";
import { RuntimeContextBuilder } from "@/lib/preview/services/RuntimeContextBuilder";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { Observability } from "@/lib/infrastructure/observability";

interface LocalizedSectionProps {
  slug: string;
  market: Market;
  type: string;
  fallbackData?: any;
}

/**
 * Server Component that acts as the absolute boundary between the LEP backend
 * and the legacy frontend components.
 */
export default async function LocalizedSection({ slug, market, type, fallbackData }: LocalizedSectionProps) {
  const Component = SectionRegistry[type];
  
  // Read the GEE market ID from the cookie to enable language-aware content targeting
  const { cookies } = await import("next/headers");
  const cookieStore = await cookies();
  const geeMarketId = cookieStore.get("tz_gee_market_id")?.value;

  try {
    const runtime = await RuntimeContextBuilder.build();
    const variant = await ContentService.resolveContent(slug, market, runtime, geeMarketId);
    
    if (!variant) {
       if (fallbackData && Component) { 
         Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("LocalizedSection fallbackData:", fallbackData);
         return <Component cmsData={fallbackData} sectionId={slug} />;
       }
       return <SectionEmptyState slug={slug} type={type} />;
    }

    if (!Component) {
      return (
        <div className="p-8 text-red-500 bg-red-100 border border-red-500">
          Unregistered Section Type: {type}
        </div>
      );
    }

    // 1. Convert pure LEP payload to the legacy layout component's exact needs.
    const cmsData = adaptPayload(type, variant.payload);
    
    // 2. Render the generic UI component using Server-Side Rendering
    return (
      <>
        <AnalyticsTracker type="SECTION_VIEW" market={market} sectionId={slug} />
        <Component cmsData={cmsData} sectionId={slug} />
      </>
    );
  } catch (error) {
    Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")(`LEP Resolution Error for ${slug}:`, error);
    if (fallbackData && Component) {
      Observability.getLogger("System").info.bind(Observability.getLogger("System"), "Log")("LocalizedSection fallbackData:", fallbackData);
      return <Component cmsData={fallbackData} sectionId={slug} />;
    }
    return <SectionErrorState slug={slug} error={error as Error} />;
  }
}
