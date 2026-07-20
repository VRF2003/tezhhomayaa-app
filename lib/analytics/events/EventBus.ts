import { AnalyticsEvent } from "../core/types";
import { Observability } from "@/lib/infrastructure/observability";

export interface IEventBus {
  publish(event: AnalyticsEvent): void;
  subscribe(handler: (event: AnalyticsEvent) => void): void;
}

/**
 * A lightweight, in-memory event bus implementation.
 * In a real-world enterprise setting, this could wrap Kafka, Google Cloud Pub/Sub, or AWS EventBridge.
 */
export class InMemoryEventBus implements IEventBus {
  private handlers: Array<(event: AnalyticsEvent) => void> = [];

  publish(event: AnalyticsEvent): void {
    // Fire and forget asynchronously to ensure we don't block the caller
    setTimeout(() => {
      for (const handler of this.handlers) {
        try {
          handler(event);
        } catch (e) {
          Observability.getLogger("System").error.bind(Observability.getLogger("System"), "Error")("[EventBus] Subscriber failed to process event:", e);
        }
      }
    }, 0);
  }

  subscribe(handler: (event: AnalyticsEvent) => void): void {
    this.handlers.push(handler);
  }
}

// Global singleton for the application lifecycle
export const GlobalEventBus = new InMemoryEventBus();
