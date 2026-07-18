import { NextRequest, NextResponse } from "next/server";
import { AnalyticsEvent } from "@/lib/analytics/core/types";
import { GlobalEventBus } from "@/lib/analytics/events/EventBus";
import { randomUUID } from "crypto";
// Import the index to ensure Singletons (like AnalyticsService subscriber) initialize
import "@/lib/analytics"; 

export async function POST(request: NextRequest) {
  try {
    const payload = await request.json();
    
    // Construct the canonical ExperienceId (hash or composite string)
    // Ensures all reporting can tie an event back to a specific permutation.
    const experienceId = `${payload.marketId || "UNKNOWN"}_${payload.languageCode || "UNKNOWN"}_${payload.campaignId || "NONE"}`;

    const event: AnalyticsEvent = {
      eventId: randomUUID(),
      eventType: payload.eventType,
      eventVersion: "1.0",
      timestamp: new Date().toISOString(),
      experienceId,
      marketId: payload.marketId,
      regionId: payload.regionId || "UNKNOWN",
      languageCode: payload.languageCode,
      campaignId: payload.campaignId,
      sectionId: payload.sectionId,
      pageId: payload.pageId,
      sessionId: payload.sessionId || "anonymous-session",
      userType: payload.userType || "GUEST",
      deviceType: "DESKTOP", // In a real app, parse User-Agent
      source: request.headers.get("referer") || "direct",
    };

    // Fire and forget onto the Event Bus
    GlobalEventBus.publish(event);

    // Immediately respond with 202 Accepted. We do not wait for storage.
    return NextResponse.json({ success: true }, { status: 202 });
  } catch (err) {
    // 400 Bad Request, but never crashes the user's frontend.
    return NextResponse.json({ success: false, error: "Bad Payload" }, { status: 400 });
  }
}
