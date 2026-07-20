import { getActiveProvider } from "../persistence/core/PersistenceProvider";
import { DatabaseFactory } from "../persistence/core/DatabaseFactory";
import { CacheResolver } from "../cache/core/CacheResolver";
import { MigrationRunner } from "../persistence/migrations/MigrationRunner";

export class HealthMonitor {
  public static async getSystemHealth() {
    const driver = DatabaseFactory.getDriver();
    const activeProvider = getActiveProvider();
    
    // Check connections
    const dbConnected = driver.isConnected();
    const dbHealth = await driver.healthCheck();
    const dbLatency = await driver.getLatency();
    
    // Cache
    const cacheProvider = CacheResolver.resolve();
    const cacheStats = await cacheProvider.getStats();
    
    // Migrations
    const migrations = MigrationRunner.getHistory();

    return {
      activeDriver: driver.getName(),
      activeProvider: activeProvider,
      repositoryStatus: dbHealth ? "Online" : "Degraded",
      cacheStatus: cacheStats.status,
      migrationStatus: migrations.length > 0 ? "Up to date" : "Pending",
      connectionHealth: dbConnected && dbHealth ? "Healthy" : "Unhealthy",
      transactionHealth: dbHealth ? "Healthy" : "Unknown",
      latency: `${Math.round(dbLatency)}ms`,
      metrics: {
        cacheSize: cacheStats.size,
        totalMigrations: migrations.length,
      }
    };
  }
}
