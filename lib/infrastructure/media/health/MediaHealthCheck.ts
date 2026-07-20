import { MediaService } from "../core/MediaService";
import { MediaMetrics } from "../metrics/MediaMetrics";

export class MediaHealthCheck {
  static async check(): Promise<{
    healthy: boolean;
    provider: string;
    storageUsageBytes: number;
    metrics: any;
    message?: string;
  }> {
    try {
      const provider = MediaService.getProvider();
      const isHealthy = await provider.healthCheck();
      const usage = await provider.getStorageUsage();
      const metrics = MediaMetrics.getMetrics();
      
      return {
        healthy: isHealthy,
        provider: provider.name,
        storageUsageBytes: usage,
        metrics
      };
    } catch (error) {
      return {
        healthy: false,
        provider: "unknown",
        storageUsageBytes: 0,
        metrics: MediaMetrics.getMetrics(),
        message: (error as Error).message
      };
    }
  }
}
