import { Observability } from '../../observability';

export class CacheMetrics {
  private static hits = 0;
  private static misses = 0;
  private static invalidations = 0;
  private static totalLatencyMs = 0;
  private static queryCount = 0;

  static recordHit() {
    this.hits++;
    Observability.getMetrics().recordCounter("cache_hits", 1);
  }

  static recordMiss() {
    this.misses++;
    Observability.getMetrics().recordCounter("cache_misses", 1);
  }

  static recordInvalidation() {
    this.invalidations++;
    Observability.getMetrics().recordCounter("cache_invalidations", 1);
  }

  static recordLatency(ms: number) {
    this.totalLatencyMs += ms;
    this.queryCount++;
    // Future OpenTelemetry histogram recording goes here
  }

  static getStats() {
    const total = this.hits + this.misses;
    const hitRatio = total === 0 ? 0 : (this.hits / total) * 100;
    const avgLatency = this.queryCount === 0 ? 0 : this.totalLatencyMs / this.queryCount;

    return {
      hits: this.hits,
      misses: this.misses,
      invalidations: this.invalidations,
      hitRatio: hitRatio.toFixed(2),
      avgLatencyMs: avgLatency.toFixed(2),
    };
  }
}
