export class MediaMetrics {
  private static uploadLatency: number[] = [];
  private static failedUploads = 0;
  private static storageGrowthBytes = 0;
  private static processingTimes = {
    metadata: [] as number[],
    transformation: [] as number[],
    optimization: [] as number[],
    variants: [] as number[]
  };

  static recordUpload(latencyMs: number, sizeBytes: number) {
    this.uploadLatency.push(latencyMs);
    this.storageGrowthBytes += sizeBytes;
  }

  static recordFailure() {
    this.failedUploads++;
  }

  static recordProcessing(times: { metadataExtraction: number, transformation: number, optimization: number, variants: number }) {
    this.processingTimes.metadata.push(times.metadataExtraction);
    this.processingTimes.transformation.push(times.transformation);
    this.processingTimes.optimization.push(times.optimization);
    this.processingTimes.variants.push(times.variants);
  }

  static getMetrics() {
    return {
      avgUploadLatency: this.avg(this.uploadLatency),
      failedUploads: this.failedUploads,
      storageGrowth: this.storageGrowthBytes,
      avgTransformationTime: this.avg(this.processingTimes.transformation),
      avgOptimizationTime: this.avg(this.processingTimes.optimization),
      avgVariantGenerationTime: this.avg(this.processingTimes.variants)
    };
  }

  private static avg(arr: number[]): number {
    if (arr.length === 0) return 0;
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  }
}
