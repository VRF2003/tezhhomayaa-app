import { Market } from "@/lib/market/types";
import { ContentResolver } from "../resolvers/ContentResolver";
import { ContentVariant } from "../core/types";
import { ContentResolutionError } from "../core/errors";
import { CampaignService } from "./CampaignService";
import { ICampaignRepository } from "../repositories/ICampaignRepository";
import { IContentItemRepository } from "../repositories/IContentItemRepository";
import { RepositoryResolver } from "../../infrastructure/persistence/resolver/RepositoryResolver";
import { RuntimeContext, ProductionRuntimeContext } from "@/lib/preview/core/types";

export class ContentService {
  private static instance: CampaignService;

  /**
   * Orchestrates the resolution of content for a specific market.
   * Handles future caching and data fetching via the Repository.
   */
  static async resolveContent(slug: string, market: Market, runtime: RuntimeContext = new ProductionRuntimeContext(), geeMarketId?: string): Promise<ContentVariant | null> {
    // 1. Fetch all mapped variants for the slug
    if (!ContentService.instance) {
      ContentService.instance = new CampaignService(
        RepositoryResolver.resolve<ICampaignRepository>("ICampaignRepository"),
        RepositoryResolver.resolve<IContentItemRepository>("IContentItemRepository")
      );
    }
    const variants = await ContentService.instance.getMappedVariantsForSlug(slug);

    if (!variants || variants.length === 0) {
      return null;
    }

    // 2. Resolve best variant for the active market
    const resolvedVariant = ContentResolver.resolve(market, variants, runtime, geeMarketId);

    if (!resolvedVariant) {
      return null;
    }

    // Future Cache Design:
    // const cacheKey = `lep:content:${slug}:${market.id}:${market.language}:${resolvedVariant.version}`;
    // await Cache.set(cacheKey, resolvedVariant);

    return resolvedVariant;
  }
}
