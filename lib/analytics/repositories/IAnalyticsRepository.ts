import { AnalyticsEvent } from "../core/types";

export interface IAnalyticsRepository {
  /**
   * Stores a raw event immutably.
   * Implementation could write to PostgreSQL, Snowflake, BigQuery, etc.
   */
  store(event: AnalyticsEvent): Promise<void>;
}
