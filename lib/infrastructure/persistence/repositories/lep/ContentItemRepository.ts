import { IContentItemRepository } from "@/lib/lep/repositories/IContentItemRepository";
import { ContentItem } from "@/lib/lep/core/types";
import { IDatabaseDriver } from "../../drivers/IDatabaseDriver";
import { ReadThroughStrategy } from "../../../cache/strategies/ReadThroughStrategy";
import { CacheProfiles } from "../../../cache/core/CacheProfile";
import { CacheKeyFactory, CACHE_TAGS } from "../../../cache/core/CacheKeyFactory";
import { InvalidationManager } from "../../../cache/invalidation/InvalidationManager";

export class ContentItemRepository implements IContentItemRepository {
  private collection = "lep_content_items";

  constructor(private driver: IDatabaseDriver) {}

  async findById(id: string): Promise<ContentItem | null> {
    const cacheKey = CacheKeyFactory.create('lep', 'content_item', id);
    return ReadThroughStrategy.execute<ContentItem | null>(
      cacheKey,
      CacheProfiles.VOLATILE,
      [CACHE_TAGS.COLLECTION], // Map content items to collection
      async () => {
        const data = await this.driver.read(this.collection, id);
        return data ? (data as ContentItem) : null;
      }
    );
  }

  async findAll(): Promise<ContentItem[]> {
    const cacheKey = CacheKeyFactory.createList('lep', 'content_item');
    return ReadThroughStrategy.execute<ContentItem[]>(
      cacheKey,
      CacheProfiles.VOLATILE,
      [CACHE_TAGS.COLLECTION],
      async () => {
        return this.driver.query(this.collection);
      }
    );
  }

  async create(item: ContentItem): Promise<void> {
    await this.driver.write(this.collection, item.id, item);
    await InvalidationManager.invalidateTags([CACHE_TAGS.COLLECTION]);
  }

  async update(item: ContentItem): Promise<void> {
    await this.driver.write(this.collection, item.id, item);
    await InvalidationManager.invalidateTags([CACHE_TAGS.COLLECTION]);
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const item = await this.findById(id);
    if (item) {
      item.deletedAt = new Date().toISOString();
      item.deletedBy = deletedBy;
      await this.update(item);
      await InvalidationManager.invalidateTags([CACHE_TAGS.COLLECTION]);
    }
  }
}
