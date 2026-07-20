import { ReleaseManager, Release } from '../releases/ReleaseManager';
import { DeploymentAudit } from '../audit/DeploymentAudit';
import { CacheResolver } from '../../cache/core/CacheResolver';
import { CacheWarmupService } from '../../cache/warming/CacheWarmupService';
import { HealthMonitor } from '../../health/HealthMonitor';
import { ConfigService } from '../configuration/ConfigService';

export class RollbackManager {
  static async rollbackToPrevious(): Promise<boolean> {
    const history = ReleaseManager.getHistory();
    const active = ReleaseManager.getActiveRelease();
    
    // Find the last stable release
    const previous = history.reverse().find(r => r.state === 'Deprecated' || r.state === 'Archived');
    
    if (!previous) {
      DeploymentAudit.record('RollbackFailed', { reason: 'No previous stable release found' });
      return false;
    }

    DeploymentAudit.record('RollbackStarted', { 
      fromVersion: active?.id, 
      toVersion: previous.id 
    });

    try {
      // 1. Restore Configuration
      ConfigService.clearCache();
      ConfigService.initialize(); // Would reload previous configs in real system

      // 2. Invalidate Global Cache
      const cache = CacheResolver.resolve();
      // Usually, a full flush is done during major rollback to prevent stale schemas
      await cache.invalidateByTag('homepage'); 
      await cache.invalidateByTag('navigation');

      // 3. Warm Cache
      await CacheWarmupService.warmupCriticalPaths();

      // 4. Verify Health
      const health = await HealthMonitor.getSystemHealth();
      if (health.connectionHealth !== 'Healthy') {
        throw new Error("System health check failed after rollback");
      }

      // 5. Update Release States
      if (active) {
        active.state = 'Rolled Back';
        active.rolledBackAt = new Date().toISOString();
      }
      ReleaseManager.activateRelease(previous.id);

      DeploymentAudit.record('RollbackCompleted', { targetVersion: previous.id });
      return true;

    } catch (error: any) {
      DeploymentAudit.record('RollbackFailed', { error: error.message });
      return false;
    }
  }
}
