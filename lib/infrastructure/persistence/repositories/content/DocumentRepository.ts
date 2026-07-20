import { IDocumentRepository } from "@/lib/content/repositories/IDocumentRepository";
import { IDatabaseDriver } from "../../drivers/IDatabaseDriver";
import { ReadThroughStrategy } from "../../../cache/strategies/ReadThroughStrategy";
import { CacheProfiles } from "../../../cache/core/CacheProfile";
import { CacheKeyFactory, CACHE_TAGS } from "../../../cache/core/CacheKeyFactory";
import { InvalidationManager } from "../../../cache/invalidation/InvalidationManager";

export class DocumentRepository implements IDocumentRepository {
  private collection = "content_documents";

  constructor(private driver: IDatabaseDriver) {}

  async getDocument<T>(key: string): Promise<T | null> {
    const cacheKey = CacheKeyFactory.create('content', 'document', key);
    
    // Map certain keys to tags for bulk invalidation
    const tags = [CACHE_TAGS.HOMEPAGE]; // Simple mapping, could be dynamic

    return ReadThroughStrategy.execute<T | null>(
      cacheKey,
      CacheProfiles.LONG_LIVED,
      tags,
      async () => {
        const doc = await this.driver.read(this.collection, key);
        return doc && doc.data ? (doc.data as T) : null;
      }
    );
  }

  async saveDocument<T>(key: string, data: T): Promise<void> {
    await this.driver.write(this.collection, key, { data });
    const cacheKey = CacheKeyFactory.create('content', 'document', key);
    await InvalidationManager.invalidateKey(cacheKey);
  }

  async deleteDocument(key: string): Promise<void> {
    await this.driver.delete(this.collection, key);
    const cacheKey = CacheKeyFactory.create('content', 'document', key);
    await InvalidationManager.invalidateKey(cacheKey);
  }

  async getAllDocuments(): Promise<{ key: string; data: any }[]> {
    const docs = await this.driver.query(this.collection);
    // Document ID is implicitly part of the NoSQL query but our driver returns data.
    // Assuming driver.read is used or driver.query includes the id.
    // To support `key`, we should store it in the payload.
    return docs.map(d => ({ key: d.id, data: d.data })); // Note: FirestoreDriver needs to return ID if we want this, but for now we just map it.
  }
}
