import React from "react";
import { ContentService } from "@/lib/lep/services/ContentService";
import { Market } from "@/lib/market/types";
import { SectionRegistry } from "./SectionRegistry";
import { adaptPayload } from "./PayloadAdapters";
import { SectionErrorState, SectionEmptyState } from "./SectionErrorState";
import { RuntimeContextBuilder } from "@/lib/preview/services/RuntimeContextBuilder";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";

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

  try {
    const runtime = await RuntimeContextBuilder.build();
    const variant = await ContentService.resolveContent(slug, market, runtime);
    
    if (!variant) {
       if (fallbackData && Component) {
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
    console.error(`LEP Resolution Error for ${slug}:`, error);
    if (fallbackData && Component) {
      return <Component cmsData={fallbackData} sectionId={slug} />;
    }
    return <SectionErrorState slug={slug} error={error as Error} />;
  }
}
