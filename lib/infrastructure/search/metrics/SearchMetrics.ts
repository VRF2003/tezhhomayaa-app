export class SearchMetrics {
  private static totalSearches = 0;
  private static zeroResultSearches = 0;
  private static avgLatency = 0;

  static recordSearch(latency: number, resultCount: number): void {
    this.totalSearches++;
    if (resultCount === 0) {
      this.zeroResultSearches++;
    }
    this.avgLatency = ((this.avgLatency * (this.totalSearches - 1)) + latency) / this.totalSearches;
  }

  static getMetrics() {
    return {
      totalSearches: this.totalSearches,
      zeroResultSearches: this.zeroResultSearches,
      avgLatency: this.avgLatency
    };
  }
}
