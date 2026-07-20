import { CacheTag } from './CacheKeyFactory';

export interface CacheItem<T> {
  value: T;
  tags: CacheTag[];
  expiresAt: number;
}

export interface ICacheProvider {
  get<T>(key: string): Promise<T | null>;
  set<T>(key: string, value: T, ttlSeconds: number, tags?: CacheTag[]): Promise<void>;
  invalidate(key: string): Promise<void>;
  invalidateByTag(tag: CacheTag): Promise<void>;
  getStats(): Promise<{ size: number; status: string; provider: string }>;
}
