import { TranslationEntry, TranslationSet } from "../core/types";
import { Market } from "@/lib/market/types";
import { RuntimeContext } from "@/lib/preview/core/types";

export class TranslationResolver {
  /**
   * Pure resolution logic for a specific language and market.
   * Returns a merged dictionary of { [key]: value }.
   */
  static resolveNamespace(
    languageCode: string,
    market: Market,
    sets: TranslationSet[],
    runtime: RuntimeContext
  ): Record<string, string> {
    const now = runtime.currentDate;

    // 1. Filter out invalid Sets
    const validSets = sets.filter(s => {
      if (!runtime.isStatusAllowed(s.status)) return false;
      if (s.deletedAt) return false;
      if (s.validFrom && new Date(s.validFrom) > now) return false;
      if (s.validUntil && new Date(s.validUntil) < now) return false;
      return true;
    });

    // 2. Sort Sets by Priority (ASC) so higher priority overrides lower when merged later.
    // Also PublishedAt (ASC) for tie-breaking (newer wins, so it's applied last).
    validSets.sort((a, b) => {
      if (a.priority !== b.priority) {
        return a.priority - b.priority;
      }
      const aPub = a.publishedAt ? new Date(a.publishedAt).getTime() : 0;
      const bPub = b.publishedAt ? new Date(b.publishedAt).getTime() : 0;
      return aPub - bPub;
    });

    const result: Record<string, string> = {};

    // 3. Extract and Merge Entries
    // Hierarchy (Applied from lowest to highest so higher overwrites):
    // 1. Global matching language
    // 2. Region matching language
    // 3. Market matching language

    for (const set of validSets) {
      // 3a. Global
      for (const entry of set.entries) {
        if (entry.languageCode === languageCode && entry.marketId === "GLOBAL") {
          result[entry.translationKey] = entry.value;
        }
      }
    }

    for (const set of validSets) {
      // 3b. Region
      for (const entry of set.entries) {
        if (entry.languageCode === languageCode && entry.marketId === "REGION" && entry.regionId === market.region) {
          result[entry.translationKey] = entry.value;
        }
      }
    }

    for (const set of validSets) {
      // 3c. Market
      for (const entry of set.entries) {
        if (entry.languageCode === languageCode && entry.marketId === market.id) {
          result[entry.translationKey] = entry.value;
        }
      }
    }

    return result;
  }
}
