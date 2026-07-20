import { ICacheProvider } from '../core/ICacheProvider';
import { CacheItem } from '../core/ICacheProvider';
import { CacheTag } from '../core/CacheKeyFactory';

export class MemoryCacheProvider implements ICacheProvider {
  private cache = new Map<string, CacheItem<any>>();
  private tagIndex = new Map<CacheTag, Set<string>>();

  async get<T>(key: string): Promise<T | null> {
    const item = this.cache.get(key);
    if (!item) return null;
    
    if (Date.now() > item.expiresAt) {
      await this.invalidate(key);
      return null;
    }
    
    return item.value as T;
  }

  async set<T>(key: string, value: T, ttlSeconds: number, tags: CacheTag[] = []): Promise<void> {
    const expiresAt = Date.now() + ttlSeconds * 1000;
    
    this.cache.set(key, { value, tags, expiresAt });
    
    for (const tag of tags) {
      if (!this.tagIndex.has(tag)) {
        this.tagIndex.set(tag, new Set());
      }
      this.tagIndex.get(tag)!.add(key);
    }
  }

  async invalidate(key: string): Promise<void> {
    const item = this.cache.get(key);
    if (item) {
      for (const tag of item.tags) {
        this.tagIndex.get(tag)?.delete(key);
      }
      this.cache.delete(key);
    }
  }

  async invalidateByTag(tag: CacheTag): Promise<void> {
    const keys = this.tagIndex.get(tag);
    if (keys) {
      for (const key of keys) {
        this.cache.delete(key);
      }
      this.tagIndex.delete(tag);
    }
  }

  async getStats(): Promise<{ size: number; status: string; provider: string }> {
    return {
      size: this.cache.size,
      status: "Healthy",
      provider: "MemoryCacheProvider",
    };
  }
}
