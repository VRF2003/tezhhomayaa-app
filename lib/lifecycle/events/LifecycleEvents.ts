import { Observability } from "@/lib/infrastructure/observability";
export type LifecycleEventType =
  | "PACKAGE_SUBMITTED_FOR_REVIEW"
  | "PACKAGE_APPROVED"
  | "PACKAGE_SCHEDULED"
  | "PACKAGE_PUBLISHED"
  | "PACKAGE_PAUSED"
  | "PACKAGE_ARCHIVED"
  | "PACKAGE_REJECTED"
  | "PACKAGE_ROLLED_BACK";

export interface LifecycleEvent {
  eventId: string;
  eventType: LifecycleEventType;
  packageId: string;
  actor: string;
  timestamp: string;
  metadata?: any;
}

export interface ILifecycleEventBus {
  publish(event: LifecycleEvent): void;
  subscribe(handler: (event: LifecycleEvent) => void): void;
}

export class InMemoryLifecycleEventBus implements ILifecycleEventBus {
  private handlers: Array<(event: LifecycleEvent) => void> = [];

  publish(event: LifecycleEvent): void {
    setTimeout(() => {
      for (const handler of this.handlers) {
        try {
          handler(event);
        } catch (e) {
          Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("[LifecycleEventBus] Handler failed:", e);
        }
      }
    }, 0);
  }

  subscribe(handler: (event: LifecycleEvent) => void): void {
    this.handlers.push(handler);
  }
}

export const GlobalLifecycleEventBus = new InMemoryLifecycleEventBus();
