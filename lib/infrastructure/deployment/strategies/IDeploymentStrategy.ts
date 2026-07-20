import { Release } from '../releases/ReleaseManager';

export interface IDeploymentStrategy {
  execute(release: Release): Promise<void>;
  rollback(release: Release): Promise<void>;
}

export class StandardDeploymentStrategy implements IDeploymentStrategy {
  async execute(release: Release): Promise<void> {
    // In a standard deployment, we just activate and assume load balancers switch over instantly
  }

  async rollback(release: Release): Promise<void> {
    // Standard rollback just marks as rolled back
  }
}

// Extension Points
export class RollingDeploymentStrategy implements IDeploymentStrategy {
  async execute(release: Release): Promise<void> { throw new Error("Not Implemented"); }
  async rollback(release: Release): Promise<void> { throw new Error("Not Implemented"); }
}

export class BlueGreenDeploymentStrategy implements IDeploymentStrategy {
  async execute(release: Release): Promise<void> { throw new Error("Not Implemented"); }
  async rollback(release: Release): Promise<void> { throw new Error("Not Implemented"); }
}

export class CanaryDeploymentStrategy implements IDeploymentStrategy {
  async execute(release: Release): Promise<void> { throw new Error("Not Implemented"); }
  async rollback(release: Release): Promise<void> { throw new Error("Not Implemented"); }
}
