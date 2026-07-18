import { AnalyticsEvent } from "../core/types";
import { IAnalyticsRepository } from "./IAnalyticsRepository";

export class InMemoryAnalyticsRepository implements IAnalyticsRepository {
  private events: AnalyticsEvent[] = [];

  async store(event: AnalyticsEvent): Promise<void> {
    this.events.push(event);
  }

  // Exposed strictly for internal testing or dumping, normally dashboard 
  // reads from the AggregationRepository.
  async getRawEvents(): Promise<AnalyticsEvent[]> {
    return [...this.events];
  }
}
