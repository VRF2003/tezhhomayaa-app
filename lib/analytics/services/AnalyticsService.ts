import { AnalyticsEvent } from "../core/types";
import { IEventBus } from "../events/EventBus";
import { IAnalyticsRepository } from "../repositories/IAnalyticsRepository";
import { IAggregationRepository } from "../repositories/IAggregationRepository";

export class AnalyticsService {
  constructor(
    private eventBus: IEventBus,
    private rawRepo: IAnalyticsRepository,
    private aggRepo: IAggregationRepository
  ) {}

  /**
   * Initializes the subscriber to listen for events on the EventBus.
   */
  initialize(): void {
    this.eventBus.subscribe((event) => this.handleEvent(event));
  }

  /**
   * Main subscriber handler. 
   * This logic runs purely out-of-band and never blocks standard rendering.
   */
  private async handleEvent(event: AnalyticsEvent): Promise<void> {
    try {
      // 1. Validate Schema version
      if (!event.eventVersion || !event.eventId) {
        console.warn("[AnalyticsService] Invalid event schema:", event);
        return;
      }

      // 2. Persist raw event immutably (e.g. to BigQuery or Postgres)
      await this.rawRepo.store(event);

      // 3. Fan-out to update aggregations (e.g. increment materialized views)
      await this.aggRepo.incrementAggregates(event);
      
    } catch (e) {
      console.error("[AnalyticsService] Failed to process event:", e);
    }
  }
}
