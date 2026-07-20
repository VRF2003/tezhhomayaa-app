import { CacheResolver } from '../core/CacheResolver';
import { CachePolicy } from '../core/CacheProfile';
import { CacheTag } from '../core/CacheKeyFactory';
import { CacheMetrics } from '../metrics/CacheMetrics';

export class ReadThroughStrategy {
  /**
   * Fetches data from cache. If it misses, executes the fetcher, stores the result, and returns it.
   */
  static async execute<T>(
    key: string,
    policy: CachePolicy,
    tags: CacheTag[],
    fetcher: () => Promise<T>
  ): Promise<T> {
    const startTime = performance.now();
    const provider = CacheResolver.resolve();
    
    try {
      const cached = await provider.get<T>(key);
      if (cached !== null) {
        CacheMetrics.recordHit();
        CacheMetrics.recordLatency(performance.now() - startTime);
        
        // Sliding Expiration logic
        if (policy.slidingExpiration) {
          // Fire and forget refresh
          provider.set(key, cached, policy.ttlSeconds, tags).catch(e => {
            // Let Observability handle the error silently in a real implementation
          });
        }
        
        return cached;
      }
    } catch (error) {
      // If cache read fails, gracefully fallback to fetcher
    }

    CacheMetrics.recordMiss();
    
    // Cache Miss -> Execute DB Fetch
    const data = await fetcher();
    
    if (data !== null && data !== undefined) {
      // Store in cache (fire and forget)
      provider.set(key, data, policy.ttlSeconds, tags).catch(e => {});
    }

    CacheMetrics.recordLatency(performance.now() - startTime);
    return data;
  }
}
