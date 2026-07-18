import { SeoMetadata } from "../core/types";
import { Market } from "@/lib/market/types";
import { RuntimeContext } from "@/lib/preview/core/types";

export class SeoResolver {
  /**
   * Pure resolution logic.
   * Returns a tuple of [globalWinner, regionWinner, marketWinner] 
   * so the service can merge them for field-level inheritance.
   */
  static resolveHierarchy(market: Market, variants: SeoMetadata[], runtime: RuntimeContext): [SeoMetadata | null, SeoMetadata | null, SeoMetadata | null] {
    const now = runtime.currentDate;

    // 1. Filter out invalid
    const validVariants = variants.filter(v => {
      if (!runtime.isStatusAllowed(v.status)) return false;
      if (v.deletedAt) return false;
      if (v.validFrom && new Date(v.validFrom) > now) return false;
      if (v.validUntil && new Date(v.validUntil) < now) return false;
      return true;
    });

    // 2. Sort by Priority (DESC), then PublishedAt (DESC) for tie-breaking
    validVariants.sort((a, b) => {
      if (a.priority !== b.priority) {
        return b.priority - a.priority;
      }
      const aPub = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bPub = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bPub - aPub;
    });

    // 3. Bucket them
    const globalVariants = validVariants.filter(v => v.marketId === "GLOBAL");
    const regionVariants = validVariants.filter(v => v.marketId === "REGION" && v.regionId === market.region);
    const marketVariants = validVariants.filter(v => v.marketId === market.id);

    // 4. Take the top winner from each bucket
    const globalWinner = globalVariants.length > 0 ? globalVariants[0] : null;
    const regionWinner = regionVariants.length > 0 ? regionVariants[0] : null;
    const marketWinner = marketVariants.length > 0 ? marketVariants[0] : null;

    return [globalWinner, regionWinner, marketWinner];
  }
}
