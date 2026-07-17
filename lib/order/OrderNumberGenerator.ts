/**
 * Abstracts the generation of legally distinct order numbers.
 * Future phases can replace the in-memory counter with Snowflake IDs or database sequences.
 */
export class OrderNumberGenerator {
  // Simple in-memory sequence for Phase 6.2
  private static sequence = 100000;

  /**
   * Generates a unique order number formatted as [BRAND]-[REGION]-[SEQUENCE]
   * Example: TZ-IN-100001
   */
  static generate(marketCode: string): string {
    const brand = "TZ";
    const region = marketCode.toUpperCase();
    
    // Increment sequence atomically (simulated)
    const currentSeq = ++this.sequence;

    return `${brand}-${region}-${currentSeq}`;
  }
}
