"use client";

import { useEffect, useRef } from "react";
import { EventType } from "@/lib/analytics/core/types";
import { Market } from "@/lib/market/types";
import { Observability } from "@/lib/infrastructure/observability";

interface AnalyticsTrackerProps {
  type: EventType;
  market: Market;
  pageId?: string;
  sectionId?: string;
  campaignId?: string;
}

export function AnalyticsTracker({
  type,
  market,
  pageId,
  sectionId,
  campaignId,
}: AnalyticsTrackerProps) {
  const trackedRef = useRef(false);

  useEffect(() => {
    // Only track once per mount to prevent double-firing in React StrictMode
    if (trackedRef.current) return;
    trackedRef.current = true;

    // We use sendBeacon if available for non-blocking telemetry, fallback to fetch
    const payload = {
      eventType: type,
      marketId: market.id,
      regionId: market.region,
      languageCode: market.language, // Fixed TS error
      pageId,
      sectionId,
      campaignId,
      // sessionId and userType would be pulled from client state in a real app
    };

    const url = "/api/analytics/track";
    const data = JSON.stringify(payload);

    try {
      if (navigator.sendBeacon) {
        // sendBeacon doesn't inherently set Content-Type: application/json well in all browsers,
        // but since our API reads text/plain as JSON or we can use Blob.
        const blob = new Blob([data], { type: "application/json" });
        navigator.sendBeacon(url, blob);
      } else {
        fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: data,
          keepalive: true, // Allow request to complete even if user navigates away
        });
      }
    } catch (e) {
      Observability.getLogger("System").warn.bind(Observability.getLogger("System"), "Warn")("AnalyticsTracker failed to send beacon", e);
    }
  }, [type, market, pageId, sectionId, campaignId]);

  // The tracker is an invisible observer
  return null;
}
