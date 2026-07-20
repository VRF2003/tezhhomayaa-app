import { ICampaignRepository } from "@/lib/lep/repositories/ICampaignRepository";
import { Campaign } from "@/lib/lep/campaigns/types";
import { IDatabaseDriver } from "../../drivers/IDatabaseDriver";
import { ReadThroughStrategy } from "../../../cache/strategies/ReadThroughStrategy";
import { CacheProfiles } from "../../../cache/core/CacheProfile";
import { CacheKeyFactory, CACHE_TAGS } from "../../../cache/core/CacheKeyFactory";
import { InvalidationManager } from "../../../cache/invalidation/InvalidationManager";

export class CampaignRepository implements ICampaignRepository {
  private collection = "lep_campaigns";

  constructor(private driver: IDatabaseDriver) {}

  async findById(id: string): Promise<Campaign | null> {
    const cacheKey = CacheKeyFactory.create('lep', 'campaign', id);
    return ReadThroughStrategy.execute<Campaign | null>(
      cacheKey,
      CacheProfiles.VOLATILE,
      [CACHE_TAGS.CAMPAIGN],
      async () => {
        const data = await this.driver.read(this.collection, id);
        return data ? (data as Campaign) : null;
      }
    );
  }

  async findAll(): Promise<Campaign[]> {
    const cacheKey = CacheKeyFactory.createList('lep', 'campaign');
    return ReadThroughStrategy.execute<Campaign[]>(
      cacheKey,
      CacheProfiles.VOLATILE,
      [CACHE_TAGS.CAMPAIGN],
      async () => {
        return this.driver.query(this.collection);
      }
    );
  }

  async create(campaign: Campaign): Promise<void> {
    await this.driver.write(this.collection, campaign.id, campaign);
    await InvalidationManager.invalidateTags([CACHE_TAGS.CAMPAIGN]);
  }

  async update(campaign: Campaign): Promise<void> {
    await this.driver.write(this.collection, campaign.id, campaign);
    await InvalidationManager.invalidateTags([CACHE_TAGS.CAMPAIGN]);
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const campaign = await this.findById(id);
    if (campaign) {
      campaign.status = "Archived";
      await this.update(campaign);
      await InvalidationManager.invalidateTags([CACHE_TAGS.CAMPAIGN]);
    }
  }
}
