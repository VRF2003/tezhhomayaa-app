import { ISeoRepository } from "@/lib/seo/repositories/ISeoRepository";
import { SeoMetadata } from "@/lib/seo/core/types";
import { IDatabaseDriver } from "../../drivers/IDatabaseDriver";
import { ReadThroughStrategy } from "../../../cache/strategies/ReadThroughStrategy";
import { CacheProfiles } from "../../../cache/core/CacheProfile";
import { CacheKeyFactory, CACHE_TAGS } from "../../../cache/core/CacheKeyFactory";
import { InvalidationManager } from "../../../cache/invalidation/InvalidationManager";

export class SeoRepository implements ISeoRepository {
  private collection = "seo_metadata";

  constructor(private driver: IDatabaseDriver) {}

  async findById(id: string): Promise<SeoMetadata | null> {
    const cacheKey = CacheKeyFactory.create('seo', 'metadata', `id_${id}`);
    return ReadThroughStrategy.execute<SeoMetadata | null>(
      cacheKey,
      CacheProfiles.LONG_LIVED,
      [CACHE_TAGS.SEO],
      async () => {
        const data = await this.driver.read(this.collection, id);
        return data ? (data as SeoMetadata) : null;
      }
    );
  }

  async findBySlug(slug: string): Promise<SeoMetadata[]> {
    const cacheKey = CacheKeyFactory.create('seo', 'metadata', `slug_${slug}`);
    return ReadThroughStrategy.execute<SeoMetadata[]>(
      cacheKey,
      CacheProfiles.LONG_LIVED,
      [CACHE_TAGS.SEO],
      async () => {
        return this.driver.query(this.collection, { slug });
      }
    );
  }

  async findAll(): Promise<SeoMetadata[]> {
    const cacheKey = CacheKeyFactory.createList('seo', 'metadata');
    return ReadThroughStrategy.execute<SeoMetadata[]>(
      cacheKey,
      CacheProfiles.LONG_LIVED,
      [CACHE_TAGS.SEO],
      async () => {
        return this.driver.query(this.collection);
      }
    );
  }

  async create(metadata: SeoMetadata): Promise<void> {
    await this.driver.write(this.collection, metadata.id, metadata);
    await InvalidationManager.invalidateTags([CACHE_TAGS.SEO]);
  }

  async update(metadata: SeoMetadata): Promise<void> {
    await this.driver.write(this.collection, metadata.id, metadata);
    await InvalidationManager.invalidateTags([CACHE_TAGS.SEO]);
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const metadata = await this.findById(id);
    if (metadata) {
      metadata.status = "ARCHIVED";
      await this.update(metadata);
      await InvalidationManager.invalidateTags([CACHE_TAGS.SEO]);
    }
  }
}
