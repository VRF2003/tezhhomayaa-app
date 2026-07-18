import { Market } from "@/lib/market/types";
import { ContentResolver } from "../resolvers/ContentResolver";
import { ContentVariant } from "../core/types";
import { ContentResolutionError } from "../core/errors";
import { CampaignService } from "./CampaignService";
import { FirestoreCampaignRepository } from "../repositories/FirestoreCampaignRepository";
import { FirestoreContentItemRepository } from "../repositories/FirestoreContentItemRepository";
import { RuntimeContext, ProductionRuntimeContext } from "@/lib/preview/core/types";

export class ContentService {
  /**
   * Orchestrates the resolution of content for a specific market.
   * Handles future caching and data fetching via the Repository.
   */
  static async resolveContent(slug: string, market: Market, runtime: RuntimeContext = new ProductionRuntimeContext()): Promise<ContentVariant | null> {
    // 1. Fetch all mapped variants for the slug via Campaign Engine
    const campaignService = new CampaignService(
      new FirestoreCampaignRepository(),
      new FirestoreContentItemRepository()
    );
    const variants = await campaignService.getMappedVariantsForSlug(slug);

    if (!variants || variants.length === 0) {
      return null;
    }

    // 2. Resolve best variant for the active market
    const resolvedVariant = ContentResolver.resolve(market, variants, runtime);

    if (!resolvedVariant) {
      return null;
    }

    // Future Cache Design:
    // const cacheKey = `lep:content:${slug}:${market.id}:${market.language}:${resolvedVariant.version}`;
    // await Cache.set(cacheKey, resolvedVariant);

    return resolvedVariant;
  }
}
