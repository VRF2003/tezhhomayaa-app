import { ITranslationRepository } from "@/lib/translations/repositories/ITranslationRepository";
import { TranslationSet } from "@/lib/translations/core/types";
import { IDatabaseDriver } from "../../drivers/IDatabaseDriver";
import { ReadThroughStrategy } from "../../../cache/strategies/ReadThroughStrategy";
import { CacheProfiles } from "../../../cache/core/CacheProfile";
import { CacheKeyFactory, CACHE_TAGS } from "../../../cache/core/CacheKeyFactory";
import { InvalidationManager } from "../../../cache/invalidation/InvalidationManager";

export class TranslationRepository implements ITranslationRepository {
  private collection = "translation_sets";

  constructor(private driver: IDatabaseDriver) {}

  async findById(id: string): Promise<TranslationSet | null> {
    const cacheKey = CacheKeyFactory.create('translation', 'set', `id_${id}`);
    return ReadThroughStrategy.execute<TranslationSet | null>(
      cacheKey,
      CacheProfiles.LONG_LIVED,
      [CACHE_TAGS.TRANSLATION],
      async () => {
        const data = await this.driver.read(this.collection, id);
        return data ? (data as TranslationSet) : null;
      }
    );
  }

  async findAll(): Promise<TranslationSet[]> {
    const cacheKey = CacheKeyFactory.createList('translation', 'set');
    return ReadThroughStrategy.execute<TranslationSet[]>(
      cacheKey,
      CacheProfiles.LONG_LIVED,
      [CACHE_TAGS.TRANSLATION],
      async () => {
        return this.driver.query(this.collection);
      }
    );
  }

  async findByNamespace(namespace: string): Promise<TranslationSet[]> {
    const cacheKey = CacheKeyFactory.create('translation', 'set', `ns_${namespace}`);
    return ReadThroughStrategy.execute<TranslationSet[]>(
      cacheKey,
      CacheProfiles.LONG_LIVED,
      [CACHE_TAGS.TRANSLATION],
      async () => {
        return this.driver.query(this.collection, { namespace });
      }
    );
  }

  async create(set: TranslationSet): Promise<void> {
    await this.driver.write(this.collection, set.id, set);
    await InvalidationManager.invalidateTags([CACHE_TAGS.TRANSLATION]);
  }

  async update(set: TranslationSet): Promise<void> {
    await this.driver.write(this.collection, set.id, set);
    await InvalidationManager.invalidateTags([CACHE_TAGS.TRANSLATION]);
  }

  async softDelete(id: string, deletedBy: string): Promise<void> {
    const set = await this.findById(id);
    if (set) {
      set.status = "ARCHIVED";
      await this.update(set);
      await InvalidationManager.invalidateTags([CACHE_TAGS.TRANSLATION]);
    }
  }
}
