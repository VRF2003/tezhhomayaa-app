import { InfrastructureEventBus } from '../../events/InfrastructureEventBus';
import { CacheResolver } from '../core/CacheResolver';
import { CacheTag } from '../core/CacheKeyFactory';
import { CacheMetrics } from '../metrics/CacheMetrics';

export class InvalidationManager {
  static initialize() {
    InfrastructureEventBus.subscribe('content.published', async (payload: { tags: CacheTag[] }) => {
      await this.invalidateTags(payload.tags);
    });

    InfrastructureEventBus.subscribe('market.activated', async () => {
      await this.invalidateTags(['market', 'navigation', 'homepage']);
    });
    
    // Add other infrastructure events here
  }

  static async invalidateTags(tags: CacheTag[]): Promise<void> {
    const provider = CacheResolver.resolve();
    for (const tag of tags) {
      await provider.invalidateByTag(tag);
      CacheMetrics.recordInvalidation();
    }
  }

  static async invalidateKey(key: string): Promise<void> {
    const provider = CacheResolver.resolve();
    await provider.invalidate(key);
    CacheMetrics.recordInvalidation();
  }
}
