import { SearchService } from "../core/SearchService";

export class SearchHealthCheck {
  static async check(): Promise<{
    healthy: boolean;
    provider: string;
    message?: string;
  }> {
    try {
      const provider = SearchService.getProvider();
      const isHealthy = await provider.healthCheck();
      
      return {
        healthy: isHealthy,
        provider: provider.name,
      };
    } catch (error) {
      return {
        healthy: false,
        provider: "unknown",
        message: (error as Error).message
      };
    }
  }
}
