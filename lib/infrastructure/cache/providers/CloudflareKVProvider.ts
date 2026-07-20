import { ICacheProvider } from '../core/ICacheProvider';
import { CacheTag } from '../core/CacheKeyFactory';

export class CloudflareKVProvider implements ICacheProvider {
  async get<T>(key: string): Promise<T | null> {
    throw new Error("CloudflareKVProvider is a skeleton and not fully implemented.");
  }

  async set<T>(key: string, value: T, ttlSeconds: number, tags: CacheTag[] = []): Promise<void> {
    throw new Error("CloudflareKVProvider is a skeleton and not fully implemented.");
  }

  async invalidate(key: string): Promise<void> {
    throw new Error("CloudflareKVProvider is a skeleton and not fully implemented.");
  }

  async invalidateByTag(tag: CacheTag): Promise<void> {
    throw new Error("CloudflareKVProvider is a skeleton and not fully implemented.");
  }

  async getStats(): Promise<{ size: number; status: string; provider: string }> {
    return { size: 0, status: "Not Implemented", provider: "CloudflareKVProvider" };
  }
}
