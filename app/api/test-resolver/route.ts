export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { ContentResolver } from "@/lib/lep/resolvers/ContentResolver";
import { ProductionRuntimeContext } from "@/lib/preview/core/types";
import { MarketService, MARKETS } from "@/lib/market/MarketService";
import { ContentVariant } from "@/lib/lep/core/types";

export async function GET(request: Request) {
  const runtime = new ProductionRuntimeContext();

  const variants: ContentVariant[] = [
    {
      id: "var-middle-east",
      contentItemId: "ci-2",
      marketId: "REGION",
      regionId: "Middle East",
      status: "PUBLISHED",
      priority: 50,
      publishedAt: "2026-07-02T00:00:00Z",
      validFrom: null,
      validUntil: null,
      deletedAt: null,
      payload: { name: "Middle East Banner" }
    }
  ] as any[];

  const results: Record<string, string> = {};
  for (const m of MARKETS) {
    results[m.country] = ContentResolver.resolve(m, variants, runtime)?.id || "NULL";
  }

  return NextResponse.json(results);
}
