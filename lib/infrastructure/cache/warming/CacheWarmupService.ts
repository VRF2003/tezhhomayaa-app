import { RepositoryResolver } from '../../persistence/resolver/RepositoryResolver';
import { IDocumentRepository } from '@/lib/content/repositories/IDocumentRepository';
import { Observability } from '../../observability';
import { InfrastructureEventBus } from '../../events/InfrastructureEventBus';

export class CacheWarmupService {
  static initialize() {
    // Listen for startup and publishing events to trigger warmups
    InfrastructureEventBus.subscribe('system.startup', async () => {
      await this.warmupCriticalPaths();
    });

    InfrastructureEventBus.subscribe('content.published', async () => {
      await this.warmupCriticalPaths();
    });
  }

  static async warmupCriticalPaths(): Promise<void> {
    const startTime = performance.now();
    try {
      const docRepo = RepositoryResolver.resolve<IDocumentRepository>('DocumentRepository');
      
      // Warm up generic critical paths
      // Note: In real implementation, these would fetch via their respective domain services
      // to ensure all layers are warmed (e.g., SeoService, LayoutService)
      
      await Promise.all([
        docRepo.getDocument('homepage'),
        docRepo.getDocument('navigation'),
        docRepo.getDocument('pages'),
        docRepo.getDocument('menus')
      ]);

      const duration = performance.now() - startTime;
      Observability.getLogger("System").info("CacheWarmup", `Critical paths warmed up successfully in ${duration.toFixed(2)}ms`);
      
    } catch (error) {
      Observability.getLogger("System").error("CacheWarmup", "Failed to warmup critical paths", error);
    }
  }
}
