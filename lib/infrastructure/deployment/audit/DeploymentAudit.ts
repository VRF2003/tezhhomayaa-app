import { Observability } from '../../observability';
import { EnvironmentResolver } from '../environment/EnvironmentResolver';

export type AuditEvent = 'DeploymentStarted' | 'DeploymentCompleted' | 'DeploymentFailed' | 'RollbackStarted' | 'RollbackCompleted';

export class DeploymentAudit {
  static record(event: AuditEvent, metadata: Record<string, any> = {}) {
    const logger = Observability.getLogger("DeploymentPlatform");
    const payload = {
      event,
      environment: EnvironmentResolver.getCurrentEnvironment(),
      timestamp: new Date().toISOString(),
      ...metadata
    };

    if (event.includes('Failed')) {
      logger.error("DeploymentAudit", `Deployment Event: ${event}`, payload);
    } else {
      logger.info("DeploymentAudit", `Deployment Event: ${event}`, payload);
    }
    
    // In a production system, this could also write to a dedicated AuditRepository
  }
}
