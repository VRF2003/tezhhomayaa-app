import { ContentVariant } from "../core/types";
import { Market } from "@/lib/market/types";
import { RuntimeContext } from "@/lib/preview/core/types";

export class ContentResolver {
  /**
   * Resolves the best ContentVariant for a given Market.
   *
   * Strict Hierarchy (no priority numbers — scope wins):
   * 1. COUNTRY  — exact marketId match → user sees their specific country banner
   * 2. REGION   — regionId matches current market's region → regional banner for all countries without a country-specific one
   * 3. GLOBAL   — fallback shown everywhere that has no country or region banner
   *
   * Within the same scope level, the most recently published variant wins.
   */
  static resolve(
    currentMarket: Market,
    variants: ContentVariant[],
    runtime: RuntimeContext
  ): ContentVariant | null {
    const now = runtime.currentDate.toISOString();

    // Step 1: Filter only valid (published/allowed, active dates, not deleted)
    const validVariants = variants.filter(v => {
      if (!runtime.isStatusAllowed(v.status)) return false;
      if (v.deletedAt !== null) return false;
      if (v.validFrom && v.validFrom > now) return false;
      if (v.validUntil && v.validUntil < now) return false;
      return true;
    });

    if (validVariants.length === 0) return null;

    // Step 2: Bucket by scope — a variant belongs to exactly ONE bucket
    const countryMatches: ContentVariant[] = [];
    const regionMatches: ContentVariant[] = [];
    const globalMatches: ContentVariant[] = [];

    validVariants.forEach(v => {
      if (v.marketId === currentMarket.id) {
        // COUNTRY: exact match — bound to this country only
        countryMatches.push(v);
      } else if (
        v.marketId === "REGION" &&
        v.regionId &&
        v.regionId === currentMarket.region
      ) {
        // REGION: matches the region, AND the current market has no country-specific banner
        regionMatches.push(v);
      } else if (v.marketId === "GLOBAL") {
        // GLOBAL: shown everywhere with no country or region banner
        globalMatches.push(v);
      }
      // Any other marketId (different country) is ignored — stays in its own bucket
    });

    // Tie-breaker within the same scope: most recently published wins
    const newestFirst = (a: ContentVariant, b: ContentVariant) => {
      const aTime = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bTime = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return bTime - aTime;
    };

    // Step 3: Return in strict hierarchy order
    // Country-specific banner ALWAYS wins — even if a regional or global banner exists
    if (countryMatches.length > 0) {
      return countryMatches.sort(newestFirst)[0];
    }

    // Region banner wins over global — but ONLY if no country banner exists
    if (regionMatches.length > 0) {
      return regionMatches.sort(newestFirst)[0];
    }

    // Global fallback — only shown if neither country nor region banner exists
    if (globalMatches.length > 0) {
      return globalMatches.sort(newestFirst)[0];
    }

    return null;
  }
}
